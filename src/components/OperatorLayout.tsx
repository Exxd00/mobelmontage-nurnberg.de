import type { ReactNode } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOperatorAuthorized } from "@/lib/operator-access";

export default async function OperatorLayout({ children }: { children: ReactNode }) {
  if (!await isOperatorAuthorized((await headers()).get("authorization"))) notFound();
  return children;
}
