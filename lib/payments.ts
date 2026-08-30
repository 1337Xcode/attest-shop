/**
 * Payment session stub standing in for Stripe test mode.
 *
 * Guest checkout returns no customer object, which is exactly the shape the
 * real SDK returns and exactly what the checkout route has to cope with.
 */

export interface PaymentSession {
  readonly id: string;
  readonly customer: { id: string } | null;
  readonly cardLast4: string;
}

export async function createSession(card: string): Promise<PaymentSession> {
  return {
    id: `cs_test_${Date.now()}`,
    customer: null,
    cardLast4: card.slice(-4),
  };
}
