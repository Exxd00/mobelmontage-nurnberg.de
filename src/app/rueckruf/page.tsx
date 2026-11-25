import type { Metadata } from "next";
import { Directory, Intro } from "@/components/service/Directory";
import { inquiryHref, inquiryServices, readInquiryIds, resolveInquiry } from "@/lib/inquiry-context";
import { resolveDirectoryReference } from "@/lib/inquiry-directory";
import { projects } from "@/lib/projects";
import CallbackForm from "./CallbackForm";

export const metadata: Metadata = {
  title: "Rückruf anfragen",
  description: "Name, Rückrufnummer und auf Wunsch eine passende Zeit angeben.",
  alternates: { canonical: "/rueckruf" },
  robots: { index: false, follow: true },
};

export default async function CallbackPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const ids = readInquiryIds(await searchParams);
  const context = resolveInquiry(ids, Object.fromEntries(projects.map(project => [project.slug, project.title])), resolveDirectoryReference(ids), "callback");
  const service = context.ids.service;
  const note = [service && "Leistung: " + inquiryServices[service], context.reference].filter(Boolean).join("\n");
  return <Directory crumbs={[{ label: "Rückruf", href: "/rueckruf" }]} offerHref={inquiryHref(context.ids)}>
    <Intro title="Wann erreichen wir Sie?" description="Hinterlassen Sie uns Ihre Nummer. Im Gespräch klären wir, welche Arbeiten anstehen und welche Angaben wir für Ihr Angebot brauchen."/>
    <CallbackForm key={note} context={context.ids} note={note}/>
  </Directory>;
}
