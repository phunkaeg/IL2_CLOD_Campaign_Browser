// Cliffs of Dover Campaign Board local companion bridge
// Run from the project root with:
//   node scripts/local-companion-server.mjs
//
// Serves ./dist and provides local-only API endpoints for:
// - saving companion options
// - scanning a campaign folder into campaign-data.json
// - launching Cliffs server mode with the selected mission
// - reading pilot log bridge output

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.BOB_APP_ROOT || path.resolve(__dirname, "..");
const port = Number(process.env.BOB_COMPANION_PORT || 8765);
const configPath = process.env.BOB_CONFIG_DIR
  ? path.join(process.env.BOB_CONFIG_DIR, "companion-config.json")
  : path.join(root, "companion-config.json");

const defaultConfig = {
  clodInstallDir: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\IL-2 Sturmovik Cliffs of Dover Blitz",
  clodDocumentsDir: "%USERPROFILE%\\Documents\\1C SoftClub\\il-2 sturmovik cliffs of dover",
  campaignRoot: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\IL-2 Sturmovik Cliffs of Dover Blitz\\parts\\bob\\mission\\campaign",
  campaignTitle: "",
  pilotLogDir: "%USERPROFILE%\\Documents\\1C SoftClub\\il-2 sturmovik cliffs of dover\\CampaignBoard",
  pilotLogPath: "%USERPROFILE%\\Documents\\1C SoftClub\\il-2 sturmovik cliffs of dover\\CampaignBoard\\events.jsonl",
  mapImagePath: "auto",
  mapWidth: 0,
  mapHeight: 0,
  autoSelectMap: false,
  assetMode: "reference",
  autoWriteSrcu: false,
  serverPassword: ""
};

function expandEnv(value = "") {
  return String(value)
    .replace(/%USERPROFILE%/gi, process.env.USERPROFILE || "")
    .replace(/\$USERPROFILE/g, process.env.USERPROFILE || "");
}

function isPilotLogFile(value = "") {
  return /\.(jsonl|json|txt)$/i.test(String(value));
}

function pilotLogDirFromConfig(input = {}) {
  const raw = input.pilotLogDir || input.pilotLogFolder || input.pilotLogPath || defaultConfig.pilotLogDir;
  const expanded = expandEnv(raw);
  return isPilotLogFile(expanded) ? path.dirname(expanded) : expanded;
}

function pilotLogPathFromConfig(input = {}) {
  const dir = pilotLogDirFromConfig(input);
  return path.join(dir, "events.jsonl");
}

function ensurePilotLogFile() {
  try {
    const dir = path.dirname(config.pilotLogPath);
    fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(config.pilotLogPath)) fs.writeFileSync(config.pilotLogPath, "", "utf8");
  } catch (e) { console.warn("Could not create pilot log file:", e.message); }
}

function normaliseConfig(input = {}) {
  return {
    ...defaultConfig,
    ...input,
    clodInstallDir: expandEnv(input.clodInstallDir || defaultConfig.clodInstallDir),
    clodDocumentsDir: expandEnv(input.clodDocumentsDir || defaultConfig.clodDocumentsDir),
    campaignRoot: expandEnv(input.campaignRoot || defaultConfig.campaignRoot),
    campaignTitle: input.campaignTitle || "",
    pilotLogDir: pilotLogDirFromConfig(input),
    pilotLogPath: pilotLogPathFromConfig(input),
    // Application mode: maps are selected automatically by theatre, and campaign assets are referenced in place.
    mapImagePath: "auto",
    mapWidth: Number(input.mapWidth || 0),
    mapHeight: Number(input.mapHeight || 0),
    autoSelectMap: false,
    assetMode: "reference",
    autoWriteSrcu: !!input.autoWriteSrcu,
    serverPassword: input.serverPassword || ""
  };
}

function loadConfig() {
  try {
    return normaliseConfig(JSON.parse(fs.readFileSync(configPath, "utf8")));
  } catch {
    const cfg = normaliseConfig(defaultConfig);
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
    return cfg;
  }
}

let config = loadConfig();
ensurePilotLogFile();

function saveConfig(nextConfig) {
  config = normaliseConfig(nextConfig);
  ensurePilotLogFile();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return config;
}

function sendJson(res, status, payload) {
  const data = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}


function psSingleQuoted(value = "") {
  return String(value).replace(/'/g, "''");
}

function browseFolderDialog({ title = "Select folder", initialDir = "" } = {}) {
  const command = `Add-Type -AssemblyName System.Windows.Forms; $d = New-Object System.Windows.Forms.FolderBrowserDialog; $d.Description = '${psSingleQuoted(title)}'; $d.ShowNewFolderButton = $true; $initial = '${psSingleQuoted(expandEnv(initialDir))}'; if ($initial -and (Test-Path $initial)) { $d.SelectedPath = $initial }; if ($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($d.SelectedPath) }`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-STA", "-Command", command], { encoding: "utf8", windowsHide: false });
  if (result.error) throw result.error;
  if (result.status && result.status !== 0) throw new Error(result.stderr || "Folder browser failed");
  return (result.stdout || "").trim();
}

function browseFileDialog({ title = "Select file", initialFile = "" } = {}) {
  const initial = expandEnv(initialFile);
  const initialDir = initial && path.dirname(initial);
  const command = `Add-Type -AssemblyName System.Windows.Forms; $d = New-Object System.Windows.Forms.OpenFileDialog; $d.Title = '${psSingleQuoted(title)}'; $d.Filter = 'JSONL / JSON / Text|*.jsonl;*.json;*.txt|All files|*.*'; $initialDir = '${psSingleQuoted(initialDir || "")}'; if ($initialDir -and (Test-Path $initialDir)) { $d.InitialDirectory = $initialDir }; if ($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($d.FileName) }`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-STA", "-Command", command], { encoding: "utf8", windowsHide: false });
  if (result.error) throw result.error;
  if (result.status && result.status !== 0) throw new Error(result.stderr || "File browser failed");
  return (result.stdout || "").trim();
}

function listDirs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dir, entry.name))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true }));
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dir, entry.name));
}

function isIgnoredBriefing(file) {
  return /_(pl|ru|cs|de|es|fr|it)\.briefing$/i.test(path.basename(file));
}

function readTextMaybe(file) {
  try {
    return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  } catch {
    return "";
  }
}

function firstFile(files, ext) {
  return files.find((file) => file.toLowerCase().endsWith(ext.toLowerCase()));
}

function extractBriefingSections(text) {
  const sections = [];
  const re = /\[([^\]]+)\]([\s\S]*?)(?=\n\[[^\]]+\]|\s*$)/g;
  let match;
  while ((match = re.exec(text))) {
    const section = match[1].trim();
    const body = match[2] || "";
    const name = (body.match(/<Name>\s*([\s\S]*?)(?=<|$)/i)?.[1] || section).trim();
    const description = (body.match(/<Description>\s*([\s\S]*?)(?=<Slide>|<Caption>|\n\[[^\]]+\]|$)/i)?.[1] || "").trim();
    const slides = [];
    const slideRe = /<Slide>\s*([\s\S]*?)(?=<Slide>|\n\[[^\]]+\]|$)/gi;
    let slideMatch;
    while ((slideMatch = slideRe.exec(body))) {
      const block = slideMatch[1] || "";
      const filename = (block.split(/<Caption>/i)[0] || "").trim();
      const caption = (block.match(/<Caption>\s*([\s\S]*)/i)?.[1] || "").trim();
      if (filename || caption) slides.push({ section, sectionName: name, filename, caption, title: name });
    }
    sections.push({ section, name, description, slides });
  }
  return sections;
}

