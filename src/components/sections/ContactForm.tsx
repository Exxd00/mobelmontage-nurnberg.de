"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, Upload, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services } from "@/lib/data";

// Image compression function
async function compressImage(file: File, maxSizeKB = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max dimensions
        const maxDimension = 800;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Start with quality 0.7
        let quality = 0.7;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Reduce quality until under maxSizeKB
        while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    service: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [images, setImages] = useState<{ file: File; preview: string; compressed?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      setError("Maximal 3 Bilder erlaubt");
      return;
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Bild zu groß (max. 10MB)");
        continue;
      }

      try {
        const compressed = await compressImage(file);
        setImages((prev) => [
          ...prev,
          { file, preview: URL.createObjectURL(file), compressed },
        ]);
      } catch {
        setError("Fehler beim Verarbeiten des Bildes");
      }
    }
    setError("");
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Track form submit event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_submit", {
        event_category: "contact",
        event_label: formData.service,
      });
    }

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        images: images.map((img) => img.compressed).filter(Boolean),
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
    <section
      id="kontakt-form"
      className={compact ? "" : "section-padding bg-muted/30"}
    >
      <div className={compact ? "" : "container-max"}>
        <div
          className={`glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 ${
            compact ? "" : "max-w-3xl mx-auto"
          }`}
        >
          {!compact && (
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                Kostenlos anfragen
              </h2>
              <p className="text-muted-foreground">
                Beschreiben Sie Ihr Projekt und wir melden uns innerhalb von 24
                Stunden.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service">Art der Dienstleistung *</Label>
              <Select
                value={formData.service}
                onValueChange={(value) =>
                  setFormData({ ...formData, service: value })
                }
                required
              >
                <SelectTrigger id="service" className="input-focus">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Ihr Name *</Label>
                <Input
                  id="name"
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
                <Label htmlFor="phone">Telefonnummer *</Label>
                <Input
                  id="phone"
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

            {/* Email & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@beispiel.de"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Stadt / PLZ *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Stadt oder PLZ eingeben..."
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  className="input-focus"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Beschreibung Ihres Projekts *</Label>
              <Textarea
                id="message"
                placeholder="Beschreiben Sie kurz, welche Möbel montiert werden sollen..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={4}
                className="input-focus resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Bilder hochladen (optional, max. 3)</Label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-border"
                  >
                    <img
                      src={img.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                      aria-label="Bild entfernen"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-xs">Bild</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
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
    </section>
  );
}
