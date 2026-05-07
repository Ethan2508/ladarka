import { OrderTracking } from "@/components/order-tracking";

export const metadata = { title: "Suivi de commande" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  return <OrderTracking number={number} />;
}