function cleanBriefingText(text) {
  const sections = extractBriefingSections(text);
  const info = sections.find((s) => /^info$/i.test(s.section));
  const firstDesc = sections.find((s) => s.description)?.description;
  const firstCaption = info?.slides?.find((s) => s.caption)?.caption;
  return firstDesc || firstCaption || text.replace(/<[^>]+>/g, " ").replace(/\[[^\]]+\]/g, " ").replace(/\s+/g, " ").trim();
}

function parseMisSections(text = "") {
  const sections = new Map();
  let current = null;
  let lines = [];
  const commit = () => {
    if (current !== null) sections.set(current, lines.join("\n"));
  };
  for (const rawLine of String(text).replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const header = rawLine.match(/^\s*\[([^\]]+)\]\s*$/);
    if (header) {
      commit();
      current = header[1].trim();
      lines = [];
    } else if (current !== null) {
      lines.push(rawLine);
    }
  }
  commit();
  return sections;
}

function parseMis(misText) {
  const text = String(misText || "").replace(/^\uFEFF/, "");
  const time = Number(text.match(/^\s*TIME\s+([0-9.]+)/mi)?.[1] || NaN);
  const dayOffsetRaw = text.match(/^\s*DayOffset\s+(-?\d+)/mi)?.[1];
  const dayOffset = dayOffsetRaw === undefined ? null : Number(dayOffsetRaw);
  const sections = parseMisSections(text);
  const mainBody = sections.get("MAIN") || "";
  const player = mainBody.match(/^\s*player\s+(.+)$/mi)?.[1]?.trim() || "";
  const playerPrefix = player.replace(/\.\d+$/, "");
  const airGroups = [];

  for (const [id, body] of sections.entries()) {
    if (/_Way$/i.test(id)) continue;

    const aircraft =
      body.match(/^\s*Class\s+Aircraft\.([^\s;]+)/mi)?.[1] ||
      body.match(/^\s*Class\s+([^\s;]*Aircraft[^\s;]*)/mi)?.[1]?.split(".").pop() ||
      "";
    if (!aircraft) continue;

    const briefing =
      body.match(/^\s*Briefing\s+"?(.+?)"?\s*$/mi)?.[1]?.trim() ||
      body.match(/^\s*Name\s+"?(.+?)"?\s*$/mi)?.[1]?.trim() ||
      id;

    const formation = body.match(/^\s*Formation\s+(.+)$/mi)?.[1]?.trim() || "";
    const skill = body.match(/^\s*Skill\s+(.+)$/mi)?.[1]?.trim() || "";
    const wayBody = sections.get(      `${id}_Way`) || sections.get(`${id}.Way`) || "";
    const waypoints = [];

    for (const line of wayBody.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(";") || trimmed.startsWith("#")) continue;
      const parts = trimmed.split(/\s+/);
      const nums = parts.slice(1).map((part) => Number(String(part).replace(/,$/, ""))).filter(Number.isFinite);
      if (parts[0] && nums.length >= 2) {
        waypoints.push({
          action: parts[0],
          x: nums[0],
          y: nums[1],
          alt: nums[2] ?? 0,
          speed: nums[3] ?? 0,
          extra: parts.slice(5).join(" ")
        });
      }
    }

    const sideText = `${id} ${briefing} ${aircraft}`;
    const side = inferAirSide(sideText);
    const unit = unitFromAirGroupId(id, briefing);
    const prettyAircraft = friendlyAircraftName(aircraft);

    airGroups.push({ id, airGroupId: id, briefing, unit, side, aircraft: prettyAircraft, rawAircraft: aircraft, formation, skill, waypoints });
  }

  return { time: Number.isFinite(time) ? time : null, dayOffset: Number.isFinite(dayOffset) ? dayOffset : null, player, playerPrefix, airGroups };
}

function inferMissionType(title, briefing) {
  const text = `${title} ${briefing}`.toLowerCase();
  if (/convoy|shipping|harbour|harbor/.test(text)) return "Convoy Battle";
  if (/recon|recce/.test(text)) return "Reconnaissance";
  if (/rescue|seenot/.test(text)) return "Search & Rescue";
  if (/raid|attack|bomb|stuka/.test(text)) return "Raid";
  if (/patrol/.test(text)) return "Patrol";
  return "Mission";
}

function isNarrativeBriefingSection(section = "") {
  return /^(info|mainintro|intro|introduction|success|failure|fail|missionintro|missionsuccess|missionfailure|background|notes?|objectives?|results?|debrief|summary)$/i.test(String(section).trim());
}

function playableFromSections(sections, airGroups) {
  const roles = [];
  for (const section of sections) {
    const matchingGroup = airGroups.find((g) => {
      const a = section.section.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const b = g.briefing.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const c = g.id.toLowerCase().replace(/[^a-z0-9]+/g, "");
      return a && ((b && (a === b || a.includes(b) || b.includes(a))) || c.includes(a));
    });

    if (isNarrativeBriefingSection(section.section) || isNarrativeBriefingSection(section.name)) continue;
    if (!matchingGroup && !/(sqn|squadron|staffel|gruppe|jg|kg|lg|stg|raf|luftwaffe|regia|aeronautica|italian|italia|squadriglia|cr[._-]?42|g[._-]?50|br[._-]?20|fiat|macchi)/i.test(`${section.section} ${section.name} ${section.description}`)) continue;

    const sideText = `${section.section} ${section.name} ${section.description} ${matchingGroup?.id || ""} ${matchingGroup?.aircraft || ""}`;
    const side = matchingGroup?.side || inferAirSide(sideText);
    const line = section.description.split(/\r?\n/).find(Boolean) || section.name;
    const aircraft = friendlyAircraftName(matchingGroup?.aircraft || (line.match(/-\s*([^-]+?)\s*-/)?.[1] || "").trim());
    const role = (line.split(" - ").slice(2).join(" - ") || inferMissionType(section.name, section.description) || "Flight Section").trim();
    const sectionLabel = String(section.name || section.section || "").trim();
    const unit = matchingGroup?.unit || (!isNarrativeBriefingSection(sectionLabel) && !/^\d+$/.test(sectionLabel) ? sectionLabel : "Flight Section");
    roles.push({ side, unit, id: matchingGroup?.unit || section.section, airGroupId: matchingGroup?.id || "", aircraft, role, description: section.description });
  }
  return roles;
}

function copyAssetToTargets(file, assetName) {
  for (const folder of [path.join(root, "public", "campaign-assets"), path.join(root, "dist", "campaign-assets")]) {
    try {
      fs.mkdirSync(folder, { recursive: true });
      fs.copyFileSync(file, path.join(folder, assetName));
    } catch {}
  }
}

function localAssetUrl(file) {
  return `/api/asset?path=${encodeURIComponent(path.resolve(file))}`;
}

