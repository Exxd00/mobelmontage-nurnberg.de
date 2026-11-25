import { NextRequest, NextResponse } from "next/server";
import { sendSheetNotification } from "@/lib/sheet-notification";

interface EventData {
  eventType: "phone_call" | "whatsapp" | "form";
  source: string;
  phoneNumber?: string;
  gclid?: string | null;
  trafficSource?: string;
  page?: string;
}

// Send event to Google Sheets - matching the same structure as contact form
async function sendEventToGoogleSheets(eventData: EventData): Promise<boolean> {
  const sourceLabels: Record<string, string> = {
    "floating_button": "Floating Button",
    "hero_section": "Hero Section",
    "header": "Header",
    "footer": "Footer",
    "cta_section": "CTA Section",
    "contact_form": "Kontaktformular",
  };
  return sendSheetNotification({
    eventType: eventData.eventType,
    name: sourceLabels[eventData.source] || eventData.source,
    email: "-",
    plz: "-",
    service: "-",
    priority: "Normal",
    quelle: eventData.trafficSource || "Direct",
    gclid: eventData.gclid || "-",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: EventData = await request.json();

    const validEventTypes = ["phone_call", "whatsapp", "form"];

    if (!body.eventType || !validEventTypes.includes(body.eventType)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    if (!body.source) {
      return NextResponse.json(
        { error: "Source is required" },
        { status: 400 }
      );
    }

    if (!await sendEventToGoogleSheets(body)) {
      return NextResponse.json({ success: false, error: "Event not confirmed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track event error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
