import type { Metadata } from "next";
import { Directory, Intro } from "@/components/service/Directory";
import { isBusinessInquiry } from "@/lib/business-inquiries";
import CallbackForm from "./CallbackForm";

export const metadata: Metadata = {
  title: "Rückruf anfragen",
  description: "Name, Rückrufnummer und auf Wunsch eine passende Zeit angeben.",
  alternates: { canonical: "/rueckruf" },
  robots: { index: false, follow: true },
};

export default async function CallbackPage({ searchParams }: {
  searchParams: Promise<{ betrieb?: string | string[] }>;
}) {
  const { betrieb } = await searchParams;
  const business = typeof betrieb === "string" && isBusinessInquiry(betrieb) ? betrieb : null;
  return <Directory crumbs={[{ label: "Rückruf", href: "/rueckruf" }]}>
    <Intro title="Wann erreichen wir Sie?" description="Hinterlassen Sie uns Ihre Nummer. Im Gespräch klären wir, welche Arbeiten anstehen und welche Angaben wir für Ihr Angebot brauchen."/>
    <CallbackForm business={business}/>
  </Directory>;
}
