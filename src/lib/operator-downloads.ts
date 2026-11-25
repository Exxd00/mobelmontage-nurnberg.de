import { readFile } from "node:fs/promises";
import path from "node:path";
import { isOperatorAuthorized, operatorChallenge, operatorHeaders } from "./operator-access";

const collections = {
  "google-ads-import": [
    "ad-groups.csv", "all-files.zip", "callouts.csv", "campaigns.csv", "keywords.csv",
    "negative-keywords.csv", "README.md", "responsive-display-ads.csv", "responsive-search-ads.csv", "sitelinks.csv",
  ],
  "google-sheets-script": ["README.md", "script.gs"],
};

export async function operatorDownload(request: Request, collection: keyof typeof collections, file: string) {
  if (!await isOperatorAuthorized(request.headers.get("authorization"))) return operatorChallenge();
  if (!collections[collection].includes(file)) return new Response(null, { status: 404, headers: operatorHeaders });
  const content = await readFile(path.join(process.cwd(), "operator-files", collection, file));
  const type = file.endsWith(".zip") ? "application/zip" : file.endsWith(".csv") ? "text/csv; charset=utf-8" : "text/plain; charset=utf-8";
  return new Response(new Uint8Array(content), {
    headers: {
      ...operatorHeaders,
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${file}"`,
      "Content-Length": String(content.byteLength),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