function assetUrlFor(file, assetName) {
  if (!file || !fs.existsSync(file)) return "";
  if (config.assetMode === "copy") {
    copyAssetToTargets(file, assetName);
    return `/campaign-assets/${assetName}`;
  }
  return localAssetUrl(file);
}

function publicFilePath(urlPath = "") {
  const clean = String(urlPath).replace(/^\/+/, "");
  return path.join(root, "public", clean);
}

function readPngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function readJpegSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function readImageSize(file) {
  try {
    if (!file || !fs.existsSync(file)) return null;
    if (/\.png$/i.test(file)) return readPngSize(file);
    if (/\.jpe?g$/i.test(file)) return readJpegSize(file);
  } catch {}
  return null;
}

function resolveMapImageFile(imageUrl = "") {
  if (!imageUrl) return "";
  if (/^\/api\/asset\?path=/i.test(imageUrl)) {
    try { return decodeURIComponent(new URL(`http://local${imageUrl}`).searchParams.get("path") || ""); } catch { return ""; }
  }
  if (/^[\/][^\/]/.test(imageUrl)) return publicFilePath(imageUrl);
  return path.isAbsolute(imageUrl) ? imageUrl : publicFilePath(imageUrl);
}

function scalePoint(point, sx, sy) {
  return { ...point, pixelX: Math.round(point.pixelX * sx), pixelY: Math.round(point.pixelY * sy) };
}

function finaliseMapInfo(info) {
  const file = resolveMapImageFile(info.image);
  const detected = readImageSize(file);
  const width = Number(config.mapWidth || detected?.width || info.width || 2048);
  const height = Number(config.mapHeight || detected?.height || info.height || 1798);
  const baseWidth = Number(info.baseWidth || info.width || width);
  const baseHeight = Number(info.baseHeight || info.height || height);
  const sx = width / baseWidth;
  const sy = height / baseHeight;
  return {
    ...info,
    width,
    height,
    calibrationPoints: (info.calibrationPoints || []).map((p) => scalePoint(p, sx, sy)),
    gameCalibration: (info.gameCalibration || []).map((p) => scalePoint(p, sx, sy)),
  };
}

function configuredMapImageUrl() {
  const value = String(config.mapImagePath || "").trim();
  if (!value || /^auto$/i.test(value)) return "";
  if (/^[\\/][^\\/]/.test(value)) return value.replace(/\\/g, "/");
  const resolved = path.isAbsolute(value) ? value : path.join(root, "public", value.replace(/^[\\/]+/, ""));
  if (fs.existsSync(resolved)) return assetUrlFor(resolved, `map_${path.basename(resolved)}`.replace(/[^\w.\-]+/g, "_"));
  return value.replace(/\\/g, "/");
}

function cleanCampaignTitle(name = "") {
  return String(name)
    .replace(/^Operation\s+/i, "Operation ")
    .replace(/^\d+\s*-\s*/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Cliffs of Dover Campaign";
}

function stripLangSuffix(base = "") {
  return String(base).replace(/_(pl|ru|cs|de|es|fr|it)$/i, "");
}

function fileBase(file) {
  return path.basename(file, path.extname(file));
}

function parseCampaignsIni(file) {
  const text = readTextMaybe(file);
  const blocks = new Map();
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    const sec = trimmed.match(/^\[([^\]]+)\]/);
    if (sec) { current = sec[1]; blocks.set(current, {}); continue; }
    if (!current || !trimmed || trimmed.startsWith(";")) continue;
    const kv = trimmed.match(/^(\w+)\s+(.+)$/);
    if (kv) blocks.get(current)[kv[1]] = kv[2].trim();
  }
  return blocks;
}

function inferDefaultDate(rootName = "") {
  if (/jubilee|dieppe/i.test(rootName)) return "1942-08-19";
  if (/tobruk|desert/i.test(rootName)) return "1941-06-01";
  return "1940-07-10";
}

function addDaysIso(date, offset) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function timeFloatToHHMM(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const hours = Math.floor(n) % 24;
  const minutes = Math.round((n - Math.floor(n)) * 60);
  const fixedHours = (hours + Math.floor(minutes / 60)) % 24;
  const fixedMinutes = minutes % 60;
  return `${String(fixedHours).padStart(2, "0")}${String(fixedMinutes).padStart(2, "0")}`;
}

function isMissionFragmentFile(file) {
  const base = fileBase(file).toLowerCase().replace(/[^a-z0-9]+/g, "");
  return base === "campaign" || base === "mainintro" || base === "missionintro" || base === "missionsuccess" || base === "missionfailure" || base === "success" || base === "failure";
}

function compactSideText(value = "") {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function inferAirSide(text = "", fallback = "RAF") {
  const compact = compactSideText(text);
  // Underscores are word characters, so word-boundary regexes miss ids like Tobruk_RA_150Gruppo.
  if (/(^|_)ra(_|$)|(^|_)regia(_|$)|aeronautica|italian|italia|squadriglia|gruppo|cr_?42|g_?50|br_?20|cant|z_?1007|mc_?200|fiat|macchi/.test(compact)) return "Regia Aeronautica";
  if (/(^|_)lw(_|$)|luftwaffe|(^|_)(jg|kg|lg|stg|zg)\d*|staffel|gruppe|aufkl|erprob|bf_?\d|me_?\d|he_?\d|do_?\d|ju_?\d/.test(compact)) return "Luftwaffe";
  if (/(^|_)raf(_|$)|(^|_)raaf(_|$)|sqn|squadron|spitfire|hurricane|blenheim|defiant|beaufighter|gladiator|wellington|kittyhawk|tomahawk|dh82/.test(compact)) return "RAF";
  return fallback;
}

function unitFromAirGroupId(id = "", briefing = "") {
  const explicit = String(briefing || "").trim();
  if (explicit && !/^\d+$/.test(explicit) && !/^tobruk:|^bob:/i.test(explicit)) return explicit;
  let clean = String(id || "").replace(/^.*:/, "").replace(/\.\d+$/, "");
  clean = clean.replace(/^(Tobruk|BoB)_(RAF|RAAF|RA|LW)_/i, "");
  let m = clean.match(/^(?:F|B|FB|R)_?(\d+)Sqn$/i);
  if (m) return `${m[1]} Sqn`;
  m = clean.match(/^([A-Z]+\d+)_?([IVX]+)?$/i);
  if (m) return [m[1].toUpperCase(), m[2]].filter(Boolean).join(" ");
  m = clean.match(/^(\d+)St_(\d+)Gruppo_(\d+)Sq$/i);
  if (m) return `${m[1]} Stormo · ${m[2]} Gruppo · ${m[3]} Squadriglia`;
  m = clean.match(/^(\d+)Gruppo_(\d+)Sq$/i);
  if (m) return `${m[1]} Gruppo · ${m[2]} Squadriglia`;
  return clean.replace(/_/g, " ") || explicit || "Flight Section";
}

function friendlyAircraftName(value = "") {
  let v = String(value || "").trim();
  if (!v) return "Aircraft TBC";
  v = v.replace(/_/g, " ").replace(/-Trop\b/i, " Trop");
  v = v.replace(/\bCR42\b/i, "CR.42").replace(/\bG50\b/i, "G.50").replace(/\bBR20\b/i, "BR.20").replace(/\bMC200\b/i, "MC.200").replace(/\bZ1007\b/i, "Z.1007");
  v = v.replace(/HurricaneMkI\b/i, "Hurricane Mk I").replace(/SpitfireMkI\b/i, "Spitfire Mk I").replace(/BlenheimMkIV\b/i, "Blenheim Mk IV");
  v = v.replace(/WellingtonMkIc\b/i, "Wellington Mk Ic").replace(/GladiatorMkII\b/i, "Gladiator Mk II").replace(/KittyhawkMkIA\b/i, "Kittyhawk Mk IA").replace(/TomahawkMkII\b/i, "Tomahawk Mk II").replace(/DH82A\b/i, "DH.82A");
  v = v.replace(/\bBf[ -]?109E[ -]?3\b/i, "Bf 109E-3").replace(/\bBf[ -]?109E[ -]?4\b/i, "Bf 109E-4");
  return v.replace(/\s+/g, " ").trim();
}

function aircraftFamilyToken(value = "") {
  const t = String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (!t) return "";
  if (t.includes("wellington") || t.includes("vickerswellington")) return "wellington";
  if (t.includes("spitfire")) return "spitfire";
  if (t.includes("hurricane")) return "hurricane";
  if (t.includes("bf109") || t.includes("me109")) return "109";
  if (t.includes("bf110") || t.includes("me110")) return "110";
  if (t.includes("blenheim")) return "blenheim";
  if (t.includes("ju87") || t.includes("stuka")) return "ju87";
  if (t.includes("ju88")) return "ju88";
  if (t.includes("cr42")) return "cr42";
  if (t.includes("g50")) return "g50";
  if (t.includes("br20")) return "br20";
  if (t.includes("gladiator")) return "gladiator";
  if (t.includes("dh82")) return "dh82";
  return t.slice(0, 10);
}

function playerAircraftFromText(text = "") {
  const m = String(text || "").match(/Player\s+Plane\s*:\s*([^\r\n]+)/i);
  if (!m) return "";
  return friendlyAircraftName(m[1].replace(/\s*Enemy\s+Plane.*$/i, "").trim());
}

function squadronNumberFromText(text = "") {
  const m = String(text || "").match(/\b(\d{1,3})\s*(?:\([^)]*\)\s*)?(?:Squadron|Sqn)\b/i);
  return m?.[1] || "";
}

