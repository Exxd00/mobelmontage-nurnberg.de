// Keep this opaque value in the open form only. A retry reuses its submission time.
export function newInquiryAttempt(): string | undefined {
  return typeof globalThis.crypto?.randomUUID === "function" ? `${Date.now()}/${crypto.randomUUID()}` : undefined;
}
