import type { Metadata } from "next";
import { CartView } from "@/components/commerce/cart-view";

export const metadata: Metadata = {
  title: "Shopping bag",
  description: "Review the pieces in your NOIRÉ bag.",
};

export default function CartPage() {
  return <CartView />;
}
