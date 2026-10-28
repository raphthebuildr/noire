alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

revoke insert, delete on public.profiles from anon, authenticated;
revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "addresses_own_all" on public.addresses;
create policy "addresses_own_all"
  on public.addresses for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "addresses_admin_all" on public.addresses;
create policy "addresses_admin_all"
  on public.addresses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "collections_public_read" on public.collections;
create policy "collections_public_read"
  on public.collections for select
  to anon, authenticated
  using (true);

drop policy if exists "collections_admin_all" on public.collections;
create policy "collections_admin_all"
  on public.collections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (status = 'active');

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "variants_public_read" on public.product_variants;
create policy "variants_public_read"
  on public.product_variants for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products
      where products.id = product_variants.product_id
        and products.status = 'active'
    )
  );

drop policy if exists "variants_admin_all" on public.product_variants;
create policy "variants_admin_all"
  on public.product_variants for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "images_public_read" on public.product_images;
create policy "images_public_read"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and products.status = 'active'
    )
  );

drop policy if exists "images_admin_all" on public.product_images;
create policy "images_admin_all"
  on public.product_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "carts_own_all" on public.carts;
create policy "carts_own_all"
  on public.carts for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "carts_admin_all" on public.carts;
create policy "carts_admin_all"
  on public.carts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "cart_items_own_all" on public.cart_items;
create policy "cart_items_own_all"
  on public.cart_items for all
  to authenticated
  using (
    exists (
      select 1 from public.carts
      where carts.id = cart_items.cart_id
        and carts.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.carts
      where carts.id = cart_items.cart_id
        and carts.user_id = auth.uid()
    )
  );

drop policy if exists "cart_items_admin_all" on public.cart_items;
create policy "cart_items_admin_all"
  on public.cart_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "coupons_admin_all" on public.coupons;
create policy "coupons_admin_all"
  on public.coupons for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all"
  on public.orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all"
  on public.order_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_events_select_own" on public.order_events;
create policy "order_events_select_own"
  on public.order_events for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_events.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "order_events_admin_all" on public.order_events;
create policy "order_events_admin_all"
  on public.order_events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "reviews_select_own" on public.reviews;
create policy "reviews_select_own"
  on public.reviews for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
  on public.reviews for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and status = 'pending'
  );

drop policy if exists "reviews_admin_all" on public.reviews;
create policy "reviews_admin_all"
  on public.reviews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contact_admin_all" on public.contact_messages;
create policy "contact_admin_all"
  on public.contact_messages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "newsletter_admin_all" on public.newsletter_subscribers;
create policy "newsletter_admin_all"
  on public.newsletter_subscribers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
