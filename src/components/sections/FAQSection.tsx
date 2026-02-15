"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Wie viel kostet die Möbelmontage?",
    answer: "Die Kosten hängen von der Art und Anzahl der Möbel ab. Wir bieten transparente Festpreise ohne versteckte Kosten. Kontaktieren Sie uns für ein kostenloses, unverbindliches Angebot.",
  },
  {
    question: "Wie schnell können Sie einen Termin machen?",
    answer: "In der Regel können wir innerhalb von 24-48 Stunden einen Termin vereinbaren. Bei dringenden Anfragen sind oft auch kurzfristigere Termine möglich.",
  },
  {
    question: "Montieren Sie auch IKEA Küchen?",
    answer: "Ja, wir sind auf IKEA Küchenmontage spezialisiert. Unser Team hat jahrelange Erfahrung mit METOD Küchen und allen anderen IKEA Küchensystemen.",
  },
  {
    question: "Holen Sie die Möbel auch ab?",
    answer: "Ja, wir bieten einen kompletten Service an: Abholung vom Möbelhaus, Lieferung zu Ihnen nach Hause und professionelle Montage - alles aus einer Hand.",
  },
  {
    question: "Welche Zahlungsmethoden akzeptieren Sie?",
    answer: "Wir akzeptieren Barzahlung und Überweisung. Die Zahlung erfolgt nach erfolgreich abgeschlossener Montage.",
  },
  {
    question: "Gibt es eine Garantie auf die Montage?",
    answer: "Ja, wir geben eine Garantie auf alle unsere Montagearbeiten. Sollte etwas nicht zu Ihrer Zufriedenheit sein, beheben wir es kostenlos.",
  },
  {
    question: "In welchen Städten sind Sie tätig?",
    answer: "Wir sind in Nürnberg und der gesamten Metropolregion tätig, einschließlich Fürth, Erlangen, Schwabach, und über 500 weiteren Städten und Gemeinden in Bayern.",
  },
  {
    question: "Muss ich während der Montage anwesend sein?",
    answer: "Es ist hilfreich, wenn Sie am Anfang da sind, um Details zu besprechen. Danach können Sie uns gerne die Arbeit überlassen. Wir informieren Sie, wenn wir fertig sind.",
  },
];

// JSON-LD Schema for FAQ
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-muted/30" id="faq">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hier finden Sie Antworten auf die häufigsten Fragen zu unseren Dienstleistungen
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors min-h-[56px]"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
