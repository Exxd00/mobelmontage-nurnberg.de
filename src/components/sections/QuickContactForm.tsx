"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, Loader2, Upload, X, FileText, FileImage, File } from "lucide-react";
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
import { services } from "@/lib/data";
import { supabase, BUCKET_NAME, generateFilePath, getPublicUrl } from "@/lib/supabase";

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

// File type info
interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'pdf' | 'word' | 'excel' | 'other';
  uploading?: boolean;
  uploaded?: boolean;
  url?: string;
  error?: string;
}

// Get file type category
function getFileType(mimeType: string): UploadedFile['type'] {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word')) return 'word';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
  return 'other';
}

// Get file icon based on type
function FileIcon({ type }: { type: UploadedFile['type'] }) {
  switch (type) {
    case 'image':
      return <FileImage className="w-6 h-6" />;
    case 'pdf':
      return <FileText className="w-6 h-6 text-red-500" />;
    case 'word':
      return <FileText className="w-6 h-6 text-blue-500" />;
    case 'excel':
      return <FileText className="w-6 h-6 text-green-500" />;
    default:
      return <File className="w-6 h-6" />;
  }
}

// Image compression function
async function compressImage(file: File, maxSizeKB = 500): Promise<Blob> {
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
        const maxDimension = 1200;
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

        // Start with quality 0.8
        let quality = 0.8;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              // If still too large and quality can be reduced
              if (blob.size > maxSizeKB * 1024 && quality > 0.3) {
                quality -= 0.1;
                tryCompress();
              } else {
                resolve(blob);
              }
            },
            "image/jpeg",
            quality
          );
        };

        tryCompress();
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

// Upload file to Supabase
async function uploadToSupabase(file: File | Blob, fileName: string): Promise<string> {
  const filePath = generateFilePath(fileName);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return getPublicUrl(filePath);
}

export default function QuickContactForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    service: "",
    name: "",
    phone: "",
    city: "",
    message: "",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError("");

    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`Maximal ${MAX_FILES} Dateien erlaubt`);
      return;
    }

    for (const file of selectedFiles) {
      // Check file type
      if (!ALL_ALLOWED_TYPES.includes(file.type)) {
        setError(`Dateityp nicht erlaubt: ${file.name}`);
        continue;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`Datei zu groß (max. 10MB): ${file.name}`);
        continue;
      }

      const fileType = getFileType(file.type);
      const preview = fileType === 'image' ? URL.createObjectURL(file) : '';

      // Add file to state
      setFiles((prev) => [
        ...prev,
        { file, preview, type: fileType, uploading: false },
      ]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

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
      // Upload files to Supabase
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];

        // Update file status
        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], uploading: true };
          return newFiles;
        });

        try {
          let fileToUpload: File | Blob = fileItem.file;
          let fileName = fileItem.file.name;

          // Compress images
          if (fileItem.type === 'image') {
            fileToUpload = await compressImage(fileItem.file);
            // Change extension to jpg for compressed images
            fileName = fileName.replace(/\.[^.]+$/, '.jpg');
          }

          const url = await uploadToSupabase(fileToUpload, fileName);
          uploadedUrls.push(url);

          // Update file status
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i] = { ...newFiles[i], uploading: false, uploaded: true, url };
            return newFiles;
          });
        } catch (uploadError) {
          const errorMsg = uploadError instanceof Error ? uploadError.message : 'Upload failed';
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i] = { ...newFiles[i], uploading: false, error: errorMsg };
            return newFiles;
          });
          throw new Error(`Fehler beim Hochladen: ${fileItem.file.name}`);
        }
      }

      // Prepare data for API
      const submitData = {
        ...formData,
        email: "",
        fileUrls: uploadedUrls,
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

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Dateien hochladen (optional, max. {MAX_FILES})</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Erlaubt: Bilder (JPG, PNG), PDF, Word, Excel - max. 10MB pro Datei
                </p>
                <div className="flex flex-wrap gap-3">
                  {files.map((fileItem, index) => (
                    <div
                      key={index}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        fileItem.error ? 'border-destructive' :
                        fileItem.uploaded ? 'border-green-500' :
                        fileItem.uploading ? 'border-primary' : 'border-border'
                      } bg-muted flex items-center justify-center`}
                    >
                      {fileItem.type === 'image' && fileItem.preview ? (
                        <img
                          src={fileItem.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <FileIcon type={fileItem.type} />
                          <span className="text-[10px] text-center truncate w-full">
                            {fileItem.file.name.slice(0, 8)}...
                          </span>
                        </div>
                      )}

                      {/* Upload indicator */}
                      {fileItem.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}

                      {/* Success indicator */}
                      {fileItem.uploaded && (
                        <div className="absolute top-1 left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      {/* Remove button */}
                      {!fileItem.uploading && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80"
                          aria-label="Datei entfernen"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {files.length < MAX_FILES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">Datei</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  onChange={handleFileUpload}
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
      </div>
    </section>
  );
}
