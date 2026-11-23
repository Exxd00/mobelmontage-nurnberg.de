"use client";

import Link from "next/link";
import { useState } from "react";
import { getPriceExample, priceExamples } from "@/lib/price-examples";
import styles from "@/components/service/Directory.module.css";

export default function PriceEstimator() {
  const [id, setId] = useState("");
  const example = getPriceExample(id);
  return (
    <div>
      <div className={styles.filters}>
        <label htmlFor="preis-vorhaben">
          Welches Vorhaben passt?
          <select id="preis-vorhaben" value={id} onChange={(event) => setId(event.target.value)}>
            <option value="">Bitte auswählen</option>
            <optgroup label="Konkrete Aufträge">
              {priceExamples.filter((item) => item.duration).map((item) =>
                <option key={item.id} value={item.id}>{item.title}</option>
              )}
            </optgroup>
            <optgroup label="Weitere Vorhaben">
              {priceExamples.filter((item) => !item.duration).map((item) =>
                <option key={item.id} value={item.id}>{item.title}</option>
              )}
            </optgroup>
          </select>
        </label>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {example && <div className={styles.tile}>
          <h3>{example.title}</h3>
          <p className={styles.tilePrice}>
            {example.duration ? "Richtpreis" : "Einstiegspreis"} ab {example.from}
          </p>
          {example.duration && <p>Für dieses Beispiel sind {example.duration} vorgesehen.</p>}
          <p>{example.preparation}</p>
          <Link href={`/?leistung=${example.service}&beispiel=${example.id}#kontakt-form`}>
            Mit dieser Auswahl ein Angebot anfragen →
          </Link>
        </div>}
      </div>
    </div>
  );
}
