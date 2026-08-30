import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attest Tee",
  description: "A one-product storefront used to exercise a real checkout.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fafaf9", color: "#1c1c1a" }}>{children}</body>
    </html>
  );
}
