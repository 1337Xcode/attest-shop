import { ensureOrders, sql } from "@/lib/db";
import { createSession } from "@/lib/payments";

export const dynamic = "force-dynamic";

const PRICE_PENCE = 2400;
const MAX_QUANTITY = 9;
const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function newOrderId(): string {
  const chars = Array.from(
    { length: 16 },
    () => ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)],
  );
  return `ord_${chars.join("")}`;
}

interface CheckoutBody {
  sku?: unknown;
  qty?: unknown;
  card?: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutBody | null;

  const sku = typeof body?.sku === "string" ? body.sku.trim() : "";
  const qty = Number(body?.qty);
  const card = typeof body?.card === "string" ? body.card.trim() : "";

  if (!sku || !card || !Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY) {
    return Response.json({ error: "sku, qty and card are required" }, { status: 400 });
  }

  await ensureOrders();
  const session = await createSession(card);

  // Guest checkout has no customer object, so this must tolerate null.
  const customerId = session?.customer?.id ?? "guest";

  const orderId = newOrderId();
  await sql()`
    insert into orders (id, sku, qty, customer_id, amount, status)
    values (${orderId}, ${sku}, ${qty}, ${customerId}, ${PRICE_PENCE * qty}, 'paid')
  `;

  return Response.json({ orderId, amount: PRICE_PENCE * qty });
}