function playerAircraftNumberFromText(text = "") {
  const m = String(text || "").match(/\b(?:aircraft|plane|Wellington|Hurricane|Spitfire|Blenheim|Stuka|Ju\s*87)\s*#\s*(\d+)\b/i);
  return m?.[1] || "";
}

function playableFromBriefingFallback(briefing = "", slides = [], airGroups = [], role = "Mission") {
  const text = [briefing, ...slides.map((slide) => slide.caption || "")].filter(Boolean).join("\n");
  const playerAircraft = playerAircraftFromText(text);
  const family = aircraftFamilyToken(playerAircraft);
  const squadron = squadronNumberFromText(text);
  const aircraftNo = playerAircraftNumberFromText(text);
  if (!family && !squadron) return [];

  let candidates = airGroups.filter((group) => Array.isArray(group.waypoints) && group.waypoints.length >= 2);
  if (family) candidates = candidates.filter((group) => aircraftFamilyToken(String(group.aircraft || "") + " " + String(group.rawAircraft || "")) === family);
  if (squadron) {
    const squadronRe = new RegExp("(?:^|[_\\s])" + squadron + "(?:Sqn|Squadron)?(?:[_\\s]|$)", "i");
    const squadronMatches = candidates.filter((group) => squadronRe.test([group.id, group.airGroupId, group.unit, group.briefing].filter(Boolean).join(" ")));
    if (squadronMatches.length) candidates = squadronMatches;
  }
  if (!candidates.length) return [];
  if (aircraftNo) {
    const n = String(Number(aircraftNo)).padStart(2, "0");
    const exact = candidates.find((group) => new RegExp("\\." + n + "$|\\." + Number(aircraftNo) + "$").test(group.id || "") || String(group.briefing || "") === String(Number(aircraftNo)));
    if (exact) candidates = [exact];
  }
  const best = candidates[0];
  return [{
    side: best.side,
    unit: best.unit || (squadron ? (squadron + " Sqn") : best.briefing || best.id),
    id: best.unit || best.briefing || best.id,
    airGroupId: best.id,
    aircraft: best.aircraft || playerAircraft || "Aircraft TBC",
    role: role || inferMissionType("", briefing),
    description: briefing
  }];
}

function isGenericMissionTitle(name = "") {
  const base = String(name || "").trim();
  return /^\d+$/.test(base) || /^(?:\d+_)?(?:mission|msn)\d*[_-]|^\d+[_-]mission[_-]\d+|^\d+tbk[_-]msn/i.test(base) || /_mission_\d+_rel$/i.test(base);
}

function inferBriefingAction(text = "") {
  const t = String(text || "").toLowerCase();
  if (/fighter cover|escort/.test(t)) return "Escort";
  if (/intercept|scramble|allarme/.test(t)) return "Interceptor Scramble";
  if (/patrol/.test(t)) return "Patrol";
  if (/recon|recce/.test(t)) return "Reconnaissance";
  if (/attack.*ground|ground forces|vehicles|tanks|artillery|dive bombing|bombing/.test(t)) return "Ground Attack";
  if (/convoy|shipping|harbour|harbor/.test(t)) return "Convoy Attack";
  return "Sortie";
}

function locationFromBriefingOpening(text = "") {
  const first = String(text || "").split(/\r?\n/).map(s => s.trim()).find(Boolean) || "";
  let line = first.replace(/^\s*\d{3,4}\s*(?:hrs?|hours?)?[\s,.;:-]*/i, "").trim();
  line = line.replace(/^\s*\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?[A-Za-z]+\s*,?\s+\d{4}\s*,?/i, "").trim();
  line = line.replace(/^\s*\d{1,2}[/.\-]\d{1,2}[/.\-]\d{2,4}\s*,?/i, "").trim();
  line = line.replace(/^\s*(?:at|from)\s+/i, "").trim();
  line = line.replace(/^[\s,.;:-]+/, "").replace(/[\s,.;:-]+$/, "").trim();
  return line.replace(/\s+/g, " ").slice(0, 44);
}

function deriveMissionDisplayTitle(parsedName, baseName, briefing = "", slides = []) {
  const raw = parsedName?.title || baseName || "Mission";
  if (!isGenericMissionTitle(raw) && !isGenericMissionTitle(baseName)) return raw;
  const missionNo = String(baseName || raw).match(/(?:mission|msn)[_-]?(\d+)/i)?.[1] || String(baseName || raw).match(/^(\d+)/)?.[1] || "";
  const slideCaption = slides.map(s => s.caption || "").find(Boolean) || "";
  const source = briefing || slideCaption;
  const location = locationFromBriefingOpening(source);
  const action = inferBriefingAction(source);
  const prefix = missionNo ? "Mission " + Number(missionNo) : "Mission";
  const suffix = [location, action && action !== "Sortie" ? action : ""].filter(Boolean).join(" · ");
  return suffix ? prefix + ": " + suffix : prefix;
}


const MONTHS = {
  jan: "01", january: "01",
  feb: "02", february: "02",
  mar: "03", march: "03",
  apr: "04", april: "04",
  may: "05",
  jun: "06", june: "06",
  jul: "07", july: "07",
  aug: "08", august: "08",
  sep: "09", sept: "09", september: "09",
  oct: "10", october: "10",
  nov: "11", november: "11",
  dec: "12", december: "12"
};

function normalizeYear(value = "") {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (String(value).length === 2) return String(n >= 30 ? 1900 + n : 2000 + n);
  return String(n).padStart(4, "0");
}

function isoFromNumericDate(a, b, y, preferred = "DMY") {
  const first = Number(a);
  const second = Number(b);
  const year = normalizeYear(String(y));
  if (!year || !Number.isFinite(first) || !Number.isFinite(second)) return "";

  // Cliffs campaigns and Commonwealth briefings normally use day/month/year.
  // Only flip to month/day/year if the numbers make DMY impossible.
  let day = first;
  let month = second;
  if (second > 12 && first <= 12) {
    month = first;
    day = second;
  } else if (preferred === "MDY" && first <= 12 && second <= 31) {
    month = first;
    day = second;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseBriefingDateTime(text = "", fallbackDate = "", fallbackTime = "") {
  const clean = String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  let time = fallbackTime || "";
  let date = fallbackDate || "";

  const timeMatch =
    clean.match(/\btime\s*[:\-]?\s*(\d{1,2})[:.](\d{2})\b/i) ||
    clean.match(/\b(\d{3,4})\s*(?:hrs?|hours?)\b/i) ||
    clean.match(/\btime\s*[:\-]?\s*(\d{3,4})\b/i);
  if (timeMatch) {
    if (timeMatch[2]) time = `${timeMatch[1].padStart(2, "0")}${timeMatch[2]}`;
    else time = timeMatch[1].padStart(4, "0");
  }

  const numericDateMatch = clean.match(/\b(?:date\s*[:\-]?\s*)?(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})\b/i);
  if (numericDateMatch) {
    const parsed = isoFromNumericDate(numericDateMatch[1], numericDateMatch[2], numericDateMatch[3], "DMY");
    if (parsed) date = parsed;
  }

  const dateMatch = clean.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([A-Za-z]+)\s*,?\s+(\d{4})\b/i);
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, "0");
    const month = MONTHS[dateMatch[2].toLowerCase()];
    const year = dateMatch[3];
    if (month) date = `${year}-${month}-${day}`;
  }

  return { date, time };
}

