import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type KitchenProject } from "@/lib/projects";
import styles from "@/app/arbeiten/projects.module.css";

export function ProjectCover({
  project,
  sizes,
  priority = false,
}: {
  project: KitchenProject;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`/projekte/${project.slug}/hero-640.webp 640w, ${project.cover.src} 1080w`}
        sizes={sizes}
      />
      <img
        src={project.cover.src}
        width={1080}
        height={720}
        alt={project.cover.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}

export default function Gallery() {
  return (
    <ul className={styles.grid} aria-label="Küchenprojekte">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Link href={`/arbeiten/${project.slug}`} className={styles.card} aria-labelledby={`card-${project.slug}`} prefetch={false}>
            <ProjectCover
              project={project}
              sizes="(max-width: 680px) 92vw, (max-width: 1250px) 46vw, 550px"
              priority={index === 0}
            />
            <div className={styles.cardBody}>
              <h2 id={`card-${project.slug}`}>{project.title}</h2>
              <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1.5} />
              <p>{project.summary}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
