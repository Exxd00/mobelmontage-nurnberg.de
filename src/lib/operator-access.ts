// Used only by the request middleware and server-side operator routes.
const encoder = new TextEncoder();

function operatorPassword() {
  const value = process.env.ADMIN_ACCESS_PASSWORD;
  return value && value.length >= 24 ? value : undefined;
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

export async function isOperatorAuthorized(header: string | null): Promise<boolean> {
  const password = operatorPassword();
  if (!password || !header || header.length > 4096) return false;
  const encoded = /^Basic ([A-Za-z0-9+/]+=*)$/i.exec(header)?.[1];
  if (!encoded) return false;

  let credentials: string;
  try {
    const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
    credentials = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return false;
  }
  if (!credentials.startsWith("admin:")) return false;

  const [expected, offered] = await Promise.all([digest(password), digest(credentials.slice("admin:".length))]);
  let difference = 0;
  for (let index = 0; index < expected.length; index++) {
    difference |= expected[index] ^ offered[index];
  }
  return difference === 0;
}

export const operatorHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
} as const;

export function operatorChallenge() {
  if (!operatorPassword()) {
    return new Response("Die Verwaltung ist vorübergehend nicht verfügbar.", { status: 503, headers: operatorHeaders });
  }
  return new Response("Bitte melden Sie sich für die Montageverwaltung an.", {
    status: 401,
    headers: { ...operatorHeaders, "WWW-Authenticate": 'Basic realm="Montageverwaltung", charset="UTF-8"' },
  });
}
