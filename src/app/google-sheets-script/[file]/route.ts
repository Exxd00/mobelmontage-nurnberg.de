import { operatorDownload } from "@/lib/operator-downloads";

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  return operatorDownload(request, "google-sheets-script", (await params).file);
}
