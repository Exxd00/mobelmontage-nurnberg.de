import Link from "next/link";
import { businessInfo } from "@/lib/data";
import styles from "@/components/service/Directory.module.css";

interface FormCTAProps {
  title?: string;
  subtitle?: string;
  cityName?: string;
  serviceName?: string;
  href?: string;
  compact?: boolean;
}

export default function FormCTA({
  title,
  subtitle,
  cityName,
  serviceName,
  href = "/#kontakt-form",
  compact,
}: FormCTAProps) {
  const subject = [serviceName ?? "Angebot", cityName && `in ${cityName}`]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={compact ? undefined : "anfrage"} className={styles.cta}>
      <h2>{title ?? `${subject} anfragen`}</h2>
      <p>
        {subtitle ??
          "Im Formular geben Sie die Arbeiten, den Einsatzort und Ihren Terminwunsch an. Unser Montageteam prüft den Umfang und meldet sich mit Ihrem persönlichen Angebot oder einer Rückfrage."}
      </p>
      <div className={styles.links}>
        <Link className={styles.primary} href={href}>
          Zum Anfrageformular →
        </Link>
        <a href={`tel:${businessInfo.phone.replace(/\s/g, "")}`}>
          {businessInfo.phone}
        </a>
        <a href={`https://wa.me/${businessInfo.whatsapp.replace(/\D/g, "")}`}>
          WhatsApp
        </a>
      </div>
    </section>
  );
}
