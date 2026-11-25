// Run after the production build with node --test tests/contact-retry.test.cjs.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { NextRequest } = require("next/server");
const root = path.join(__dirname, "..");

function sheetHarness() {
  const rows = [["Datum","Status","Event-Typ","Name","E-Mail","PLZ","Service","Priorität","Quelle","GCLID","Bewertung","Notizen"]];
  let held = false;
  const lock = {
    waitLock() { assert.equal(held, false); held = true; },
    hasLock() { return held; },
    releaseLock() { held = false; },
  };
  const sheet = {
    getSheetId: () => 0, getLastRow: () => rows.length,
    getLastColumn: () => rows[0].length, getMaxColumns: () => 26, getMaxRows: () => 1000,
    getRange(row, col) {
      assert.equal(held, true, "Read and append within the same script lock");
      return {
        getDisplayValues: () => [rows[0]],
        setValue(value) { rows[row-1][col-1] = value; },
        setValues([values]) { rows[row-1] = Array.from(values); },
        createTextFinder(key) {
          return { matchEntireCell() { return {findNext: () => rows.slice(1).some(values => values[col-1] === key)}; } };
        },
      };
    },
  };
  const sandbox = vm.createContext({
    SpreadsheetApp: {getActiveSpreadsheet: () => ({getSheets: () => [sheet]}), flush() { assert.equal(held, true); }},
    LockService: { getScriptLock: () => lock },
    Utilities: { formatDate: () => "25.11.2026 12:00" },
    ContentService: { MimeType: {JSON: "json"}, createTextOutput: value => ({setMimeType: () => value}) },
  });
  vm.runInContext(readFileSync(path.join(root, "operator-files/google-sheets-script/script.gs"), "utf8"), sandbox);
  sandbox.formatRow = () => {};
  sandbox.addDropdowns = () => {};
  return { rows, write: contents => JSON.parse(sandbox.doPost({postData:{contents}})) };
}

test("retry after accepted email and worksheet write keeps one email and one lead row", async t => {
  t.mock.method(console, "log", () => {});
  const { POST } = require(path.join(root, ".next/server/app/api/contact/route.js")).routeModule.userland;
  const saved = {};
  const env = { RESEND_API_KEY: "offline", RECIPIENT_EMAIL: "office@example.invalid",
    RESEND_FROM_EMAIL: "local@example.invalid", SHEETS_WEBHOOK_URL: "https://sheet.invalid/fixture" };
  for (const [key, value] of Object.entries(env)) { saved[key] = process.env[key]; process.env[key] = value; }
  t.after(() => {
    for (const [key,value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
  const sheet = sheetHarness();
  const accepted = new Map();
  t.mock.method(globalThis, "fetch", async (url, init) => {
    if (url === "https://api.resend.com/emails") {
      const id = init.headers["Idempotency-Key"];
      assert.match(id, /^montage\/[a-f\d]{64}$/);
      if (accepted.has(id)) assert.equal(accepted.get(id), init.body);
      accepted.set(id, init.body);
      return Response.json({id: "offline-message"});
    }
    assert.equal(url, env.SHEETS_WEBHOOK_URL);
    return Response.json(sheet.write(init.body));
  });
  const enquiry = {
    attempt: "1795608000000/4987b2fd-00fa-4d0a-9b70-dd8230038ecd",
    service: "rueckruf", name: "Offline fixture", phone: "+49 911 0000000", message: "Möbel aufbauen",
  };
  const submit = async body => {
    const request = new NextRequest("http://localhost/api/contact", {method:"POST",body:JSON.stringify(body)});
    const response = await POST(request);
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.notificationsSent, {sheets:true,email:true});
    return result.reference;
  };
  const first = await submit(enquiry);
  assert.equal(await submit(enquiry), first);
  assert.equal(accepted.size, 1);
  assert.equal(sheet.rows.length, 2);
  assert.deepEqual(sheet.rows[0].slice(-2), ["Notizen","Anfragenummer"]);
  assert.equal(sheet.rows[1].at(-1), first);
  assert.notEqual(await submit({...enquiry, message:"Weiteren Schrank aufbauen"}), first);
  assert.equal(accepted.size, 2);
  assert.equal(sheet.rows.length, 3);
});
