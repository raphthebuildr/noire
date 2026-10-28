import { cn } from "@/lib/cn";
import {
  orderStatusLabel,
  orderStatusStyle,
} from "@/lib/order-status";

export function OrderStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-[10px] uppercase tracking-[0.08em]",
        orderStatusStyle(status),
        className,
      )}
    >
      {orderStatusLabel(status)}
    </span>
  );
}
