"use client";

import { useState } from "react";
import { Check, CreditCard, Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { MAX_QUANTITY, Quantity } from "@/components/ui/quantity";

const PRICE_PENCE = 2400;
const TEST_CARD = "4242424242424242";

type State = "idle" | "buying" | "done" | "error";

const money = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

export default function Shop() {
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<State>("idle");
  const [orderId, setOrderId] = useState("");
  const [detail, setDetail] = useState("");

  async function buy() {
    setState("buying");
    setDetail("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sku: "TEE-01", qty, card: TEST_CARD }),
      });

      if (!res.ok) {
        setDetail(`The checkout returned ${res.status}.`);
        setState("error");
        return;
      }

      const body = (await res.json()) as { orderId: string };
      setOrderId(body.orderId);
      setState("done");
    } catch {
      setDetail("The checkout could not be reached.");
      setState("error");
    }
  }

  const busy = state === "buying";

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-16">
      <Card>
        <CardBody className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-medium tracking-tight">Attest Tee</h1>
              <p className="mt-1 text-sm text-muted">Midweight cotton. One colour. Ships free.</p>
            </div>
            <span className="text-lg" data-numeric data-testid="price">
              {money(PRICE_PENCE)}
            </span>
          </div>

          <div
            aria-hidden
            className="h-40 rounded-[var(--radius-control)] bg-[linear-gradient(135deg,oklch(0.93_0.01_85),oklch(0.87_0.02_250))]"
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Quantity</span>
            <Quantity value={qty} onChange={setQty} disabled={busy} />
          </div>

          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm text-muted">Total</span>
            <span className="text-lg font-medium" data-numeric data-testid="total">
              {money(PRICE_PENCE * qty)}
            </span>
          </div>

          <Button
            className="w-full"
            data-testid="buy"
            onClick={buy}
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Taking payment
              </>
            ) : (
              <>
                <CreditCard className="size-4" /> Buy now
              </>
            )}
          </Button>

          {state === "done" ? (
            <p
              data-testid="confirmation"
              className="flex items-start gap-2 text-sm text-good"
              role="status"
            >
              <Check className="mt-0.5 size-4 shrink-0" />
              <span>
                Order confirmed: <span data-numeric>{orderId}</span>
              </span>
            </p>
          ) : null}

          {state === "error" ? (
            <p
              data-testid="error"
              className="flex items-start gap-2 text-sm text-bad"
              role="alert"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <span>Something went wrong. {detail}</span>
            </p>
          ) : null}
        </CardBody>

        <CardFooter className="text-xs text-muted">
          Test card {TEST_CARD.replace(/(\d{4})(?=\d)/gu, "$1 ")}. Up to {MAX_QUANTITY} per order.
        </CardFooter>
      </Card>
    </main>
  );
}
