import type { Metadata } from "next";
import Link from "next/link";
import {
  AddressForm,
  type EditableAddress,
} from "@/components/account/address-form";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/actions/addresses";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Addresses",
  description: "Manage your NOIRÉ delivery addresses.",
};

type SearchParams = Promise<{ edit?: string | string[] }>;

export default async function AccountAddressesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  const params = await searchParams;
  const editId = Array.isArray(params.edit) ? params.edit[0] : params.edit;
  let addresses: EditableAddress[] = [];

  if (supabase && user) {
    const { data } = await supabase
      .from("addresses")
      .select(
        "id, label, first_name, last_name, line1, line2, city, state, postal_code, country, phone, is_default",
      )
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    addresses = (data as EditableAddress[] | null) ?? [];
  }

  const editing = editId
    ? addresses.find((address) => address.id === editId)
    : undefined;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Account</span>
          <h2 className="mt-2 font-serif text-[32px] leading-none">Addresses</h2>
        </div>
        <span className="text-xs text-muted">
          {addresses.length} saved
        </span>
      </div>

      <div className="mt-8 grid gap-10 xl:grid-cols-[1fr_380px]">
        <div>
          {addresses.length === 0 ? (
            <div className="border border-line px-6 py-10 text-center">
              <p className="font-serif text-[26px]">No saved addresses.</p>
              <p className="mt-2 text-sm text-muted">
                Add one to make checkout faster.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <li key={address.id} className="border border-line p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">
                      {address.label || "Address"}
                    </p>
                    {address.is_default ? (
                      <span className="border border-line px-2 py-1 text-[9px] uppercase tracking-[0.08em] text-muted">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
                    {address.first_name} {address.last_name}
                    <br />
                    {address.line1}
                    {address.line2 ? (
                      <>
                        <br />
                        {address.line2}
                      </>
                    ) : null}
                    <br />
                    {address.city}, {address.state} {address.postal_code}
                    <br />
                    {address.country}
                    {address.phone ? (
                      <>
                        <br />
                        {address.phone}
                      </>
                    ) : null}
                  </address>
                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-3 text-xs">
                    <Link
                      href={`/account/addresses?edit=${address.id}`}
                      className="underline underline-offset-4"
                    >
                      Edit
                    </Link>
                    {!address.is_default ? (
                      <form action={setDefaultAddressAction}>
                        <input type="hidden" name="id" value={address.id} />
                        <button
                          type="submit"
                          className="text-muted underline underline-offset-4 hover:text-ink"
                        >
                          Set default
                        </button>
                      </form>
                    ) : null}
                    <form action={deleteAddressAction} className="ml-auto">
                      <input type="hidden" name="id" value={address.id} />
                      <button
                        type="submit"
                        className="text-muted hover:text-oxblood"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="h-fit border border-line bg-paper p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-[24px] leading-none">
              {editing ? "Edit address" : "Add an address"}
            </h3>
            {editing ? (
              <Link
                href="/account/addresses"
                className="text-xs text-muted hover:text-ink"
              >
                Cancel
              </Link>
            ) : null}
          </div>
          <div className="mt-5">
            <AddressForm key={editing?.id ?? "new"} address={editing} />
          </div>
        </aside>
      </div>
    </div>
  );
}
