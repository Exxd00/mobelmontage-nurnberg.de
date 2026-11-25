import { getQuoteFields } from "./quote-requirements";

type Inquiry = {
  reference: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  plz: string;
  message: string;
  fileUrls: string[];
  fileAttachments: { filename: string }[];
  serviceDetails: Record<string, string>;
  businessInquiry: boolean;
};

type Row = { label: string; value: string; href?: string };
type Group = { title?: string; rows: Row[] };
type Card = { title: string; tone: keyof typeof tones; icon: string; groups?: Group[]; paragraph?: string; files?: { name: string; href?: string }[] };

const tones = {
  contact: { accent: "#93404A", edge: "#BC5861", dark: "#FFABB5" },
  time: { accent: "#275D41", edge: "#508962", dark: "#A8DABC" },
  job: { accent: "#31583A", edge: "#79956D", dark: "#BED9AC" },
  access: { accent: "#594578", edge: "#8B72A9", dark: "#D8BEF3" },
  note: { accent: "#495662", edge: "#85919B", dark: "#C6D8E6" },
  files: { accent: "#775024", edge: "#AB834A", dark: "#EFCEA3" },
};

const jobTitles: Record<string, string> = {
  moebelmontage: "Möbel-Details", kuechenmontage: "Küchen-Details", lieferungen: "Liefer-Details",
  umzuege: "Umzugsdetails", entruempelung: "Räumungsdetails", andere: "Auftragsdetails",
};
const labels: Record<string, string> = {
  assemblyTask: "Auftrag", furnitureType: "Möbelart", furnitureCondition: "Zustand",
  wallFixing: "Wandbefestigung", wallMaterial: "Wandmaterial", remainingWork: "Restarbeiten",
  partsLocation: "Lage der Teile", reassemblySite: "Wiederaufbau", transfer: "Transport",
  afterDismantling: "Nach dem Abbau", internalCarry: "Trageweg im Haus",
  form: "Küchenform", cabinetCount: "Schränke gesamt", kitchenCondition: "Montagezustand",
  hasOldKitchen: "Arbeiten an der Altküche", oldKitchenScope: "Umfang der Altküche",
  countertopType: "Arbeitsplatte", worktopScope: "Maße & Zuschnitte", appliances: "Geräteeinbau",
  connections: "Anschlüsse prüfen", itemDescription: "Transportgut", itemSize: "Größtes Packstück",
  itemWeight: "Höchstgewicht (kg)", taskDescription: "Aufgabe", scope: "Umfang", access: "Zugang",
};
const stopLabels: Record<string, string> = {
  Address: "Adresse", Floor: "Übergabepunkt", Level: "Etage", Lift: "Stück passt in Aufzug",
  Parking: "Trageweg ab Halteplatz", Distance: "Weglänge (m)",
};

function fieldLabel(service: string, key: string, original: string) {
  if (key === "specification") return service === "kuechenmontage" ? "Plan & Maße" : "Modelle & Ausstattung";
  if (key === "itemCount") return service === "lieferungen" ? "Transportstücke" : "Möbelstücke";
  const stopField = /^(pickup|delivery|worksite)(Address|Floor|Level|Lift|Parking|Distance)$/.exec(key);
  return stopField ? stopLabels[stopField[2]] : labels[key] || original;
}

