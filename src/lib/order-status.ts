export const orderStatusLabels: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  paid_out_of_stock: "Paid · stock issue",
};

export const orderStatusStyles: Record<string, string> = {
  pending: "border-line text-muted",
  paid: "border-ink/20 bg-ink text-canvas",
  processing: "border-[#c8b9a1] bg-[#e9e2d5] text-ink",
  shipped: "border-[#b7c3c6] bg-[#dde5e5] text-ink",
  delivered: "border-[#b9c8b7] bg-[#e1e9df] text-ink",
  cancelled: "border-line text-muted line-through",
  refunded: "border-line text-muted",
  paid_out_of_stock: "border-oxblood/30 bg-oxblood/10 text-oxblood",
};

export function orderStatusLabel(status: string) {
  return orderStatusLabels[status] ?? status;
}

export function orderStatusStyle(status: string) {
  return orderStatusStyles[status] ?? "border-line text-muted";
}
