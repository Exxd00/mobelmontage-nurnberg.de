import { businessInfo } from "./data";
import { businessInquiries, isBusinessInquiry } from "./business-inquiries";
import { inquiryHref, inquiryServices, type InquiryIds } from "./inquiry-context";
import { getPriceExample } from "./price-examples";

export function contactLinks(ids: InquiryIds = {}, labels: { task?: string; city?: string; project?: string } = {}) {
  const example = getPriceExample(ids.example ?? null);
  const business = isBusinessInquiry(ids.business ?? null) ? businessInquiries[ids.business as keyof typeof businessInquiries] : undefined;
  const topic = (example && example.service === ids.service ? example.title : undefined)
    || labels.task || (business?.service === ids.service ? business?.title : undefined)
    || (labels.project && `Küchenmontage wie beim Projekt „${labels.project}“`)
    || (ids.service && Object.hasOwn(inquiryServices, ids.service) ? inquiryServices[ids.service] : "");
  const area = labels.city ? ` im Raum ${labels.city}` : "";
  const draft = topic
    ? `Guten Tag, ich interessiere mich für folgendes Vorhaben${area}: ${topic}. Können Sie mir ein Angebot erstellen?`
    : `Guten Tag, ich habe eine Anfrage zu Montage oder Lieferung${area}. Welche Angaben benötigen Sie für ein Angebot?`;
  return { whatsapp: `https://wa.me/${businessInfo.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(draft)}`, callback: inquiryHref(ids, "callback") };
}
