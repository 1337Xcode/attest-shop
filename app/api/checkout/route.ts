import { ensureOrders, sql } from "@/lib/db";
import { createSession } from "@/lib/payments";

const PRICE_PENCE = 2400;
const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function newOrderId(): string {
  const chars = Array.from(
    { length: 16 },
    () => ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)],
  );
  return `ord_${chars.join("")}`;
}

export async function POST(request: Request) {
  const { sku, qty, card } = (await request.json()) as {
    sku: string;
    qty: number;
    card: string;
  };

  await ensureOrders();
  const session = await createSession(card);

  const customerId = session.customer!.id;

  const orderId = newOrderId();
  await sql()`
    insert into orders (id, sku, qty, customer_id, amount, status)
    values (${orderId}, ${sku}, ${qty}, ${customerId}, ${PRICE_PENCE * qty}, 'paid')
  `;

  return Response.json({ orderId });
}