function parseMissionName(baseName = "", folderName = "", parsedTime = null) {
  const raw = String(baseName || folderName || "Mission").replace(/\s+/g, " ").trim();
  const folderTime = String(folderName || "").match(/^(\d{3,4})\s*-\s*(.+)$/);
  const pieces = raw.split(/\s+-\s+/).map((p) => p.trim()).filter(Boolean);
  let operation = "";
  let time = folderTime?.[1]?.padStart(4, "0") || "";
  let aircraft = "";
  let unit = "";
  let missionType = "";

  if (pieces.length >= 4 && /^\d{3,4}$/.test(pieces[1])) {
    operation = pieces[0];
    time = pieces[1].padStart(4, "0");
    aircraft = pieces[2] || "";
    unit = pieces[3] || "";
    missionType = pieces.slice(4).join(" - ") || "Mission";
  } else if (pieces.length >= 3 && /^\d{3,4}$/.test(pieces[0])) {
    time = pieces[0].padStart(4, "0");
    aircraft = pieces[1] || "";
    unit = pieces[2] || "";
    missionType = pieces.slice(3).join(" - ") || "Mission";
  } else if (/^\d{3,4}$/.test(raw)) {
    time = raw.padStart(4, "0");
  } else if (/^\d{1,2}$/i.test(raw)) {
    time = parsedTime != null ? timeFloatToHHMM(parsedTime) : raw.padStart(2, "0");
  } else {
    const t = raw.match(/(^|\D)(\d{3,4})(\D|$)/);
    if (t) time = t[2].padStart(4, "0");
  }

  const folderTitle = folderTime?.[2]?.trim() || "";
  const title = unit && aircraft ? `${unit} · ${aircraft}${missionType ? ` · ${missionType}` : ""}` : (folderTitle || raw);
  return { operation, time: time || "----", aircraft, unit, missionType, title, folderTitle };
}

function briefingMapForFiles(files = []) {
  const map = new Map();
  for (const file of files.filter((f) => /\.briefing$/i.test(f) && !isIgnoredBriefing(f))) {
    const key = stripLangSuffix(fileBase(file)).toLowerCase();
    if (!map.has(key)) map.set(key, file);
  }
  return map;
}

function selectMissionFiles(files = [], folderName = "") {
  let misFiles = files.filter((f) => /\.mis$/i.test(f)).sort((a, b) => path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true }));
  const nonFragments = misFiles.filter((f) => !isMissionFragmentFile(f));
  if (nonFragments.length) misFiles = nonFragments;
  if (!misFiles.length) return [];
  const folderTime = String(folderName).match(/^(\d{3,4})/i)?.[1];
  const common = misFiles.find((f) => fileBase(f).toLowerCase() === String(folderTime || "").toLowerCase()) || misFiles.find((f) => fileBase(f).toLowerCase() === folderName.toLowerCase());
  if (common) return [common];
  return misFiles;
}

function collectSlidesForBriefing(sections, missionDir, date, time, baseName) {
  const slides = [];
  for (const section of sections) {
    for (const slide of section.slides || []) {
      if (!slide.filename || !/\.(jpe?g|png|webp)$/i.test(slide.filename)) continue;
      const imagePath = path.join(missionDir, slide.filename);
      const assetName = `${date}_${time}_${baseName}_${path.basename(slide.filename)}`.replace(/[^\w.\-]+/g, "_");
      const src = assetUrlFor(imagePath, assetName);
      slides.push({ ...slide, src });
    }
  }
  return slides;
}

