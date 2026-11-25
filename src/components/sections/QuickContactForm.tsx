"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, Loader2, Upload, X, FileText, FileImage, File, ArrowRight, ArrowLeft, Check, Zap, AlertCircle, Phone, MessageCircle } from "lucide-react";
import { trackFormStart, trackFormSubmit, trackLead } from "@/lib/analytics";
import { getTrackingData } from "@/lib/tracking";
import { inquiryHref, type InquiryIds } from "@/lib/inquiry-context";
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
import { getQuoteFields, needsWorksitePostcode, validateQuoteScope, isContactPhone, type QuoteField } from "@/lib/quote-requirements";
import { compressFiles, formatFileSize, isImageFile } from "@/lib/compression";

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// Base64 expands direct email attachments by a third inside the serverless JSON request.
const MAX_EMAIL_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_IMAGES = 5;
const MAX_PLANS = 3;

// Smooth scroll helper function
function scrollToElement(elementId: string, offset: number = 100) {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  }, 150);
}

function focusQuoteField(field: string) {
  const ids: Record<string, string> = { service: "quick-service", plz: "quick-worksite", name: "quick-name", phone: "quick-phone", email: "quick-email" };
  const id = ids[field] || "quote-" + field;
  requestAnimationFrame(() => {
    const input = document.getElementById(id);
    if (!input) return;
    input.focus({ preventScroll: true });
    input.scrollIntoView({ block: "center", behavior: "auto" });
  });
}

// File type info
interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'pdf' | 'word' | 'other';
}

// Get file type category
function getFileType(mimeType: string): UploadedFile['type'] {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word')) return 'word';
  return 'other';
}

// Get file icon based on type
function FileIcon({ type }: { type: UploadedFile['type'] }) {
  switch (type) {
    case 'image':
      return <FileImage className="w-5 h-5" />;
    case 'pdf':
      return <FileText className="w-5 h-5 text-primary" />;
    case 'word':
      return <FileText className="w-5 h-5 text-primary" />;
    default:
      return <File className="w-5 h-5" />;
  }
}

