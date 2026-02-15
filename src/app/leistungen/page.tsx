"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Truck, Wrench, ChefHat, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import { services, getAllServices } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  delivery: Truck,
  furniture: Wrench,
  kitchen: ChefHat,
};

export default function LeistungenPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allServices = useMemo(() => getAllServices(), []);

  const filteredServices = useMemo(() => {
    let filtered = allServices;

    if (selectedCategory) {
      filtered = filtered.filter((s) => s.parentId === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.parentName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allServices, selectedCategory, searchQuery]);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-max">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Unsere Leistungen
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professionelle Möbelmontage, Küchenmontage und Lieferservice für
              alle führenden Marken
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Leistung suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Alle
                </button>
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedCategory(service.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === service.id
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Service Cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Truck;
              return (
                <Link
                  key={service.id}
                  href={`/service/${service.slug}`}
                  className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 card-hover group text-center"
                >
                  <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                  </div>
                  <h2 className="font-bold text-base md:text-xl lg:text-2xl mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 hidden sm:block line-clamp-2">
                    {service.germanDescription}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-primary text-sm font-medium">
                    <span className="hidden md:inline">Mehr erfahren</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* All Services Grid */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Alle Leistungen ({filteredServices.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/service/${service.slug}`}
                  className="glass-card rounded-xl p-4 card-hover group"
                >
                  <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {service.parentName}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-muted/50 rounded-2xl p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Nicht gefunden was Sie suchen?
            </h2>
            <p className="text-muted-foreground mb-6">
              Kontaktieren Sie uns für individuelle Anfragen
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-xl font-medium"
            >
              Jetzt anfragen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
