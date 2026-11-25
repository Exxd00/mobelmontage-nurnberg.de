/** The Apps Script returns a JSON acknowledgement, including on HTTP 200 errors. */
export async function sendSheetNotification(payload: Record<string, unknown>): Promise<boolean> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = await response.json();
    return Boolean(result && !result.error && (result.success === true || result.ok === true || result.status === "success"));
  } catch {
    return false;
  }
}
