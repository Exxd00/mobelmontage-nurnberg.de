import { operatorDownload } from "@/lib/operator-downloads";

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  return operatorDownload(request, "google-ads-import", (await params).file);
}