function ProjectField({
  field, value, onChange, hasAttachment, error,
}: {
  field: QuoteField; value: string; onChange: (value: string) => void; hasAttachment: boolean; error?: string;
}) {
  const id = "quote-" + field.key;
  const evidence = field.key === "specification";
  const required = !evidence || !hasAttachment;
  const minimum = field.key === "cabinetCount" ? 0 : field.key.endsWith("Distance") ? 51 : 1;
  const describedBy = [field.hint && id + "-hint", error && id + "-error"].filter(Boolean).join(" ") || undefined;
  const common = {
    id, name: field.key, value, required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: "input-focus w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground",
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(event.target.value),
  };
  return <div className="min-w-0 space-y-1.5">
    <Label htmlFor={id}>{field.label}{required ? " *" : ""}</Label>
    {field.hint && <p id={id + "-hint"} className="text-sm leading-snug text-muted-foreground">{field.hint}</p>}
    {field.kind === "select" ? <select {...common}>
      <option value="">Bitte auswählen</option>
      {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
    </select> : field.kind === "textarea" ? <Textarea {...common} rows={3}/>
      : <Input {...common} type={field.kind === "count" ? "number" : field.kind === "date" ? "date" : "text"}
          min={field.kind === "count" ? minimum : undefined} step={field.kind === "count" ? 1 : undefined}
          inputMode={field.kind === "count" ? "numeric" : undefined}/>}
    {evidence && <button type="button" className="text-sm font-semibold text-primary underline" onClick={() => {
      const uploads = document.querySelector<HTMLDetailsElement>("#quote-attachments");
      if (uploads) { uploads.open = true; uploads.querySelector<HTMLButtonElement>("button:not([aria-label])")?.focus(); }
    }}>Foto oder Plan hinzufügen</button>}
    {error && <p id={id + "-error"} role="alert" className="text-sm font-medium text-destructive">{error}</p>}
  </div>;
}

// Progress Bar Component
interface ProgressState {
  stage: 'idle' | 'compressing' | 'uploading' | 'sending' | 'done';
  progress: number;
  message: string;
  details?: string;
}

function ProgressBar({ state }: { state: ProgressState }) {
  if (state.stage === 'idle') return null;

  const getStageIcon = () => {
    switch (state.stage) {
      case 'compressing': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'uploading': return <Upload className="w-4 h-4 animate-bounce" />;
      case 'sending': return <Send className="w-4 h-4 animate-pulse" />;
      case 'done': return <Check className="w-4 h-4" />;
      default: return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  return (
    <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-3 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
            {getStageIcon()}
          </div>
          <span role="status" className="font-medium text-sm">{state.message}</span>
        </div>
        <span className="text-sm font-bold text-primary">{Math.round(state.progress)}%</span>
      </div>
      <div role="progressbar" aria-label={state.message} aria-valuenow={Math.round(state.progress)} aria-valuemin={0} aria-valuemax={100} className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${state.progress}%` }}
        />
      </div>
      {state.details && (
        <p className="text-xs text-muted-foreground truncate">{state.details}</p>
      )}
    </div>
  );
}

// Convert file to base64
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export default function QuickContactForm({ initialService = "", initialDetails = "", embedded = false, businessInquiry = false, inquiryContext }: {
  initialService?: string; initialDetails?: string; embedded?: boolean; businessInquiry?: boolean; inquiryContext?: InquiryIds;
} = {}) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const planInputRef = useRef<HTMLInputElement>(null);

  const preparing = useRef(false);
  const previews = useRef(new Set<string>());
  useEffect(() => {
    const urls = previews.current;
    return () => { for (const url of urls) URL.revokeObjectURL(url); };
  }, []);
  const [preparingFiles, setPreparingFiles] = useState(false);
  const [attachmentProgress, setAttachmentProgress] = useState<ProgressState>({ stage: "idle", progress: 0, message: "" });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: initialService,
    worksite: "",
    name: "",
    phone: "",
    email: "",
  });

  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [organization, setOrganization] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null);
  const sending = useRef(false);
  const [customerType, setCustomerType] = useState<"private" | "business" | null>(null);
  const selectedService = formData.service;
  const isBusiness = customerType ? customerType === "business" : businessInquiry && selectedService === initialService;
  const activeContext = selectedService === initialService ? inquiryContext : undefined;
  const callbackHref = inquiryHref({ ...activeContext, service: selectedService, business: isBusiness ? activeContext?.business : undefined }, "callback");
  const rawMessage = notes[selectedService] ?? (selectedService === initialService ? initialDetails : "");
  const incomingBusinessReference = initialDetails.split("\n").find(line => line.startsWith("Firmenanfrage: "));
  const message = !isBusiness && incomingBusinessReference
    ? rawMessage.split("\n").filter(line => line !== incomingBusinessReference)
      .map(line => line.startsWith(incomingBusinessReference) ? line.slice(incomingBusinessReference.length).trimStart() : line).join("\n")
    : rawMessage;
  const currentDetails = { ...drafts[selectedService], ...(isBusiness ? organization : {}) };
  const fields = getQuoteFields(selectedService, currentDetails, isBusiness);
  const groups = new Map<string, QuoteField[]>();
  for (const field of fields) {
    const group = groups.get(field.group);
    if (group) group.push(field);
    else groups.set(field.group, [field]);
  }

  const [uploads, setUploads] = useState<Record<string, { images: UploadedFile[]; plans: UploadedFile[] }>>({});
  const { images, plans } = uploads[selectedService] || { images: [], plans: [] };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentInline, setSentInline] = useState(false);
  const [error, setError] = useState("");
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Progress state for compression/upload/send
  const [progressState, setProgressState] = useState<ProgressState>({
    stage: 'idle',
    progress: 0,
    message: '',
  });

  const selectService = useCallback((service: string) => {
    if (preparing.current || sending.current) return;
    setFormData(previous => ({ ...previous, service }));
    setAttachmentProgress({ stage: "idle", progress: 0, message: "" });
    setCurrentStep(1);
    setFieldError(null);
    setError("");
  }, []);

  function changeField(key: string, value: string) {
    if (isBusiness && (key === "company" || key === "timeSlot")) {
      setOrganization(previous => ({ ...previous, [key]: value }));
    } else {
      setDrafts(previous => ({
        ...previous,
        [selectedService]: { ...previous[selectedService], [key]: value },
      }));
    }
    setFieldError(null);
  }

  // Track form start when user begins filling
  useEffect(() => {
    const hasData = formData.service || formData.name;
    if (hasData && !hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart("quick_contact_form");
    }
  }, [formData, hasStartedForm]);

  const prepareFiles = async (event: React.ChangeEvent<HTMLInputElement>, group: "images" | "plans") => {
    const selection = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selection.length || preparing.current) return;
    const photos = group === "images";
    const limit = photos ? MAX_IMAGES : MAX_PLANS;
    if ((photos ? images : plans).length + selection.length > limit) {
      setError(`Bitte wählen Sie höchstens ${limit} ${photos ? "Bilder" : "Pläne"}.`);
      return;
    }
    setError("");
    preparing.current = true;
    setPreparingFiles(true);
    try {
      for (const file of selection) {
        const allowed = ALLOWED_IMAGE_TYPES.includes(file.type) || (!photos && ALLOWED_DOC_TYPES.includes(file.type));
        if (!allowed || file.size > MAX_FILE_SIZE) throw new Error(`${file.name}: Bitte wählen Sie ein unterstütztes Format mit höchstens 10 MB.`);
      }
      const documents = [...plans.map(plan => plan.file), ...selection].filter(file => !isImageFile(file));
      if (documents.reduce((sum, file) => sum + file.size, 0) > MAX_EMAIL_ATTACHMENT_BYTES) {
        throw new Error("PDF- und Word-Dateien dürfen zusammen höchstens 3 MB groß sein. Bitte verkleinern Sie den Plan oder senden Sie einzelne Seiten als Bild.");
      }
      const prepared = await compressFiles(selection, progress => {
        setAttachmentProgress({
          stage: "compressing", progress: progress.progress, message: "Dateien werden vorbereitet",
          details: `${progress.currentFileIndex} von ${progress.totalFiles} · ${progress.currentFile}`,
        });
      }, { maxWidth: 1720, maxHeight: 1720, quality: 0.76, maxSizeMB: 0.4 });
      const allBytes = [...images, ...plans].reduce((sum, item) => sum + item.file.size, 0)
        + prepared.reduce((sum, file) => sum + file.size, 0);
      if (allBytes > MAX_EMAIL_ATTACHMENT_BYTES) {
        throw new Error("Alle Anhänge dürfen nach der Bildkomprimierung zusammen höchstens 3 MB groß sein. Bitte wählen Sie weniger Dateien oder verkleinern Sie Ihren Plan.");
      }
      const files = prepared.map(file => ({
        file,
        type: getFileType(file.type),
        preview: photos ? URL.createObjectURL(file) : "",
      }));
      for (const file of files) if (file.preview) previews.current.add(file.preview);
      setUploads(current => {
        const selection = current[selectedService] || { images: [], plans: [] };
        return { ...current, [selectedService]: { ...selection, [group]: [...selection[group], ...files] } };
      });
      if (fieldError?.field === "specification") setFieldError(null);
      const bytes = prepared.reduce((sum, file) => sum + file.size, 0);
      setAttachmentProgress({ stage: "done", progress: 100, message: "Auswahl bereit zum Senden", details: formatFileSize(bytes) });
    } catch (err) {
      setAttachmentProgress({ stage: "idle", progress: 0, message: "" });
      setError(err instanceof Error ? err.message : "Die Dateien konnten nicht vorbereitet werden.");
    } finally {
      preparing.current = false;
      setPreparingFiles(false);
    }
  };

  function removeFile(group: "images" | "plans", index: number) {
    const selection = uploads[selectedService];
    if (!selection?.[group][index]) return;
    const preview = selection[group][index].preview;
    if (preview) {
      URL.revokeObjectURL(preview);
      previews.current.delete(preview);
    }
    setUploads(current => ({
      ...current,
      [selectedService]: { ...current[selectedService], [group]: current[selectedService][group].filter((_, i) => i !== index) },
    }));
    setAttachmentProgress({ stage: "idle", progress: 0, message: "" });
  }

  function validateProject() {
    const issue = validateQuoteScope({
      service: selectedService, plz: formData.worksite, serviceDetails: currentDetails,
      fileCount: images.length + plans.length, businessInquiry: isBusiness,
    });
    if (issue) {
      setCurrentStep(1);
      setError("");
      setFieldError(issue);
      focusQuoteField(issue.field);
    }
    return !issue;
  }

  const goToStep2 = () => {
    if (preparing.current || !validateProject()) return;
    setError("");
    setFieldError(null);
    setCurrentStep(2);
    requestAnimationFrame(() => document.getElementById("quick-name")?.focus());
  };

  const goToStep1 = () => {
    setCurrentStep(1);
    setError("");
    setFieldError(null);
    requestAnimationFrame(() => {
      document.getElementById("quick-service")?.focus({ preventScroll: true });
      scrollToElement("form-step-indicator", 20);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preparing.current || sending.current) return;
    if (currentStep === 1) { goToStep2(); return; }
    if (!validateProject()) return;
    const form = e.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;
    const invalidContact = !formData.name.trim()
      ? { field: "name", message: "Bitte geben Sie Ihren Namen an." }
      : !isContactPhone(formData.phone)
        ? { field: "phone", message: "Bitte geben Sie eine erreichbare Telefonnummer mit Vorwahl an." }
        : null;
    if (invalidContact) { setFieldError(invalidContact); focusQuoteField(invalidContact.field); return; }
    setFieldError(null);
    sending.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      const fileAttachments: { filename: string; content: string }[] = [];

      const files = [...images, ...plans].map(item => item.file);
      for (const [index, file] of files.entries()) {
        setProgressState({
          stage: "uploading", progress: Math.round(index / files.length * 100),
          message: "E-Mail-Anhänge werden vorbereitet", details: file.name,
        });
        const filename = file.type === "image/jpeg" ? file.name.replace(/\.[^.]+$/, ".jpg") : file.name;
        const base64 = await fileToBase64(file);
        fileAttachments.push({ filename, content: base64.slice(base64.indexOf(",") + 1) });
      }

      // Stage 3: Send form
      setProgressState({
        stage: 'sending',
        progress: 30,
        message: 'Anfrage wird gesendet...',
      });

      // Get tracking data (GCLID, source, page)
      const tracking = getTrackingData();

      const serviceDetails = Object.fromEntries(fields.map(field => [field.key, (currentDetails[field.key] || "").trim()]));
      const submitData = {
        service: formData.service,
        message,
        plz: needsWorksitePostcode(selectedService) ? formData.worksite.trim() : "",
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        fileUrls: [],
        fileAttachments: fileAttachments,
        serviceDetails,
        businessInquiry: isBusiness,
        gclid: tracking.gclid,
        quelle: tracking.source,
        seite: tracking.page,
      };

      setProgressState({
        stage: 'sending',
        progress: 60,
        message: 'Anfrage wird gesendet...',
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      setProgressState({
        stage: 'sending',
        progress: 90,
        message: 'Verarbeitung...',
      });

      const result = await response.json().catch(() => ({}));

      // Only treat as success if the server actually delivered the request.
      // The API returns { success: true } exclusively when the notification email was sent.
      if (!response.ok || !result?.success) {
        if (typeof result?.field === "string" && ["service", "plz", ...fields.map(field => field.key)].includes(result.field)) {
          setFieldError({ field: result.field, message: result.error || "Bitte prüfen Sie diese Angabe." });
          setCurrentStep(1);
          setIsSubmitting(false);
          sending.current = false;
          setProgressState({ stage: "idle", progress: 0, message: "" });
          focusQuoteField(result.field);
          return;
        }
        throw new Error(
          result?.error ||
            "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.",
        );
      }

      // Confirmed success -> fire conversion tracking now (not before)
      trackFormSubmit("quick_contact_form", formData.service);
      trackLead({
        source: "quick_contact_form",
        service: formData.service,
        phone: formData.phone,
        email: formData.email,
      });

      setProgressState({
        stage: 'done',
        progress: 100,
        message: 'Erfolgreich gesendet!',
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // One-time access flag for the thank-you page (checked + cleared there)
      try {
        sessionStorage.removeItem("inquiry_reference");
        if (typeof result.reference === "string") sessionStorage.setItem("inquiry_reference", result.reference);
        sessionStorage.setItem("form_submitted", "true");
      } catch {
        setSentInline(true);
        return;
      }
      router.push("/thank-you");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Fehler beim Senden. Bitte versuchen Sie es erneut.";
      setError(errorMessage);
      sending.current = false;
      setIsSubmitting(false);
      setProgressState({ stage: 'idle', progress: 0, message: '' });
      // Bring the error into view so the reason is always visible
      requestAnimationFrame(() => document.getElementById("quick-submit-error")?.focus());
    }
  };

  // Listen for service selection from HeroSection cards
  useEffect(() => {
    const handleServiceSelect = (event: CustomEvent<{ service: string }>) => {
      const selectedService = event.detail.service;
      if (selectedService && services.find(s => s.id === selectedService)) {
        selectService(selectedService);
        if (!hasStartedForm) {
          setHasStartedForm(true);
          trackFormStart("quick_contact_form");
        }
      }
    };

    window.addEventListener('selectService', handleServiceSelect as EventListener);
    return () => {
      window.removeEventListener('selectService', handleServiceSelect as EventListener);
    };
  }, [hasStartedForm, selectService]);

  return (
    <section id={embedded ? undefined : "kontakt-form"} className={embedded ? "embedded-inquiry" : "section-padding bg-muted/30"}>
      {sentInline ? <div role="status"><h2>Ihre Anfrage ist angekommen.</h2><p>Vielen Dank. Wir melden uns über Ihre angegebenen Kontaktdaten.</p></div> : (
      <div className="container-max">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Kostenloses Angebot anfordern
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Nach Ihren Projektangaben erstellen wir Ihr individuelles Angebot. Möchten Sie zuerst etwas besprechen?{" "}
                <Link href={callbackHref} className="font-semibold text-primary underline">Rückruf anfragen</Link>
              </p>
            </div>

            {/* Step Indicator */}
            <div id="form-step-indicator" className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Projekt
                </span>
              </div>
              <div className="w-12 h-0.5 bg-muted" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Kontakt
                </span>
              </div>
            </div>

            <form noValidate onSubmit={handleSubmit}>
              {/* Step 1: Project Details */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">Für wen ist das Angebot?</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {(["private", "business"] as const).map(type => {
                        const checked = type === "business" ? isBusiness : !isBusiness;
                        return <label key={type} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${checked ? "border-primary bg-muted" : "border-border"}`}>
                          <input type="radio" name="customerType" value={type} checked={checked}
                            onChange={() => { setCustomerType(type); setFieldError(null); }}/>
                          {type === "business" ? "Firma" : "Privatperson"}
                        </label>;
                      })}
                    </div>
                  </fieldset>
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="quick-service">Art der Dienstleistung *</Label>
                    <Select
                      value={formData.service}
                      onValueChange={selectService}
                      disabled={preparingFiles}
                    >
                      <SelectTrigger id="quick-service" className="input-focus" aria-invalid={fieldError?.field === "service" || undefined} aria-describedby={fieldError?.field === "service" ? "quote-service-error" : undefined}>
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

                  {fieldError?.field === "service" && <p id="quote-service-error" role="alert" className="text-sm text-destructive">{fieldError.message}</p>}
                  {selectedService && <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">Für Ihr Angebot benötigen wir die mit * gekennzeichneten Angaben.</p>
                    {needsWorksitePostcode(selectedService) && <div className="space-y-1.5">
                      <Label htmlFor="quick-worksite">Postleitzahl des Einsatzorts *</Label>
                      <Input id="quick-worksite" name="plz" type="text" autoComplete="postal-code" inputMode="numeric"
                        maxLength={5} pattern="[0-9]{5}" required value={formData.worksite}
                        aria-invalid={fieldError?.field === "plz" || undefined}
                        aria-describedby={fieldError?.field === "plz" ? "quote-plz-error" : undefined}
                        onChange={e => { setFormData({ ...formData, worksite: e.target.value }); setFieldError(null); }}/>
                      {fieldError?.field === "plz" && <p id="quote-plz-error" role="alert" className="text-sm text-destructive">{fieldError.message}</p>}
                    </div>}
                    {Array.from(groups, ([title, members]) => <fieldset key={title} className="min-w-0 space-y-4 rounded-xl border border-border p-4">
                      <legend className="px-1 text-base font-semibold text-foreground">{title}</legend>
                      {members.map(field => <ProjectField key={field.key} field={field}
                        value={currentDetails[field.key] || ""} hasAttachment={images.length + plans.length > 0}
                        error={fieldError?.field === field.key ? fieldError.message : undefined}
                        onChange={value => changeField(field.key, value)}/>)}
                    </fieldset>)}
                  </div>}

                  {selectedService && <>
                  <div className="space-y-2">
                    <Label htmlFor="quick-details">Weitere Hinweise (optional)</Label>
                    <Textarea
                      id="quick-details"
                      placeholder="Sonstige Infos, besondere Anforderungen, Fragen..."
                      value={message}
                      onChange={(e) => setNotes({ ...notes, [selectedService]: e.target.value })}
                      rows={4}
                      className="input-focus resize-none"
                    />
                  </div>

                  <details id="quote-attachments" className="form-extras"><summary>Fotos und Pläne hinzufügen</summary>
                  {/* Images Upload */}
                  <div className="space-y-2">
                    <Label>Bilder (optional, max. {MAX_IMAGES})</Label>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP oder GIF bis 10 MB pro Bild. Große Bilder werden beim Auswählen verkleinert. Alle Anhänge zusammen dürfen danach höchstens 3 MB groß sein.</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {images.map((img, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                          <img src={img.preview} alt={`Bild ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile("images", index)}
                            aria-label={`${img.file.name} entfernen`}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {images.length < MAX_IMAGES && (
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
                        >
                          <FileImage className="w-5 h-5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Bild</span>
                        </button>
                      )}
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept={ALLOWED_IMAGE_TYPES.join(",")}
                      multiple
                      onChange={event => prepareFiles(event, "images")}
                      disabled={preparingFiles}
                      className="hidden"
                    />
                  </div>

                  {/* Plans Upload */}
                  <div className="space-y-2">
                    <Label>Pläne (optional, max. {MAX_PLANS})</Label>
                    <p className="text-xs text-muted-foreground">Bilder, PDF oder Word. Nach der Bildkomprimierung sind insgesamt 3 MB für alle Anhänge möglich. Sie werden mit Ihrer Anfrage direkt an unser Team gesendet.</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {plans.map((plan, index) => (
                        <div key={index} className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted">
                          <FileIcon type={plan.type} />
                          <span className="text-xs truncate max-w-[100px]">{plan.file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile("plans", index)}
                            aria-label={`${plan.file.name} entfernen`}
                            className="w-4 h-4 bg-destructive text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                      {plans.length < MAX_PLANS && (
                        <button
                          type="button"
                          onClick={() => planInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Datei</span>
                        </button>
                      )}
                    </div>
                    <input
                      ref={planInputRef}
                      type="file"
                      accept={[...ALLOWED_DOC_TYPES, ...ALLOWED_IMAGE_TYPES].join(",")}
                      multiple
                      onChange={event => prepareFiles(event, "plans")}
                      disabled={preparingFiles}
                      className="hidden"
                    />
                  </div>

                    <ProgressBar state={attachmentProgress} />
                  </details>
                  </>}
                  {/* Error */}
                  {error && (
                    <p role="alert" className="text-sm text-destructive">{error}</p>
                  )}

                  {/* Next Button */}
                  <Button
                    type="submit"
                    disabled={preparingFiles}
                    className="w-full btn-primary py-3 rounded-xl"
                  >
                    Weiter zu Kontaktdaten
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <details className="quote-review">
                    <summary>Projektangaben prüfen
                      <span>{services.find(service => service.id === selectedService)?.shortName || "Anderes Vorhaben"} · {isBusiness ? "Firma" : "Privat"}
                        {needsWorksitePostcode(selectedService) && ` · ${formData.worksite.trim()}`}</span>
                    </summary>
                    <div>
                      {Array.from(groups, ([title, members]) => <section key={title}>
                        <h3>{title}</h3>
                        <dl>{members.map(field => <div key={field.key}>
                          <dt>{field.label}</dt>
                          <dd>{currentDetails[field.key]?.trim() || (field.key === "specification" && "Siehe Anhänge")}</dd>
                        </div>)}</dl>
                      </section>)}
                      {message.trim() && <section><h3>Weitere Hinweise</h3><p>{message.trim()}</p></section>}
                      {(images.length > 0 || plans.length > 0) && <section>
                        <h3>Anhänge</h3>
                        <ul>{[...images, ...plans].map(({file}, index) => <li key={index}>{file.name}</li>)}</ul>
                      </section>}
                      <button type="button" disabled={isSubmitting} onClick={goToStep1}>Projektangaben ändern</button>
                    </div>
                  </details>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="quick-name">{isBusiness ? "Ansprechperson" : "Ihr Name"} *</Label>
                    <Input
                      id="quick-name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFieldError(null); }}
                      aria-invalid={fieldError?.field === "name" || undefined}
                      aria-describedby={fieldError?.field === "name" ? "quote-name-error" : undefined}
                      required
                      className="input-focus"
                      disabled={isSubmitting}
                    />
                    {fieldError?.field === "name" && <p id="quote-name-error" role="alert" className="text-sm text-destructive">{fieldError.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="quick-phone">Telefonnummer *</Label>
                    <Input
                      id="quick-phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setFieldError(null); }}
                      aria-invalid={fieldError?.field === "phone" || undefined}
                      aria-describedby={fieldError?.field === "phone" ? "quote-phone-error" : undefined}
                      required
                      className="input-focus"
                      disabled={isSubmitting}
                    />
                    {fieldError?.field === "phone" && <p id="quote-phone-error" role="alert" className="text-sm text-destructive">{fieldError.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="quick-email">E-Mail (optional)</Label>
                    <Input
                      id="quick-email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-focus"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Progress Bar */}
                  {isSubmitting && <ProgressBar state={progressState} />}

                  {/* Error - prominent, always shows the exact reason + fallback contact */}
                  {error && (
                    <div
                      id="quick-submit-error"
                      tabIndex={-1}
                      role="alert"
                      aria-live="assertive"
                      className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-destructive text-sm">
                            Anfrage konnte nicht gesendet werden
                          </p>
                          <p className="text-sm text-destructive/90 break-words">{error}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <a
                          href={`tel:${businessInfo.phone}`}
                          className="inline-flex items-center justify-center gap-2 flex-1 rounded-lg border-2 border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Anrufen: {businessInfo.phone}
                        </a>
                        <a
                          href={`https://wa.me/${businessInfo.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToStep1}
                      className="flex-1 py-3 rounded-xl"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Zurück
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 btn-primary py-3 rounded-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Wird verarbeitet...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Anfrage senden
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
