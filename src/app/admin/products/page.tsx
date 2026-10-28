import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getCategory, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Admin</span>
          <h1 className="mt-2 font-serif text-[34px] leading-none">Products</h1>
        </div>
        <p className="text-xs text-muted">{products.length} pieces</p>
      </header>

      <p className="mt-5 border border-line bg-paper px-4 py-3 text-xs leading-relaxed text-muted">
        The v1 catalog is code-managed in{" "}
        <code className="bg-surface px-1">src/lib/catalog.ts</code> so the
        storefront and checkout always agree. Edit that file to change products,
        pricing, or stock, then redeploy.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.1em] text-muted">
              <th className="py-3 pr-4 font-normal">Piece</th>
              <th className="py-3 pr-4 font-normal">Category</th>
              <th className="py-3 pr-4 font-normal">Price</th>
              <th className="py-3 pr-4 font-normal">Colours</th>
              <th className="py-3 pr-4 font-normal">Sizes</th>
              <th className="py-3 text-right font-normal">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.colors.reduce(
                (sum, color) =>
                  sum +
                  product.sizes.reduce(
                    (sizeSum, size) =>
                      sizeSum + (product.stock[color.name]?.[size] ?? 0),
                    0,
                  ),
                0,
              );
              const image = product.colors[0]?.image ?? product.gallery[0]?.src;

              return (
                <tr key={product.id} className="border-b border-line">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="relative block h-14 w-11 shrink-0 overflow-hidden bg-surface">
                        {image ? (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="44px"
                            className="image-cover"
                          />
                        ) : null}
                      </span>
                      <span>
                        <Link
                          href={`/products/${product.slug}`}
                          className="block font-serif text-[17px] underline-offset-4 hover:underline"
                        >
                          {product.name}
                        </Link>
                        <span className="mt-0.5 block text-[10px] text-muted">
                          {product.id}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {getCategory(product.category)?.name ?? product.category}
                  </td>
                  <td className="py-3 pr-4">
                    {formatPrice(product.price)}
                    {product.compareAtPrice ? (
                      <span className="ml-1 text-[11px] text-muted line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {product.colors.length}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {product.sizes.length}
                  </td>
                  <td className="py-3 text-right">
                    <span className={totalStock === 0 ? "text-oxblood" : ""}>
                      {totalStock === 0 ? "Sold out" : totalStock}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
