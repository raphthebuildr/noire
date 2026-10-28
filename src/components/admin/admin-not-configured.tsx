export function AdminNotConfigured() {
  return (
    <div className="border border-line bg-paper p-8">
      <h1 className="font-serif text-[32px]">Admin is not configured.</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Add the Supabase secret key to{" "}
        <code className="bg-surface px-1.5 py-0.5 text-xs">.env.local</code> and
        apply the migrations to activate the admin area.
      </p>
    </div>
  );
}
