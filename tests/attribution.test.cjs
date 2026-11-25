const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = readFileSync(join(__dirname, "../src/lib/tracking.ts"), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });

test("a new campaign replaces earlier click IDs, while internal navigation retains attribution", () => {
  const values = new Map();
  const location = new URL("https://example.test/?gclid=sample123&utm_campaign=montage");
  const document = { referrer: "https://www.google.de/" };
  let consent = false;
  const browser = {
    exports: {}, URL, URLSearchParams, document, window: { location },
    localStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: key => values.delete(key),
    },
    require: () => ({ hasAnalyticsConsent: () => consent }),
  };
  vm.runInNewContext(outputText, browser);
  const api = browser.exports;
  assert.equal(api.getTrackingData().source, "Nicht erfasst");
  assert.equal(values.size, 0);
  consent = true;
  assert.equal(api.getTrackingData().gclid, "sample123");
  location.search = "";
  location.pathname = "/leistungen";
  assert.equal(api.getTrackingData().source, "Google Ads");
  location.search = "?utm_source=google&utm_medium=organic";
  const organic = api.getTrackingData();
  assert.equal(organic.source, "Google Organic");
  assert.equal(organic.gclid, null);
  assert.equal(organic.campaign, "");
  location.search = "?utm_source=instagram&utm_medium=social";
  assert.equal(api.getTrafficSource(), "Instagram");
  assert.equal(api.getGCLID(), null);
  api.clearAttribution();
  assert.equal(values.size, 0);
});
