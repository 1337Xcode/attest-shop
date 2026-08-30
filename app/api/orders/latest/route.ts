import { ensureOrders, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  sku: string;
  qty: number;
  customer_id: string;
  amount: number;
  status: string;
  created_at: string;
}

/** The most recent order. What a confirmation email would be built from. */
export async function GET() {
  await ensureOrders();
  const [order] = await sql()<OrderRow[]>`
    select id, sku, qty, customer_id, amount, status, created_at
    from orders order by created_at desc limit 1
  `;

  if (!order) return Response.json({ error: "no orders yet" }, { status: 404 });

  return Response.json({
    orderId: order.id,
    sku: order.sku,
    qty: order.qty,
    customerId: order.customer_id,
    amount: order.amount,
    status: order.status,
    createdAt: order.created_at,
  });
}
