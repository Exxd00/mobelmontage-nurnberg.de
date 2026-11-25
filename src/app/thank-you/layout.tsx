import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Anfragebestätigung",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true },
  alternates: { canonical: null },
};

export default function ConfirmationLayout({ children }: { children: ReactNode }) {
  return children;
}
