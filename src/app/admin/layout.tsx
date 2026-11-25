import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montageverwaltung",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export { default } from "@/components/OperatorLayout";
