import { readInquiryIds } from "@/lib/inquiry-context";
import { resolveDirectoryReference } from "@/lib/inquiry-directory";

export function GET(request: Request) {
  const ids = readInquiryIds(new URL(request.url).searchParams);
  return Response.json(resolveDirectoryReference(ids), {
    headers: { "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "noindex" },
  });
}
