"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Bounded so the basket can never reach a quantity the price cannot represent. */
export const MAX_QUANTITY = 9;

export function Quantity({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 rounded-[var(--radius-control)] border border-line p-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="One fewer"
        data-testid="qty-down"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" />
      </Button>
      <span className="w-8 text-center text-sm" data-numeric data-testid="qty">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="One more"
        data-testid="qty-up"
        disabled={disabled || value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