function buildMissionFromFile(misFile, files, missionDir, date, folderName = "", orderIndex = 0) {
  const base = fileBase(misFile);
  const briefings = briefingMapForFiles(files);
  const briefingFile = briefings.get(base.toLowerCase()) || briefings.get(stripLangSuffix(base).toLowerCase()) || firstFile(files.filter((f) => /\.briefing$/i.test(f) && !isIgnoredBriefing(f)), ".briefing");
  const csFile = files.find((f) => fileBase(f).toLowerCase() === base.toLowerCase() && /\.cs$/i.test(f)) || firstFile(files, ".cs");
  const briefingText = briefingFile ? readTextMaybe(briefingFile) : "";
  const sections = extractBriefingSections(briefingText);
  const parsedMis = parseMis(readTextMaybe(misFile));
  const parsedName = parseMissionName(base, folderName, parsedMis.time);
  const briefing = cleanBriefingText(briefingText);
  const briefingDateTime = parseBriefingDateTime(briefingText || briefing, "", "");
  const fileTime = parsedName.time && parsedName.time !== "----" ? parsedName.time : "";
  const misTime = timeFloatToHHMM(parsedMis.time);
  const time = briefingDateTime.time || fileTime || misTime || String(orderIndex + 1).padStart(4, "0");
  const missionDate = briefingDateTime.date || (parsedMis.dayOffset !== null ? addDaysIso(date, parsedMis.dayOffset) : date);
  const slides = collectSlidesForBriefing(sections, missionDir, date, time, base);

  if (!slides.length) {
    const image = files.find((f) => /\.(jpe?g|png|webp)$/i.test(f) && new RegExp(base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(path.basename(f)));
    if (image) {
      const assetName = `${date}_${time}_${path.basename(image)}`.replace(/[^\w.\-]+/g, "_");
      const src = assetUrlFor(image, assetName);
      slides.push({ filename: path.basename(image), title: parsedName.title, caption: "", section: "Info", sectionName: "Info", src });
    }
  }

  const displayTitle = deriveMissionDisplayTitle(parsedName, base, briefing, slides);
  const playable = playableFromSections(sections, parsedMis.airGroups);
  const playerGroup = parsedMis.playerPrefix ? parsedMis.airGroups.find((g) => g.id === parsedMis.player || g.id.startsWith(parsedMis.playerPrefix)) : null;
  if (!playable.length && playerGroup) {
    playable.push({ side: playerGroup.side, unit: playerGroup.unit || playerGroup.briefing || playerGroup.id, id: playerGroup.unit || playerGroup.briefing || playerGroup.id, airGroupId: playerGroup.id, aircraft: playerGroup.aircraft, role: parsedName.missionType || inferMissionType(parsedName.title, briefing), description: briefing });
  }
  if (!playable.length && parsedName.unit) {
    const side = inferAirSide(`${parsedName.unit} ${parsedName.aircraft}`);
    playable.push({ side, unit: parsedName.unit, id: parsedName.unit, aircraft: friendlyAircraftName(parsedName.aircraft), role: parsedName.missionType || inferMissionType(parsedName.title, briefing), description: briefing });
  }
  if (!playable.length) {
    playable.push(...playableFromBriefingFallback(briefing, slides, parsedMis.airGroups, parsedName.missionType || inferMissionType(displayTitle, briefing)));
  }

  return {
    date: missionDate,
    time,
    title: displayTitle,
    chapterTitle: parsedName.folderTitle || folderName,
    type: parsedName.missionType || inferMissionType(displayTitle, briefing),
    briefing,
    weather: (briefing.match(/(?:Weather|Met report|Regional Weather):?\s*([\s\S]{0,600})/i)?.[0] || "").trim(),
    playable,
    routes: parsedMis.airGroups,
    slides,
    images: slides,
    sourceFiles: [briefingFile, misFile, csFile].filter(Boolean),
  };
}

function scanMissionDirectoryAsMissions(missionDir, date, orderOffset = 0) {
  const files = listFiles(missionDir);
  return selectMissionFiles(files, path.basename(missionDir)).map((misFile, index) => buildMissionFromFile(misFile, files, missionDir, date, path.basename(missionDir), orderOffset + index));
}

function scanDirectFilesAsDay(dir, date, title) {
  const files = listFiles(dir);
  const missions = selectMissionFiles(files, path.basename(dir)).map((misFile, index) => buildMissionFromFile(misFile, files, dir, date, path.basename(dir), index));
  return { date, title, summary: missions[0]?.briefing?.slice(0, 700) || "", weather: missions[0]?.weather || "", missions: missions.sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title)) };
}

function scanDirectFilesAsDays(dir, fallbackDate, title) {
  const files = listFiles(dir);
  const missions = selectMissionFiles(files, path.basename(dir)).map((misFile, index) => buildMissionFromFile(misFile, files, dir, fallbackDate, path.basename(dir), index));
  if (!missions.length) return [{ date: fallbackDate, title, summary: "", weather: "", missions: [] }];
  const groups = new Map();
  missions.forEach((mission, index) => {
    const date = mission.date || addDaysIso(fallbackDate, index);
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date).push(mission);
  });
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, dayMissions], index) => ({
    date,
    title: index === 0 ? title : `${title} — ${date}`,
    summary: dayMissions[0]?.briefing?.slice(0, 700) || "",
    weather: dayMissions[0]?.weather || "",
    missions: dayMissions.sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title))
  }));
}

function scanDatedCampaign(campaignRoot, title) {
  const days = [];
  const dayDirs = listDirs(campaignRoot).filter((dir) => /^\d{4}-\d{2}-\d{2}\s*-/.test(path.basename(dir)));
  for (const dayDir of dayDirs) {
    const dayName = path.basename(dayDir);
    const dayMatch = dayName.match(/^(\d{4}-\d{2}-\d{2})\s*-\s*(.+)$/);
    if (!dayMatch) continue;
    const date = dayMatch[1]; const dayTitle = dayMatch[2].trim();
    const missions = [];
    for (const missionDir of listDirs(dayDir)) missions.push(...scanMissionDirectoryAsMissions(missionDir, date, missions.length));
    const direct = scanDirectFilesAsDay(dayDir, date, dayTitle).missions;
    if (!missions.length && direct.length) missions.push(...direct);
    days.push({ date, title: dayTitle, summary: missions[0]?.briefing?.slice(0, 700) || "", weather: missions[0]?.weather || "", missions: missions.sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title)) });
  }
  return { title, days };
}

function selectFidelityRoot(campaignRoot) {
  const variants = listDirs(campaignRoot).filter((dir) => /^\d+\s*-\s*(high|medium|low|vr|full)/i.test(path.basename(dir)));
  if (!variants.length) return { root: campaignRoot, profile: "" };
  const order = [/high/i, /medium/i, /low/i, /vr/i, /full/i];
  variants.sort((a, b) => {
    const ai = order.findIndex((re) => re.test(path.basename(a))); const bi = order.findIndex((re) => re.test(path.basename(b)));
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true });
  });
  return { root: variants[0], profile: path.basename(variants[0]), variants: variants.map((v) => path.basename(v)) };
}

function scanTimeFolderCampaign(campaignRoot, title, date) {
  const source = selectFidelityRoot(campaignRoot);
  const timeRoot = source.root;
  const missions = [];
  for (const missionDir of listDirs(timeRoot)) {
    if (!/^\d{3,4}\s*-/.test(path.basename(missionDir))) continue;
    missions.push(...scanMissionDirectoryAsMissions(missionDir, date, missions.length));
  }
  return { title, profile: source.profile, variants: source.variants || [], days: [{ date, title, summary: missions[0]?.briefing?.slice(0, 700) || "", weather: missions[0]?.weather || "", missions: missions.sort((a, b) => a.time.localeCompare(b.time) || a.chapterTitle?.localeCompare(b.chapterTitle || "") || a.title.localeCompare(b.title)) }] };
}