function html(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function lines(value: string) { return html(value).replace(/\r\n?|\n/g, "<br>"); }

export function legacyAttachmentUrl(value: string) {
  try {
    const url = new URL(value);
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* Invalid addresses have no link in the email. */ }
}

function linkedFile(value: string, index: number) {
  const href = legacyAttachmentUrl(value);
  if (!href) return [];
  let name = new URL(href).pathname.split("/").filter(Boolean).at(-1) || "";
  try { name = decodeURIComponent(name); } catch { /* Keep the encoded filename. */ }
  return [{ name: name || `Dateilink ${index + 1}`, href }];
}

function rowsTable(rows: Row[]) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse">${rows.map(row => {
    const value = row.href
      ? `<a class="contact-link" href="${html(row.href)}" style="color:#843E43;text-decoration:underline;word-break:break-all">${lines(row.value)}</a>`
      : lines(row.value);
    return `<tr><th class="label" scope="row" width="37%" align="left" valign="top" style="width:37%;padding:3px 8px 3px 0;font-size:14px;line-height:19px;font-weight:400;color:#4B594D;overflow-wrap:anywhere;word-wrap:break-word">${html(row.label)}</th>
      <td class="value" valign="top" style="padding:3px 0;color:#202A22;font-size:15px;line-height:20px;overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word">${value}</td></tr>`;
  }).join("")}</table>`;
}

function cardHtml(card: Card) {
  const { accent, edge } = tones[card.tone];
  const content = (card.groups || []).map(group => {
    const subheading = group.title ? `<h3 class="value" style="margin:6px 0 1px;color:#202A22;font-size:14px;line-height:19px">${html(group.title)}</h3>` : "";
    return subheading + rowsTable(group.rows);
  }).join("");
  const note = card.paragraph ? `<p class="value" style="color:#202A22;font-size:15px;line-height:21px;margin:0;overflow-wrap:anywhere;word-break:break-word">${lines(card.paragraph)}</p>` : "";
  const files = (card.files || []).map(file => `<p class="value" style="margin:3px 0;color:#202A22;font-size:15px;line-height:20px;overflow-wrap:anywhere;word-break:break-all">${file.href
    ? `<a class="contact-link" href="${html(file.href)}" style="color:#843E43;text-decoration:underline">${html(file.name)}</a>`
    : html(file.name)}</p>`).join("");
  return `<tr><td style="padding:0 0 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed">
    <tr><td class="card" bgcolor="#FFFEFA" style="border:1px solid #D3D9D0;border-left:4px solid ${edge};border-radius:9px;padding:10px 12px;background:#FFFEFA">
      <h2 class="tone-${card.tone}" style="margin:0 0 4px;color:${accent};font-size:16px;line-height:21px;font-weight:700"><span aria-hidden="true">${card.icon}</span>&nbsp; ${html(card.title)}</h2>
      ${content}${note}${files}</td></tr></table></td></tr>`;
}

function phoneActions(phone: string) {
  const normalized = phone.trim().replace(/^(\+\d{1,3}|00\d{1,3})\s*\(0\)/, "$1").replace(/[^\d+]/g, "");
  if (!/^\+?\d{4,20}$/.test(normalized)) return undefined;
  const digits = normalized.replace(/^00/, "+").replace(/^0/, "+49").replace(/^\+/, "");
  return { tel: "tel:" + normalized, whatsapp: "https://wa.me/" + digits };
}

function actionButtons(links: NonNullable<ReturnType<typeof phoneActions>>) {
  const action = (label: string, href: string, isPhone: boolean) => {
    const color = isPhone ? "#7F333A" : "#FFFFFF";
    const background = isPhone ? "#FAE9E5" : "#246442";
    const border = isPhone ? "#AB5359" : "#246442";
    return `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr>
      <td class="${isPhone ? "phone-btn" : "wa-btn"}" align="center" valign="middle" height="44" bgcolor="${background}" style="border:1px solid ${border};border-radius:8px;background:${background};height:44px;mso-padding-alt:0">
      <a href="${href}" class="${isPhone ? "phone-text" : "wa-text"}" style="display:block;text-align:center;color:${color};font-family:Arial,sans-serif;font-weight:bold;font-size:15px;line-height:44px;text-decoration:none;mso-line-height-rule:exactly">${label}</a></td></tr></table>`;
  };
  return `<tr><td style="padding:0 0 9px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="table-layout:fixed"><tr>
    <td width="50%" style="padding-right:4px">${action("Jetzt anrufen", links.tel, true)}</td>
    <td width="50%" style="padding-left:4px">${action("WhatsApp", links.whatsapp, false)}</td></tr></table></td></tr>`;
}

function collectCards(data: Inquiry, dial: string | undefined, express: boolean) {
  const details = data.serviceDetails;
  const callback = data.service === "rueckruf";
  const contact: Row[] = [{ label: "Name", value: data.name }];
  if (details.company && (data.businessInquiry || callback)) contact.push({ label: "Firma", value: details.company });
  contact.push({ label: "Telefon", value: data.phone, href: dial });
  if (data.email) contact.push({ label: "E-Mail", value: data.email, href: "mailto:" + encodeURIComponent(data.email).replace("%40", "@") });
  if (data.plz && data.service !== "lieferungen" && data.service !== "umzuege") contact.push({ label: "Einsatz-PLZ", value: data.plz });
  const cards: Card[] = [{ title: "Kontaktdaten", tone: "contact", icon: "&#128100;", groups: [{ rows: contact }] }];
  const timing: Row[] = [];
  if (express) timing.push({ label: "Dringlichkeit", value: "Express gewünscht" });
  if (!callback && details.timeframe) {
    const date = details.requestedDate && /^(\d{4})-(\d{2})-(\d{2})$/.exec(details.requestedDate);
    timing.push(date && details.timeframe === "An einem festen Datum"
      ? { label: "Wunschtermin", value: `${date[3]}.${date[2]}.${date[1]}` }
      : { label: "Zeitraum", value: details.timeframe });
  }
  if (details.timeSlot && (data.businessInquiry || callback)) timing.push({ label: callback ? "Erreichbar" : "Zugangszeit", value: details.timeSlot });
  if (timing.length) cards.push({ title: callback ? "Rückrufzeit" : "Terminwunsch", tone: "time", icon: "&#128197;", groups: [{ rows: timing }] });
  if (!callback) {
    const job: Row[] = [];
    const access = new Map<string, Row[]>();
    for (const field of getQuoteFields(data.service, details, data.businessInquiry)) {
      if (["company", "timeSlot", "timeframe", "requestedDate"].includes(field.key)) continue;
      const value = details[field.key] || (field.key === "specification" && data.fileAttachments.length ? "Siehe E-Mail-Anhang." : "");
      if (!value) continue;
      const row = { label: fieldLabel(data.service, field.key, field.label), value };
      if (field.group === "Arbeitsumfang") job.push(row);
      else {
        const group = field.group === "Transport und Zugang" ? "" : field.group;
        const rows = access.get(group) || [];
        rows.push(row);
        access.set(group, rows);
      }
    }
    if (job.length) cards.push({ title: jobTitles[data.service] || "Auftragsdetails", tone: "job", icon: "&#128295;", groups: [{ rows: job }] });
    if (access.size) cards.push({ title: "Zugang & Parken", tone: "access", icon: "&#127359;", groups: Array.from(access, ([title, rows]) => ({ title, rows })) });
  }
  if (data.message.trim()) cards.push({ title: "Nachricht", tone: "note", icon: "&#9993;", paragraph: data.message.trim() });
  const files = [...data.fileAttachments.map(file => ({ name: file.filename })), ...data.fileUrls.flatMap(linkedFile)];
  if (files.length) cards.push({ title: "Dateien", tone: "files", icon: "&#128206;", files });
  return cards;
}

function plainCard(card: Card) {
  const parts = [card.title];
  for (const group of card.groups || []) {
    if (group.title) parts.push(group.title);
    for (const row of group.rows) parts.push(`${row.label}: ${row.value}`);
  }
  if (card.paragraph) parts.push(card.paragraph);
  for (const file of card.files || []) parts.push(file.href ? `${file.name}: ${file.href}` : file.name);
  return parts.join("\n");
}

export function buildOperatorEmail(data: Inquiry, options: { serviceName: string; express: boolean; receivedAt?: Date; submittedAt?: Date }) {
  const domain = "mobelmontage-nurnberg.de";
  const title = data.service === "rueckruf" ? "Neuer Rückrufwunsch" : "Neue Anfrage";
  const service = data.service === "lieferungen" ? "Möbellieferung" : options.serviceName;
  const received = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(options.submittedAt ?? options.receivedAt ?? new Date());
  const links = phoneActions(data.phone);
  const cards = collectCards(data, links?.tel, options.express);
  const footer = `${options.submittedAt ? "Anfrage erstellt" : "Eingang"} ${received} Uhr · ${data.reference}`;
  const darkStyles = `.canvas{background-color:#222A25!important}.card{background-color:#303A33!important;border-top-color:#4C574E!important;border-right-color:#4C574E!important;border-bottom-color:#4C574E!important}.value,.heading{color:#F3F4EB!important}.label,.foot{color:#C4CFC3!important}.domain,.contact-link{color:#FFB5AF!important}.pill{background-color:#C4D7B7!important;color:#243A29!important}.phone-btn{background-color:#482E31!important;border-color:#D18891!important}.phone-text{color:#FFD4D7!important}.wa-btn{background-color:#356A48!important;border-color:#81B993!important}.wa-text{color:#FFFFFF!important}${Object.entries(tones).map(([key,tone])=>`.tone-${key}{color:${tone.dark}!important}`).join("")}`;
  const outlookDark = darkStyles.replace(/(^|})(\.[^{]+)/g, (_, before, selectors: string) => before + selectors.split(",").map(s => "[data-ogsc] " + s).join(","));
  const renderedCards = cards.map((card, index) => cardHtml(card) + (index === 0 && links ? actionButtons(links) : "")).join("");
  const markup = `<!doctype html><html lang="de" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
    <title>${html(title)} · ${html(service)}</title><style>:root{color-scheme:light dark;supported-color-schemes:light dark}@media(prefers-color-scheme:dark){${darkStyles}}${outlookDark}</style></head>
    <body style="margin:0;padding:0;background:#F7F5EF"><table lang="de" dir="ltr" role="presentation" class="canvas" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F5EF" style="width:100%;background:#F7F5EF;font-family:Arial,Helvetica,sans-serif"><tr><td align="center" style="padding:10px 8px">
    <!--[if mso]><table role="presentation" width="552" border="0" cellspacing="0" cellpadding="0"><tr><td><![endif]-->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="width:100%;max-width:552px;table-layout:fixed;font-family:Arial,Helvetica,sans-serif">
    <tr><td align="center" style="padding:5px 0 12px"><h1 class="heading" style="margin:0 0 3px;color:#202A22;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:27px"><span aria-hidden="true">&#128236;</span> ${html(title)}</h1>
    <a class="domain" href="https://${domain}/" style="font-size:14px;line-height:20px;color:#713E39;text-decoration:underline">${domain}</a>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:8px auto 0"><tr><td class="pill" bgcolor="#DEE8D7" style="color:#284A32;background:#DEE8D7;border-radius:18px;padding:4px 13px;font-size:14px;line-height:20px;font-weight:bold">${html(service)}</td></tr></table></td></tr>
    ${renderedCards}<tr><td class="foot" align="center" style="padding:2px 4px 9px;font-size:12px;line-height:17px;color:#4B594D">${html(footer)}</td></tr></table>
    <!--[if mso]></td></tr></table><![endif]--></td></tr></table></body></html>`;
  const textCards = cards.map((card, index) => plainCard(card) + (index === 0 && links ? `\nJetzt anrufen: ${links.tel}\nWhatsApp: ${links.whatsapp}` : ""));
  return { html: markup, text: [title, domain, service, ...textCards, footer].join("\n\n") };
}
