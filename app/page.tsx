"use client";

import { useState } from "react";

type State = "idle" | "buying" | "done" | "error";

export default function Shop() {
  const [state, setState] = useState<State>("idle");
  const [orderId, setOrderId] = useState("");

  async function buy() {
    setState("buying");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sku: "TEE-01", qty: 1, card: "4242424242424242" }),
      });
      if (!res.ok) {
        setState("error");
        return;
      }
      const body = (await res.json()) as { orderId: string };
      setOrderId(body.orderId);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <main
      style={{
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        maxWidth: 420,
        margin: "80px auto",
        padding: "0 20px",
      }}
    >
      <h1 style={{ fontSize: 28, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Attest Tee</h1>
      <p style={{ color: "#6b6b65", margin: "0 0 24px" }}>£24.00</p>

      <button
        data-testid="buy"
        onClick={buy}
        disabled={state === "buying"}
        style={{
          background: "#1c1c1a",
          color: "#fff",
          border: 0,
          borderRadius: 10,
          padding: "10px 18px",
          fontSize: 15,
          cursor: state === "buying" ? "default" : "pointer",
          opacity: state === "buying" ? 0.6 : 1,
        }}
      >
        {state === "buying" ? "Processing…" : "Buy now"}
      </button>

      {state === "done" ? (
        <p data-testid="confirmation" style={{ marginTop: 20, color: "#166534" }}>
          Order confirmed: {orderId}
        </p>
      ) : null}

      {state === "error" ? (
        <p data-testid="error" style={{ marginTop: 20, color: "#b91c1c" }}>
          Something went wrong.
        </p>
      ) : null}
    </main>
  );
}
