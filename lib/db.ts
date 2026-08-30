import postgres from "postgres";

/** One connection for the process, and the orders table created on first use. */

let pool: postgres.Sql | null = null;
let ready: Promise<void> | null = null;

export function sql(): postgres.Sql {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  pool = postgres(url, { max: 4, idle_timeout: 20, connect_timeout: 10 });
  return pool;
}

/**
 * A failure clears the cached promise. Holding on to a rejected one means a
 * database that was briefly unreachable leaves the shop broken for the life of
 * the process, with no way back except a redeploy.
 */
export function ensureOrders(): Promise<void> {
  ready ??= sql()`
    create table if not exists orders (
      id text primary key,
      sku text not null,
      qty int not null,
      customer_id text not null,
      amount int not null,
      status text not null,
      created_at timestamptz not null default now()
    )
  `
    .then(() => undefined)
    .catch((error: unknown) => {
      ready = null;
      throw error;
    });
  return ready;
}