function scanCampaignCollection(parentRoot, title) {
  const iniPath = path.join(parentRoot, "campaigns.ini");
  const ini = fs.existsSync(iniPath) ? parseCampaignsIni(iniPath) : new Map();
  const days = [];
  let index = 0;
  for (const dir of listDirs(parentRoot)) {
    const files = listFiles(dir);
    const hasMis = files.some((f) => /\.mis$/i.test(f));
    if (!hasMis) continue;
    const folder = path.basename(dir);
    const meta = ini.get(folder) || Array.from(ini.values()).find((v) => v.folder === folder) || {};
    const date = addDaysIso("1940-01-01", index++);
    days.push(scanDirectFilesAsDay(dir, date, meta.title || cleanCampaignTitle(folder)));
  }
  return { title, days };
}

function inferMapPreset(campaignRoot, campaign = {}) {
  const text = `${campaignRoot || ""} ${campaign?.title || ""} ${campaign?.profile || ""}`.toLowerCase().replace(/\\/g, "/");
  if (/parts\/tobruk\/mission\/campaign|\/tobruk\/|\btobruk\b|desert wings|north africa|libya|cyrenaica|el alamein|gazala|bir hacheim|raaf|rats/.test(text)) return "tobruk";
  if (/parts\/bob\/mission\/campaign|battle of britain|kanalkampf|\bbob\b|channel|jubilee|dieppe/.test(text)) return "dover";
  return "dover";
}

function mapPresetInfo(preset) {
  if (preset === "tobruk") {
    return finaliseMapInfo({
      id: "tobruk",
      image: "/tobruk_map.jpg",
      baseWidth: 2048,
      baseHeight: 2031,
      width: 2048,
      height: 2031,
      locked: true,
      note: "Tobruk theatre map selected from campaign path/title.",
      calibrationPoints: [
        { name: "Tobruk Harbour", pixelX: 850, pixelY: 1050, side: "All" },
        { name: "El Adem No.1", pixelX: 795, pixelY: 1182, side: "RAF" },
        { name: "El Adem No.2", pixelX: 812, pixelY: 1197, side: "RAF" },
        { name: "Acroma", pixelX: 698, pixelY: 1073, side: "All" },
        { name: "Sidi Rezegh", pixelX: 987, pixelY: 1252, side: "All" },
        { name: "Gambut", pixelX: 1160, pixelY: 1200, side: "RAF" }
      ],
      gameCalibration: [
        { name: "Tobruk Harbour", gameX: 160194.86, gameY: 186185.11, pixelX: 850, pixelY: 1050 },
        { name: "Acroma", gameX: 108383.93, gameY: 193016.24, pixelX: 698, pixelY: 1073 },
        { name: "Sidi Rezegh", gameX: 278019.94, gameY: 116206.41, pixelX: 987, pixelY: 1252 },
        { name: "Gambut", gameX: 361268.51, gameY: 95532.09, pixelX: 1160, pixelY: 1200 }
      ]
    });
  }
  return finaliseMapInfo({
    id: "dover",
    image: "/strait_of_dover_map.jpg",
    baseWidth: 2048,
    baseHeight: 1798,
    width: 2048,
    height: 1798,
    locked: true,
    note: "Dover/Channel theatre map selected from campaign path/title.",
    calibrationPoints: [
      { name: "Hawkinge", pixelX: 1260, pixelY: 540, side: "RAF" },
      { name: "St. Inglevert", pixelX: 1465, pixelY: 675, side: "Luftwaffe" },
      { name: "Pihen-lès-Guînes", pixelX: 1470, pixelY: 665, side: "Luftwaffe" },
      { name: "Folkestone", pixelX: 1264, pixelY: 564, side: "RAF" },
      { name: "Biggin Hill", pixelX: 860, pixelY: 420, side: "RAF" }
    ],
    gameCalibration: [
      { name: "Hawkinge", gameX: 234931.02, gameY: 232454.51, pixelX: 1260, pixelY: 540 },
      { name: "Pihen-lès-Guînes", gameX: 277141.95, gameY: 206459.2, pixelX: 1470, pixelY: 665 }
    ]
  });
}

function chooseMapImage(campaignRoot, campaign) {
  const configured = configuredMapImageUrl();
  if (configured) {
    const isTobruk = /tobruk/i.test(configured);
    return finaliseMapInfo({ id: isTobruk ? "tobruk" : "custom", image: configured, width: isTobruk ? 2048 : 2048, height: isTobruk ? 2031 : 1798, locked: true });
  }

  const preset = inferMapPreset(campaignRoot, campaign);
  if (preset === "tobruk") return mapPresetInfo("tobruk");
  if (/battle\s*of\s*britain|kanalkampf|\bbob\b|parts[\\/]bob[\\/]mission[\\/]campaign/i.test(`${campaignRoot} ${campaign?.title || ""}`)) {
    return mapPresetInfo("dover");
  }

  if (!config.autoSelectMap) {
    return mapPresetInfo(preset);
  }

  const candidates = [];
  function walk(dir, depth = 0) {
    if (depth > 3) return;
    for (const file of listFiles(dir)) {
      if (/\.(jpe?g|png|webp)$/i.test(file) && /(map|aerial|battlefield|annotated|dieppe|tobruk)/i.test(path.basename(file))) candidates.push(file);
    }
    for (const sub of listDirs(dir).slice(0, 40)) walk(sub, depth + 1);
  }
  try { walk(campaignRoot); } catch {}
  const preferred = candidates.find((f) => /dieppe.*(aerial|battlefield|annotated)|aerial.*dieppe|battlefield.*annotated/i.test(path.basename(f))) || candidates.find((f) => /annotated/i.test(path.basename(f))) || candidates[0];
  if (!preferred) return mapPresetInfo("dover");
  const assetName = `map_${path.basename(preferred)}`.replace(/[^\w.\-]+/g, "_");
  return finaliseMapInfo({ image: assetUrlFor(preferred, assetName), width: 2048, height: 1798, note: "Auto-selected from campaign image assets. Routes may be schematic until this map is calibrated." });
}


function campaignMetaFromParent(campaignRoot) {
  const parent = path.dirname(campaignRoot);
  const iniPath = path.join(parent, "campaigns.ini");
  if (!fs.existsSync(iniPath)) return {};
  const ini = parseCampaignsIni(iniPath);
  const folder = path.basename(campaignRoot);
  return ini.get(folder) || Array.from(ini.values()).find((v) => v.folder === folder) || {};
}

