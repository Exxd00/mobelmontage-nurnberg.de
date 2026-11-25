import { Phone, MessageCircle } from "lucide-react";
import { businessInfo } from "@/lib/data";
import styles from "./contact-actions.module.css";

export default function FloatingButtons({ whatsapp, callback }: { whatsapp: string; callback: string }) {
  return <nav className={styles.dock} data-contact-dock data-default-callback={callback} aria-label="Schnellkontakt">
    <a href={`tel:${businessInfo.phone.replace(/\s/g, "")}`} aria-label="Anrufen" title="Anrufen">
      <Phone aria-hidden="true" size={22}/><span>Anrufen</span>
    </a>
    <a href={whatsapp} data-page-whatsapp={whatsapp} aria-label="Auf WhatsApp schreiben" title="Auf WhatsApp schreiben">
      <MessageCircle aria-hidden="true" size={23}/><span>WhatsApp</span>
    </a>
  </nav>;
}
