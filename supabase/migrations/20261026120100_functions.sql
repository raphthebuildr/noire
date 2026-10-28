create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

drop trigger if exists coupons_set_updated_at on public.coupons;
create trigger coupons_set_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
  before update on public.contact_messages
  for each row execute function public.set_updated_at();

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_app_meta_data ->> 'role', 'customer')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    or exists (
      select 1
      from public.profiles
      where id = auth.uid() and role = 'admin'
    );
$$;

create or replace function public.finalize_order(
  p_reference text,
  p_paid boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item public.order_items%rowtype;
  v_variant public.product_variants%rowtype;
  v_short_stock boolean := false;
  v_short_items text[] := '{}';
begin
  select *
  into v_order
  from public.orders
  where paystack_reference = p_reference
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'order_not_found');
  end if;

  if v_order.payment_status = 'paid' then
    return jsonb_build_object(
      'ok', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'already_paid', true
    );
  end if;

  if not p_paid then
    update public.orders
    set payment_status = 'failed'
    where id = v_order.id;

    insert into public.order_events (order_id, type, message)
    values (v_order.id, 'payment_failed', 'Paystack payment was not successful.');

    return jsonb_build_object(
      'ok', false,
      'reason', 'payment_failed',
      'order_id', v_order.id
    );
  end if;

  for v_item in
    select *
    from public.order_items
    where order_id = v_order.id
    order by created_at
  loop
    if v_item.variant_id is not null then
      select *
      into v_variant
      from public.product_variants
      where id = v_item.variant_id
      for update;

      if found and v_variant.stock < v_item.quantity then
        v_short_stock := true;
        v_short_items := array_append(
          v_short_items,
          v_item.product_name || ' / ' || v_item.variant_label
        );
      elsif found then
        update public.product_variants
        set stock = stock - v_item.quantity
        where id = v_variant.id;
      end if;
    end if;
  end loop;

  if v_short_stock then
    update public.orders
    set
      payment_status = 'paid',
      status = 'paid_out_of_stock',
      paid_at = now()
    where id = v_order.id;

    insert into public.order_events (order_id, type, message, data)
    values (
      v_order.id,
      'paid_out_of_stock',
      'Payment captured, but one or more pieces are no longer in stock.',
      jsonb_build_object('items', v_short_items)
    );

    return jsonb_build_object(
      'ok', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'paid_out_of_stock', true,
      'items', v_short_items
    );
  end if;

  update public.orders
  set
    payment_status = 'paid',
    status = 'paid',
    paid_at = now()
  where id = v_order.id;

  if v_order.coupon_code is not null then
    update public.coupons
    set times_redeemed = times_redeemed + 1
    where code = v_order.coupon_code;
  end if;

  insert into public.order_events (order_id, type, message)
  values (v_order.id, 'payment_captured', 'Payment captured successfully.');

  return jsonb_build_object(
    'ok', true,
    'order_id', v_order.id,
    'order_number', v_order.order_number,
    'already_paid', false
  );
end;
$$;

revoke all on function public.finalize_order(text, boolean) from public;
revoke all on function public.finalize_order(text, boolean) from anon;
revoke all on function public.finalize_order(text, boolean) from authenticated;
grant execute on function public.finalize_order(text, boolean) to service_role;

grant execute on function public.is_admin() to anon, authenticated, service_role;