function scanCampaignFolder(campaignRoot) {
  if (!campaignRoot || !fs.existsSync(campaignRoot)) throw new Error(`Campaign folder not found: ${campaignRoot}`);
  const rootBase = path.basename(campaignRoot);
  const campaignMeta = campaignMetaFromParent(campaignRoot);
  const title = config.campaignTitle || campaignMeta.title || cleanCampaignTitle(rootBase.replace(/^\d{4}-\d{2}-\d{2}\s*-\s*/, ""));
  const defaultDate = inferDefaultDate(rootBase);
  const childDirs = listDirs(campaignRoot);
  const directFiles = listFiles(campaignRoot);
  let result;

  if (childDirs.some((dir) => /^\d{4}-\d{2}-\d{2}\s*-/.test(path.basename(dir)))) {
    result = scanDatedCampaign(campaignRoot, title);
  } else if (childDirs.some((dir) => /^\d+\s*-\s*(high|medium|low|vr|full)/i.test(path.basename(dir)))) {
    result = scanTimeFolderCampaign(campaignRoot, title, defaultDate);
  } else if (childDirs.some((dir) => /^\d{3,4}\s*-/.test(path.basename(dir)))) {
    result = scanTimeFolderCampaign(campaignRoot, title, defaultDate);
  } else if (directFiles.some((f) => /\.mis$/i.test(f))) {
    result = { title, days: scanDirectFilesAsDays(campaignRoot, defaultDate, title) };
  } else if (fs.existsSync(path.join(campaignRoot, "campaigns.ini")) || childDirs.some((dir) => listFiles(dir).some((f) => /\.mis$/i.test(f)))) {
    result = scanCampaignCollection(campaignRoot, title);
  } else {
    throw new Error(`No supported campaign structure found in ${campaignRoot}`);
  }

  const days = result.days || [];
  const period = days.length ? `${days[0].date} to ${days[days.length - 1].date}` : "";
  const campaign = {
    title: result.title || title,
    profile: result.profile || "",
    variants: result.variants || [],
    period,
    generatedAt: new Date().toISOString(),
    sourceRoot: campaignRoot,
    map: chooseMapImage(campaignRoot, result),
    days,
  };

  for (const target of [path.join(root, "public", "campaign-data.json"), path.join(root, "dist", "campaign-data.json")]) {
    try { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(campaign, null, 2), "utf8"); } catch (e) { console.warn(`Could not write ${target}:`, e.message); }
  }
  return campaign;
}

function resolveMissionPath(sourcePath) {
  if (!sourcePath) return "";
  if (path.isAbsolute(sourcePath)) return sourcePath;
  if (config.campaignRoot) return path.join(config.campaignRoot, sourcePath);
  return sourcePath;
}

function writeCommandFile(payload) {
  const sourcePath = payload?.mission?.sourcePath || "";
  const missionPath = resolveMissionPath(sourcePath);
  if (!missionPath) throw new Error("No .mis file was identified for this sortie.");

  fs.mkdirSync(config.clodDocumentsDir, { recursive: true });
  const cmdPath = path.join(config.clodDocumentsDir, "selected-mission.cmd");

  const lines = [
    "battle stop",
    `missLoad "${missionPath}"`,
    "battle start"
  ];

  fs.writeFileSync(cmdPath, lines.join("\r\n") + "\r\n", "utf8");

  if (config.autoWriteSrcu) {
    const srcuPath = path.join(config.clodDocumentsDir, "srcu");
    if (fs.existsSync(srcuPath)) fs.copyFileSync(srcuPath, `${srcuPath}.campaign-board-backup`);
    fs.writeFileSync(srcuPath, "f selected-mission.cmd\r\n", "utf8");
  }

  return { cmdPath, missionPath };
}

function launchCliffsServer() {
  const exe = path.join(config.clodInstallDir, "Launcher64.exe");
  if (!fs.existsSync(exe)) throw new Error(`Launcher64.exe not found at ${exe}`);

  const args = ["-server"];
  if (config.serverPassword) args.push("-pwd", config.serverPassword);

  const child = spawn(exe, args, { cwd: config.clodInstallDir, detached: true, stdio: "ignore" });
  child.unref();
  return { exe, args };
}

function latestPilotEvent() {
  ensurePilotLogFile();
  if (!fs.existsSync(config.pilotLogPath)) return null;
  const lines = fs.readFileSync(config.pilotLogPath, "utf8").split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try { return JSON.parse(lines[i]); } catch {}
  }
  return null;
}

function serveStatic(req, res) {
  const dist = path.join(root, "dist");
  let urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.normalize(path.join(dist, urlPath));

  if (!filePath.startsWith(dist)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  const target = fs.existsSync(filePath) ? filePath : path.join(dist, "index.html");
  if (!fs.existsSync(target)) {
    res.writeHead(404); res.end("Build the site first with npm run build"); return;
  }

  const ext = path.extname(target).toLowerCase();
  const type = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
  }[ext] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });
  const url = new URL(req.url, `http://127.0.0.1:${port}`);

  try {
    if (url.pathname === "/api/asset") {
      const requested = url.searchParams.get("path") || "";
      const file = path.resolve(requested);
      const allowedRoots = [config.campaignRoot, config.clodInstallDir, config.clodDocumentsDir, path.join(root, "public")]
        .filter(Boolean)
        .map((allowedPath) => path.resolve(allowedPath));
      const allowed = allowedRoots.some((allowedRoot) => file === allowedRoot || file.startsWith(allowedRoot + path.sep));
      if (!allowed || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404); res.end("Asset not found"); return;
      }
      const ext = path.extname(file).toLowerCase();
      const type = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" }[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type, "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" });
      fs.createReadStream(file).pipe(res);
      return;
    }

    if (url.pathname === "/api/browse-folder" && req.method === "POST") {
      const body = await readBody(req);
      return sendJson(res, 200, { ok: true, path: browseFolderDialog(body) });
    }

    if (url.pathname === "/api/browse-file" && req.method === "POST") {
      const body = await readBody(req);
      return sendJson(res, 200, { ok: true, path: browseFileDialog(body) });
    }

    if (url.pathname === "/api/status") {
      return sendJson(res, 200, { ok: true, name: "Cliffs Campaign Companion Bridge", config });
    }

    if (url.pathname === "/api/config" && req.method === "GET") {
      return sendJson(res, 200, { ok: true, config });
    }

    if (url.pathname === "/api/config" && req.method === "POST") {
      const body = await readBody(req);
      return sendJson(res, 200, { ok: true, config: saveConfig({ ...config, ...body }) });
    }

    if (url.pathname === "/api/scan-campaign" && req.method === "POST") {
      const body = await readBody(req);
      const nextConfig = saveConfig({ ...config, ...body });
      const campaign = scanCampaignFolder(nextConfig.campaignRoot);
      return sendJson(res, 200, {
        ok: true,
        config: nextConfig,
        campaign,
        message: `Scanned ${campaign.days.length} days and ${campaign.days.reduce((sum, d) => sum + d.missions.length, 0)} missions from ${campaign.title}.`
      });
    }

    if (url.pathname === "/api/launch-mission" && req.method === "POST") {
      const payload = await readBody(req);
      const command = writeCommandFile(payload);
      let launched = null;
      try {
        launched = launchCliffsServer();
      } catch (error) {
        return sendJson(res, 200, {
          ok: true,
          launched: false,
          command,
          message: `Command file written, but Launcher64.exe could not be started: ${error.message}. Start Cliffs server mode manually and type: f selected-mission.cmd`
        });
      }

      return sendJson(res, 200, {
        ok: true,
        launched: true,
        command,
        launchedProcess: launched,
        message: "Command file written and Launcher64.exe -server started. If the mission does not auto-load, type: f selected-mission.cmd"
      });
    }

    if (url.pathname === "/api/latest-sortie") {
      return sendJson(res, 200, { ok: true, event: latestPilotEvent() });
    }

    return serveStatic(req, res);
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: error.message });
  }
});

export function start(listenPort = port) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(listenPort, "127.0.0.1", () => {
      console.log(`Cliffs companion bridge running at http://127.0.0.1:${listenPort}`);
      console.log(`Config: ${configPath}`);
      resolve(listenPort);
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  start().catch((err) => { console.error("Server failed to start:", err.message); process.exit(1); });
}
