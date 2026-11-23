"use client";
import { useId, useState } from "react";
import Link from "next/link";
import type { City } from "@/lib/service-directory";
import styles from "@/components/service/Directory.module.css";

function normalize(value: string) {
  return value
    .toLocaleLowerCase("de")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

export default function CityFinder({ cities }: { cities: City[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const id = useId();
  const key = normalize(query.trim());
  const places = cities.filter(
    (city) =>
      (!region || city.region === region) &&
      normalize(`${city.name} ${city.slug} ${city.region}`).includes(key),
  );
  const regions = [...new Set(cities.map((c) => c.region))].sort((a, b) =>
    a.localeCompare(b, "de"),
  );
  return (
    <section className={styles.band} aria-labelledby={id}>
      <h2 id={id}>Ort suchen</h2>
      <div className={styles.filters}>
        <label>
          Ortsname
          <input
            type="search"
            autoComplete="off"
            placeholder="z. B. Nürnberg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Region
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Alle Regionen</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>
      <p aria-live="polite" className={styles.count}>
        {places.length} {places.length === 1 ? "Ort" : "Orte"} gefunden
      </p>
      {places.length ? (
        <div className={styles.linkgrid}>
          {places.map((city) => (
            <Link prefetch={false} key={city.slug} href={`/${city.slug}`}>
              <span>{city.name}</span>
              <small>{city.region}</small>
            </Link>
          ))}
        </div>
      ) : (
        <p>
          Teilen Sie uns für weitere Orte die Postleitzahl mit.{" "}
          <Link href="/#kontakt-form">Einsatzort anfragen</Link>
        </p>
      )}
    </section>
  );
}
