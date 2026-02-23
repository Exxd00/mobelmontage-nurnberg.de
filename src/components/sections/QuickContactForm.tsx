"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, Loader2, Upload } from "lucide-react";
import { trackFormStart, trackFormSubmit, trackLead } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services, businessInfo } from "@/lib/data";

export default function QuickContactForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    service: "",
    name: "",
    phone: "",
    city: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Track form start when user begins typing
  useEffect(() => {
    const hasData = formData.name || formData.phone || formData.city || formData.message;
    if (hasData && !hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart("quick_contact_form");
    }
  }, [formData, hasStartedForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Track form submit and lead
    trackFormSubmit("quick_contact_form", formData.service, formData.city);
    trackLead({
      source: "quick_contact_form",
      service: formData.service,
      city: formData.city,
      phone: formData.phone,
    });

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        email: "",
        images: [],
      };

      // Send to API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Fehler beim Senden");
      }

      // Success - store flag and redirect to thank you page
      sessionStorage.setItem("form_submitted", "true");
      router.push("/thank-you?success=true");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Fehler beim Senden. Bitte versuchen Sie es erneut.";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">
                Kostenloses Festpreis-Angebot anfordern
              </h2>
              <p className="text-muted-foreground lg:text-lg">
                Erhalten Sie innerhalb von 24 Stunden ein verbindliches Angebot.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="quick-service">Gewünschte Dienstleistung *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) =>
                    setFormData({ ...formData, service: value })
                  }
                  required
                >
                  <SelectTrigger id="quick-service" className="input-focus">
                    <SelectValue placeholder="Bitte wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="andere">Andere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-name">Ihr Name *</Label>
                  <Input
                    id="quick-name"
                    type="text"
                    placeholder="Max Mustermann"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quick-phone">Telefonnummer *</Label>
                  <Input
                    id="quick-phone"
                    type="tel"
                    placeholder="+49 123 456789"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="input-focus"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="quick-city">Stadt / PLZ *</Label>
                <Input
                  id="quick-city"
                  type="text"
                  placeholder="z.B. Nürnberg oder 90402"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  className="input-focus"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="quick-message">Beschreibung Ihres Projekts</Label>
                <Textarea
                  id="quick-message"
                  placeholder="z.B. PAX Kleiderschrank 2m breit, IKEA Küche 12 Schränke..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  className="input-focus resize-none"
                />
              </div>

              {/* Image Upload Note */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="w-4 h-4" />
                <span>Bilder hochladen (optional) – auf der Kontaktseite möglich</span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full btn-primary py-5 md:py-6 text-base md:text-lg rounded-xl shimmer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Anfrage senden
                  </>
                )}
              </Button>

              {/* Privacy Note */}
              <p className="text-xs text-center text-muted-foreground">
                Mit dem Absenden stimmen Sie unserer{" "}
                <Link href="/datenschutz" className="text-primary hover:underline">
                  Datenschutzerklärung
                </Link>{" "}
                zu.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
