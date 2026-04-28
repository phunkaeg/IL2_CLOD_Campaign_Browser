import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function IconBase({ className = "", children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const Clock = (props) => <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></IconBase>;
const CloudSun = (props) => <IconBase {...props}><circle cx="8" cy="8" r="3" /><path d="M8 1.8v1.4M2.2 8h1.4M12.4 3.6l-1 1M3.6 3.6l1 1M17.5 20H8a5 5 0 1 1 1-9.9A6.5 6.5 0 0 1 21 13.5A4.5 4.5 0 0 1 17.5 20Z" /></IconBase>;
const SunIcon = (props) => <IconBase {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></IconBase>;
const MoonIcon = (props) => <IconBase {...props}><path d="M21 13.1A8.5 8.5 0 0 1 10.9 3a7 7 0 1 0 10.1 10.1Z" /></IconBase>;
const CloudIcon = (props) => <IconBase {...props}><path d="M17.5 19H8a5 5 0 1 1 1-9.9A6.5 6.5 0 0 1 21 12.5A4.5 4.5 0 0 1 17.5 19Z" /></IconBase>;
const RainIcon = (props) => <IconBase {...props}><path d="M17.5 16H8a5 5 0 1 1 1-9.9A6.5 6.5 0 0 1 21 9.5A4.5 4.5 0 0 1 17.5 16Z" /><path d="M8 19v2M12 19v2M16 19v2" /></IconBase>;
const StormIcon = (props) => <IconBase {...props}><path d="M17.5 16H8a5 5 0 1 1 1-9.9A6.5 6.5 0 0 1 21 9.5A4.5 4.5 0 0 1 17.5 16Z" /><path d="m13 18-2 4 5-5h-4l2-4" /></IconBase>;
const Plane = (props) => <IconBase {...props}><path d="M12 2.8c.9 0 1.45.85 1.45 2.25v5.05l6.7 2.55c.55.2.85.6.85 1.2v1.25l-7.55-.95v3.2l2.55 1.55v1.25L12 18.75l-4 1.4V18.9l2.55-1.55v-3.2L3 15.1v-1.25c0-.6.3-1 .85-1.2l6.7-2.55V5.05C10.55 3.65 11.1 2.8 12 2.8Z" /><path d="M9.3 5.2h5.4M11.15 4.05 12 2.8l.85 1.25" /></IconBase>;
const Search = (props) => <IconBase {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></IconBase>;
const Crosshair = (props) => <IconBase {...props}><circle cx="12" cy="12" r="8" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M12 9v6M9 12h6" /></IconBase>;
const Radio = (props) => <IconBase {...props}><rect x="4" y="8" width="16" height="11" rx="2" /><path d="m8 8 8-5M8 13h.01M12 13h4M8 16h8" /></IconBase>;
const Shield = (props) => <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></IconBase>;
const Bomb = (props) => <IconBase {...props}><circle cx="11" cy="13" r="7" /><path d="M16 8l3-3M19 2v3h3M14 6l2 2" /></IconBase>;
const FileText = (props) => <IconBase {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></IconBase>;
const Wind = (props) => <IconBase {...props}><path d="M3 8h12a3 3 0 1 0-3-3M3 13h16a3 3 0 1 1-3 3M3 18h7" /></IconBase>;
const Star = (props) => <IconBase {...props}><path d="m12 2 2.9 6 6.6.9-4.8 4.7 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5-4.8-4.7 6.6-.9Z" /></IconBase>;
const ChevronLeft = (props) => <IconBase {...props}><path d="m15 18-6-6 6-6" /></IconBase>;
const ChevronRight = (props) => <IconBase {...props}><path d="m9 18 6-6-6-6" /></IconBase>;
const MapIcon = (props) => <IconBase {...props}><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></IconBase>;
const ImageIcon = (props) => <IconBase {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></IconBase>;
const ListIcon = (props) => <IconBase {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></IconBase>;
const Expand = (props) => <IconBase {...props}><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5M3 3l7 7M21 3l-7 7M21 21l-7-7M3 21l7-7" /></IconBase>;

const PlayIcon = (props) => <IconBase {...props}><path d="M8 5v14l11-7Z" /></IconBase>;
const BookOpen = (props) => <IconBase {...props}><path d="M2 5.5A3.5 3.5 0 0 1 5.5 2H12v18H5.5A3.5 3.5 0 0 0 2 23V5.5Z" /><path d="M22 5.5A3.5 3.5 0 0 0 18.5 2H12v18h6.5A3.5 3.5 0 0 1 22 23V5.5Z" /></IconBase>;
const SaveIcon = (props) => <IconBase {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></IconBase>;
const ClipboardIcon = (props) => <IconBase {...props}><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4.5A3 3 0 0 1 12 2a3 3 0 0 1 3 2.5V6H9V4.5Z" /><path d="M8 11h8M8 15h8" /></IconBase>;
const WrenchIcon = (props) => <IconBase {...props}><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.8-2.8Z" /></IconBase>;
const SettingsIcon = (props) => <IconBase {...props}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .15 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.15-1 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06A2 2 0 1 1 7.08 3.2l.06.06A1.7 1.7 0 0 0 9 3.6a1.7 1.7 0 0 0 1-.15A1.7 1.7 0 0 0 11 1.89V2a2 2 0 1 1 4 0v-.11a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .35.1.69.29 1a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" /></IconBase>;
const FolderIcon = (props) => <IconBase {...props}><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></IconBase>;

const fallbackCampaign = {
  title: "Battle of Britain",
  period: "1940-07-04 to 1940-07-22",
  days: [
    {
      date: "1940-07-04",
      title: "Kanalkampf Begins",
      summary: "Campaign orders will appear here once the operations log is loaded.",
      weather: "Campaign weather will appear here.",
      missions: [
        { time: "1400", title: "First Convoy Attack", type: "Convoy Battle", briefing: "Mission briefing will appear here.", playable: [], slides: [], images: [], routes: [] },
      ],
    },
  ],
  map: { image: "/strait_of_dover_map.jpg", width: 2048, height: 1798 },
};

const defaultCalibration = [
  { name: "Hawkinge", pixelX: 1260, pixelY: 540, side: "RAF" },
  { name: "St. Inglevert", pixelX: 1465, pixelY: 675, side: "Luftwaffe" },
  { name: "Pihen-lès-Guînes", pixelX: 1470, pixelY: 665, side: "Luftwaffe" },
  { name: "Folkestone", pixelX: 1264, pixelY: 564, side: "RAF" },
  { name: "Biggin Hill", pixelX: 860, pixelY: 420, side: "RAF" },
  { name: "Manston", pixelX: 3230, pixelY: 410, side: "RAF", note: "Supplied coordinate is outside the 2048px map crop." },
];

const gameCalibration = {
  hawkinge: { gameX: 234931.02, gameY: 232454.51, pixelX: 1260, pixelY: 540 },
  pihen: { gameX: 277141.95, gameY: 206459.2, pixelX: 1470, pixelY: 665 },
};

const sideTone = {
  RAF: "bg-sky-400/10 text-sky-200 border-sky-300/35",
  Luftwaffe: "bg-zinc-300/10 text-zinc-100 border-zinc-200/45",
  "Regia Aeronautica": "bg-emerald-400/10 text-emerald-100 border-emerald-300/40",
  Unknown: "bg-stone-400/10 text-stone-200 border-stone-300/20",
};

const sideSelectedTone = {
  RAF: "border-sky-300/65 bg-sky-300/18 text-sky-100 shadow-sky-950/30",
  Luftwaffe: "border-zinc-200/70 bg-zinc-200/14 text-zinc-50 shadow-zinc-950/30",
  "Regia Aeronautica": "border-emerald-300/70 bg-emerald-300/16 text-emerald-50 shadow-emerald-950/30",
  Unknown: "border-amber-300/50 bg-amber-300/12 text-amber-100",
};

const sideLine = {
  RAF: "#38bdf8",
  Luftwaffe: "#f97316",
  "Regia Aeronautica": "#22c55e",
  Unknown: "#fbbf24",
};
const sideTheme = {
  All: {
    label: "Operations Board",
    badge: "Fighter Command operations board",
    emblem: null,
    emblemAlt: "",
    headerGlow: "bg-[radial-gradient(circle_at_15%_0%,rgba(120,113,108,0.20),transparent_28%),radial-gradient(circle_at_88%_0%,rgba(14,165,233,0.14),transparent_32%)]",
    pageGlow: "bg-[radial-gradient(circle_at_top_left,rgba(120,113,108,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_34px)]",
    timelineSelected: "border-amber-300/50 bg-amber-300/12 shadow-amber-950/30",
    accentText: "text-amber-100",
    focusBorder: "focus:border-amber-200/40",
  },
  RAF: {
    label: "RAF Sector Board",
    badge: "RAF Fighter Command operations board",
    emblem: "/Roundel.png",
    emblemAlt: "RAF roundel",
    headerGlow: "bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_86%_0%,rgba(56,189,248,0.16),transparent_34%)]",
    pageGlow: "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.15),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_34px)]",
    timelineSelected: "border-sky-300/50 bg-sky-300/12 shadow-sky-950/30",
    accentText: "text-sky-100",
    focusBorder: "focus:border-sky-200/40",
  },
  Luftwaffe: {
    label: "Luftwaffe Gruppenkarte",
    badge: "Luftwaffe operations board",
    emblem: "/IronCross.png",
    emblemAlt: "Luftwaffe Balkenkreuz",
    headerGlow: "bg-[radial-gradient(circle_at_18%_0%,rgba(148,163,184,0.20),transparent_30%),radial-gradient(circle_at_86%_0%,rgba(59,130,246,0.13),transparent_34%)]",
    pageGlow: "bg-[radial-gradient(circle_at_top_left,rgba(100,116,139,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_34px)]",
    timelineSelected: "border-slate-200/55 bg-slate-300/12 shadow-slate-950/30",
    accentText: "text-slate-100",
    focusBorder: "focus:border-slate-200/45",
  },
  "Regia Aeronautica": {
    label: "Regia Aeronautica operations board",
    badge: "Regia Aeronautica operations board",
    emblem: "/RegiaAeronautica.png",
    emblemAlt: "Regia Aeronautica roundel",
    headerGlow: "bg-[radial-gradient(circle_at_18%_0%,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_86%_0%,rgba(248,250,252,0.12),transparent_34%)]",
    pageGlow: "bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(245,245,244,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_34px)]",
    timelineSelected: "border-emerald-300/55 bg-emerald-300/12 shadow-emerald-950/30",
    accentText: "text-emerald-100",
    focusBorder: "focus:border-emerald-200/45",
  },
};

function themeForSide(side = "All") {
  return sideTheme[side] || sideTheme.All;
}


const tabDefs = [
  { id: "overview", label: "Overview", icon: Star },
  { id: "map", label: "Map", icon: MapIcon },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "briefing", label: "Briefing", icon: FileText },
  { id: "roles", label: "Roles", icon: Plane },
  { id: "launch", label: "Launch", icon: PlayIcon },
  { id: "log", label: "Pilot Log", icon: BookOpen },
];

function cls(...classes) { return classes.filter(Boolean).join(" "); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function cleanText(value, fallback = "") { return typeof value === "string" && value.trim() ? value.trim() : fallback; }
function truncate(value, limit = 220) { const t = cleanText(value); return t.length > limit ? `${t.slice(0, limit).trim()}…` : t; }
function getDayNumber(date, startDate = "1940-07-04") {
  const start = new Date(`${startDate}T00:00:00Z`);
  const d = new Date(`${date}T00:00:00Z`);
  return Math.round((d - start) / 86400000) + 1;
}
function missionTypeIcon(type = "") {
  const lower = type.toLowerCase();
  if (lower.includes("convoy") || lower.includes("shipping") || lower.includes("harbour")) return Shield;
  if (lower.includes("attack") || lower.includes("raid") || lower.includes("bomber") || lower.includes("bomb")) return Bomb;
  if (lower.includes("recon")) return Radio;
  return Crosshair;
}
function useKeyedReset(key, setIndex) { useEffect(() => { setIndex(0); }, [key, setIndex]); }

function inferSide(entity = {}) {
  const text = [entity.id, entity.unit, entity.briefing, entity.airGroupId, entity.aircraft, entity.role, entity.side].filter(Boolean).join(" ");
  const compact = text.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  // Do not rely on word boundaries here: Cliffs airgroup ids use underscores, e.g. Tobruk_RA_150Gruppo_363Sq.
  if (/(^|_)ra(_|$)|(^|_)regia(_|$)|aeronautica|italian|italia|squadriglia|gruppo|cr_?42|g_?50|br_?20|cant|z_?1007|mc_?200|fiat|macchi/.test(compact)) return "Regia Aeronautica";
  if (/(^|_)lw(_|$)|luftwaffe|(^|_)(jg|kg|lg|stg|zg)\d*|staffel|gruppe|aufkl|erprob|bf_?\d|me_?\d|he_?\d|do_?\d|ju_?\d/.test(compact)) return "Luftwaffe";
  if (/(^|_)raf(_|$)|(^|_)raaf(_|$)|sqn|squadron|spitfire|hurricane|blenheim|defiant|beaufighter|gladiator|wellington|kittyhawk|tomahawk|dh82/.test(compact)) return "RAF";
  return entity.side || "Unknown";
}


function normaliseToken(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function sideMatches(entity, sideFilter) {
  return sideFilter === "All" || inferSide(entity) === sideFilter;
}

function roleLabel(role = {}) {
  return [role.unit || role.id || role.briefing || "Section", role.aircraft].filter(Boolean).join(" · ");
}

function roleSearchBlob(role = {}) {
  return [inferSide(role), role.side, role.id, role.unit, role.aircraft, role.role].filter(Boolean).join(" ").toLowerCase();
}

function routeSearchBlob(route = {}) {
  return [inferSide(route), route.side, route.id, route.airGroupId, route.briefing, route.aircraft, route.formation].filter(Boolean).join(" ").toLowerCase();
}

function missionCoreBlob(mission = {}) {
  return [mission.time, mission.title, mission.type, mission.location].filter(Boolean).join(" ").toLowerCase();
}

function groupKey(value = "") {
  return String(value).trim().toLowerCase();
}

function roleMatchesGroup(role = {}, groupFilter = "All") {
  if (groupFilter === "All") return true;
  const target = groupKey(groupFilter);
  return [role.unit, role.id].some((v) => groupKey(v) === target);
}

function routeMatchesGroup(route = {}, groupFilter = "All") {
  if (groupFilter === "All") return true;
  const target = groupKey(groupFilter);
  return [route.briefing, route.id, route.airGroupId].some((v) => groupKey(v) === target);
}

function extractGroups(days = [], sideFilter = "All") {
  const map = new Map();
  for (const day of days) {
    for (const mission of day.missions || []) {
      for (const role of mission.playable || []) {
        const side = inferSide(role);
        if (sideFilter !== "All" && side !== sideFilter) continue;
        const name = role.unit || role.id;
        if (!name) continue;
        const key = groupKey(name);
        if (!map.has(key)) map.set(key, { value: name, label: name, side });
      }
      for (const route of mission.routes || []) {
        const side = inferSide(route);
        if (sideFilter !== "All" && side !== sideFilter) continue;
        const name = route.briefing;
        if (!name) continue;
        const key = groupKey(name);
        if (!map.has(key)) map.set(key, { value: name, label: name, side });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}


function missionKindLabel(value = "") {
  const text = String(value).toLowerCase();
  if (/\bcircus\b/.test(text)) return "Circus";
  if (/\brodeo\b/.test(text)) return "Rodeo";
  if (/\brhubarb\b/.test(text)) return "Rhubarb";
  if (/\bramrod\b/.test(text)) return "Ramrod";
  if (/\bnoball\b|no-ball/.test(text)) return "Noball";
  if (/rescue|seenot|search/.test(text)) return "Search & Rescue";
  if (/recon|recce|aufkl|photo/.test(text)) return "Reconnaissance";
  if (/escort|cover|umbrella/.test(text)) return "Escort / Cover";
  if (/convoy|shipping|ship|e-boat|boat|barge|harbour|harbor|anchorage|minefield/.test(text)) return "Anti-shipping";
  if (/bomb|bomber|bombing|strike|attack|battery|factory|raid|suppression|jabo|ju-88|ju88|blenheim|boston|he-111|he111|do-17|do17|do-217|do217/.test(text)) return "Bomber / Strike";
  if (/fighter|intercept|scramble|patrol|sweep|dogfight|furball|cap/.test(text)) return "Fighter / Patrol";
  if (/training/.test(text)) return "Training";
  return "Other / Special";
}

function missionKindForMission(mission = {}) {
  const roleText = (mission.playable || []).map((role) => [role.role, role.aircraft, role.unit].filter(Boolean).join(" ")).join(" ");
  const routeText = (mission.routes || []).map((route) => [route.briefing, route.aircraft, route.formation].filter(Boolean).join(" ")).join(" ");
  return missionKindLabel([mission.type, mission.title, mission.chapterTitle, roleText, routeText].filter(Boolean).join(" "));
}

function missionMatchesKind(mission = {}, missionTypeFilter = "All") {
  if (missionTypeFilter === "All") return true;
  return missionKindForMission(mission) === missionTypeFilter;
}

function aircraftFamilyLabel(value = "") {
  const text = String(value).toLowerCase().replace(/[_-]+/g, " ");
  if (!text.trim()) return "Other aircraft";
  if (/spitfire/.test(text)) return "Spitfire";
  if (/hurricane/.test(text)) return "Hurricane";
  if (/blenheim/.test(text)) return "Blenheim";
  if (/boston/.test(text)) return "Boston";
  if (/typhoon/.test(text)) return "Typhoon";
  if (/beaufighter/.test(text)) return "Beaufighter";
  if (/defiant/.test(text)) return "Defiant";
  if (/bf\s*109|me\s*109|\b109\b/.test(text)) return "Bf 109";
  if (/bf\s*110|me\s*110|\b110\b/.test(text)) return "Bf 110";
  if (/fw\s*190|fw190|\b190\b/.test(text)) return "Fw 190";
  if (/ju\s*88|ju88/.test(text)) return "Ju 88";
  if (/ju\s*87|ju87|stuka/.test(text)) return "Ju 87 Stuka";
  if (/he\s*111|he111/.test(text)) return "He 111";
  if (/do\s*17|do17/.test(text)) return "Do 17";
  if (/do\s*217|do217/.test(text)) return "Do 217";
  if (/fiat|g\.?50/.test(text)) return "Fiat G.50";
  if (/cr\.?42/.test(text)) return "Fiat CR.42";
  if (/mc\.?200|macchi/.test(text)) return "Macchi C.200";
  return prettyAircraft(value).split(/\s+-\s+|\s+·\s+/)[0] || "Other aircraft";
}

function aircraftFilterKey(value = "", mode = "variant") {
  const label = mode === "family" ? aircraftFamilyLabel(value) : prettyAircraft(value || "Aircraft TBC");
  return `${mode}:${normaliseToken(label)}`;
}

function aircraftFilterMatches(value = "", aircraftFilter = "All") {
  if (aircraftFilter === "All") return true;
  const [mode] = aircraftFilter.split(":");
  if (mode === "family") return aircraftFilterKey(value, "family") === aircraftFilter;
  return aircraftFilterKey(value, "variant") === aircraftFilter;
}

function roleMatchesAircraft(role = {}, aircraftFilter = "All") {
  return aircraftFilterMatches(role.aircraft || "", aircraftFilter);
}

function routeMatchesAircraft(route = {}, aircraftFilter = "All") {
  return aircraftFilterMatches(route.aircraft || "", aircraftFilter);
}

function extractMissionKinds(days = [], sideFilter = "All", groupFilter = "All", aircraftFilter = "All") {
  const set = new Set();
  for (const day of days) {
    for (const mission of day.missions || []) {
      const roles = (mission.playable || []).map((r) => ({ ...r, side: inferSide(r) }));
      const routes = dedupeRoutes(mission.routes || []).map((r) => ({ ...r, side: inferSide(r) }));
      const hasRole = roles.some((role) => sideMatches(role, sideFilter) && roleMatchesGroup(role, groupFilter) && roleMatchesAircraft(role, aircraftFilter));
      const hasRoute = routes.some((route) => sideMatches(route, sideFilter) && routeMatchesGroup(route, groupFilter) && routeMatchesAircraft(route, aircraftFilter));
      if (hasRole || hasRoute || (sideFilter === "All" && groupFilter === "All" && aircraftFilter === "All")) set.add(missionKindForMission(mission));
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function extractAircraftOptions(days = [], sideFilter = "All", groupFilter = "All", missionTypeFilter = "All") {
  const families = new Map();
  function addAircraft(raw) {
    if (!raw) return;
    const family = aircraftFamilyLabel(raw);
    const familyKey = aircraftFilterKey(raw, "family");
    const variant = prettyAircraft(raw);
    const variantKey = aircraftFilterKey(raw, "variant");
    if (!families.has(familyKey)) families.set(familyKey, { family, familyKey, variants: new Map() });
    families.get(familyKey).variants.set(variantKey, variant);
  }
  for (const day of days) {
    for (const mission of day.missions || []) {
      if (!missionMatchesKind(mission, missionTypeFilter)) continue;
      for (const role of mission.playable || []) {
        const r = { ...role, side: inferSide(role) };
        if (sideMatches(r, sideFilter) && roleMatchesGroup(r, groupFilter)) addAircraft(r.aircraft);
      }
      for (const route of dedupeRoutes(mission.routes || [])) {
        const r = { ...route, side: inferSide(route) };
        if (sideMatches(r, sideFilter) && routeMatchesGroup(r, groupFilter)) addAircraft(r.aircraft);
      }
    }
  }
  return Array.from(families.values())
    .sort((a, b) => a.family.localeCompare(b.family, undefined, { numeric: true }))
    .map((group) => ({ ...group, variants: Array.from(group.variants.entries()).map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true })) }));
}

function roleCountForMission(mission = {}) {
  return (mission.playable?.length || 0) || (mission.routes?.length || 0);
}

function missionWithDisplayFilters(mission = {}, q = "", sideFilter = "All", groupFilter = "All", missionTypeFilter = "All", aircraftFilter = "All") {
  if (!missionMatchesKind(mission, missionTypeFilter)) return null;
  const roles = (mission.playable || []).map((r) => ({ ...r, side: inferSide(r) }));
  const routes = dedupeRoutes(mission.routes || []).map((r) => ({ ...r, side: inferSide(r) }));
  const query = q.trim().toLowerCase();
  const coreMatch = !query || missionCoreBlob(mission).includes(query);
  const baseRoles = roles.filter((role) => sideMatches(role, sideFilter) && roleMatchesGroup(role, groupFilter) && roleMatchesAircraft(role, aircraftFilter));
  const baseRoutes = routes.filter((route) => sideMatches(route, sideFilter) && routeMatchesGroup(route, groupFilter) && routeMatchesAircraft(route, aircraftFilter));
  const queryRoles = !query ? baseRoles : baseRoles.filter((role) => roleSearchBlob(role).includes(query));
  const queryRoutes = !query ? baseRoutes : baseRoutes.filter((route) => routeSearchBlob(route).includes(query));
  const displayRoles = coreMatch ? baseRoles : queryRoles;
  const displayRoutes = coreMatch ? baseRoutes : queryRoutes;
  const include = coreMatch ? (displayRoles.length || displayRoutes.length || (sideFilter === "All" && groupFilter === "All" && aircraftFilter === "All")) : (queryRoles.length || queryRoutes.length);
  return include ? { ...mission, type: mission.type || missionKindForMission(mission), playable: displayRoles, routes: displayRoutes, _allPlayable: roles, _allRoutes: routes } : null;
}

function timeOfDayLabel(time = "") {
  const hour = Number(String(time).slice(0, 2));
  if (!Number.isFinite(hour)) return "Time pending";
  if (hour < 5) return "Night sortie";
  if (hour < 7) return "First light";
  if (hour < 11) return "Morning patrol";
  if (hour < 14) return "Midday operations";
  if (hour < 17) return "Afternoon operations";
  if (hour < 20) return "Evening patrol";
  return "Night operations";
}

function weatherProfile(text = "", time = "") {
  const t = String(text).toLowerCase();
  if (/thunder|cumulonimbus|storm/.test(t)) return { label: "Thunderstorms", Icon: StormIcon, tone: "text-violet-100 bg-violet-300/10 ring-violet-200/20" };
  if (/rain|shower|drizzle|wet/.test(t)) return { label: "Rain showers", Icon: RainIcon, tone: "text-sky-100 bg-sky-300/10 ring-sky-200/20" };
  if (/overcast|cloudy|8 10ths|7-8|low cloud|large cumulus/.test(t)) return { label: "Overcast", Icon: CloudIcon, tone: "text-slate-100 bg-slate-300/10 ring-slate-200/20" };
  if (/partly|broken|scattered|cumulus/.test(t)) return { label: "Partly cloudy", Icon: CloudSun, tone: "text-sky-100 bg-sky-300/10 ring-sky-200/20" };
  const hour = Number(String(time).slice(0, 2));
  if (Number.isFinite(hour) && (hour < 6 || hour >= 20)) return { label: "Night / low light", Icon: MoonIcon, tone: "text-indigo-100 bg-indigo-300/10 ring-indigo-200/20" };
  return { label: "Clear", Icon: SunIcon, tone: "text-amber-100 bg-amber-300/10 ring-amber-200/20" };
}

function slideMatchesRole(slide = {}, role = {}) {
  if (!role) return false;
  const hay = [slide.section, slide.sectionName, slide.title, slide.filename].map(normaliseToken).filter(Boolean);
  const needles = [role.unit, role.id].map(normaliseToken).filter((v) => v.length >= 2);
  return needles.some((n) => hay.some((h) => h.includes(n) || n.includes(h)));
}

function slideLooksGeneral(slide = {}) {
  const text = [slide.section, slide.sectionName, slide.title].filter(Boolean).join(" ").toLowerCase();
  return !text || /^info\b/.test(text);
}

function slidesForSelection(slides = [], selectedRole = null, sideFilter = "All") {
  if (!slides.length) return [];
  if (selectedRole) {
    const direct = slides.filter((slide) => slideMatchesRole(slide, selectedRole));
    const general = slides.filter(slideLooksGeneral).slice(0, 1);
    if (direct.length) return [...general, ...direct].filter((slide, idx, arr) => arr.findIndex((s) => s.src === slide.src && s.title === slide.title) === idx);
  }
  if (sideFilter === "All") return slides;
  const sideTerms = sideFilter === "RAF"
    ? /\b(sqn|squadron|raf|spitfire|hurricane|blenheim|defiant)\b/i
    : sideFilter === "Regia Aeronautica"
      ? /\b(regia|aeronautica|italian|italy|cr\.?42|g\.?50|br\.?20|cant|z\.?1007|mc\.?200|macchi|fiat)\b/i
      : /\b(jg|kg|lg|stg|staffel|gruppe|luftwaffe|messerschmitt|heinkel|dornier|junkers|bf-|me-|he-|do-|ju-)\b/i;
  const filtered = slides.filter((slide) => slideLooksGeneral(slide) || sideTerms.test([slide.section, slide.sectionName, slide.title, slide.filename, slide.caption].filter(Boolean).join(" ")));
  return filtered.length ? filtered : slides;
}

function aircraftFamilyToken(value = "") {
  const t = normaliseToken(value);
  if (!t) return "";
  if (t.includes("spitfire")) return "spitfire";
  if (t.includes("hurricane")) return "hurricane";
  if (t.includes("bf109") || t.includes("me109") || t.includes("109")) return "109";
  if (t.includes("bf110") || t.includes("me110") || t.includes("110")) return "110";
  if (t.includes("do17") || t.includes("dornier")) return "do17";
  if (t.includes("he111") || t.includes("heinkel")) return "he111";
  if (t.includes("ju87") || t.includes("stuka")) return "ju87";
  if (t.includes("ju88")) return "ju88";
  if (t.includes("blenheim")) return "blenheim";
  return t.slice(0, 8);
}

function getRouteWaypoints(route = {}) {
  const raw = Array.isArray(route.waypoints) ? route.waypoints : [];
  return raw
    .map((wp) => ({
      ...wp,
      x: Number(wp.x ?? wp.X ?? wp.gameX ?? wp.GameX),
      y: Number(wp.y ?? wp.Y ?? wp.gameY ?? wp.GameY),
      altitude: Number(wp.altitude ?? wp.alt ?? wp.z ?? 0),
      speed: Number(wp.speed ?? wp.Speed ?? 0),
    }))
    .filter((wp) => Number.isFinite(wp.x) && Number.isFinite(wp.y));
}

function routeScoreForRole(route, role) {
  if (!route || !role) return -999;
  if (inferSide(route) !== inferSide(role)) return -999;

  const routeUnitBits = [route.briefing, route.id, route.airGroupId].map(normaliseToken).filter(Boolean);
  const roleUnitBits = [role.unit, role.id].map(normaliseToken).filter(Boolean);
  const routeAircraft = aircraftFamilyToken(route.aircraft);
  const roleAircraft = aircraftFamilyToken(role.aircraft);

  let score = 5;
  for (const rb of roleUnitBits) {
    for (const tb of routeUnitBits) {
      if (!rb || !tb) continue;
      if (rb === tb) score = Math.max(score, 100);
      else if (rb.length >= 3 && tb.length >= 3 && (rb.includes(tb) || tb.includes(rb))) score = Math.max(score, 85);
    }
  }
  if (routeAircraft && roleAircraft && routeAircraft === roleAircraft) score += 10;
  return score;
}

function roleMatchesRoute(route, role) {
  return routeScoreForRole(route, role) >= 80;
}

function routesForRole(routes = [], role) {
  const usable = (routes || []).filter((route) => getRouteWaypoints(route).length >= 2);
  if (!role) return usable.slice(0, 1);

  const scored = usable
    .map((route) => ({ route, score: routeScoreForRole(route, role) }))
    .filter((item) => item.score > -999)
    .sort((a, b) => b.score - a.score);

  const strong = scored.filter((item) => item.score >= 80).map((item) => item.route);
  if (strong.length) return strong.slice(0, 1);

  const sameSide = usable.filter((route) => inferSide(route) === inferSide(role));
  if (sameSide.length) return sameSide.slice(0, 1);

  return usable.slice(0, 1);
}

function dedupeRoutes(routes) {
  const seen = new Set();
  const out = [];
  for (const route of routes || []) {
    const sig = `${route.id}|${route.aircraft}|${route.briefing}|${getRouteWaypoints(route).map((w) => `${Math.round(w.x)}:${Math.round(w.y)}`).join(";")}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push(route);
  }
  return out;
}

function mergeCalibration(map = {}) {
  const isTobruk = /tobruk/i.test([map.id, map.name, map.image].filter(Boolean).join(" "));
  const merged = isTobruk ? [] : defaultCalibration.map((point) => ({ ...point }));
  for (const point of map.calibrationPoints || []) {
    if (!point?.name) continue;
    const index = merged.findIndex((p) => p.name.toLowerCase() === point.name.toLowerCase());
    if (index >= 0) merged[index] = { ...merged[index], ...point };
    else merged.push({ ...point });
  }
  return merged;
}

const mapScale = (() => {
  const a = gameCalibration.hawkinge;
  const b = gameCalibration.pihen;
  return {
    anchor: a,
    sx: (b.pixelX - a.pixelX) / (b.gameX - a.gameX),
    sy: (b.pixelY - a.pixelY) / (b.gameY - a.gameY),
  };
})();

function routeToMapPoint(wp) {
  const { anchor, sx, sy } = mapScale;
  return {
    x: anchor.pixelX + (wp.x - anchor.gameX) * sx,
    y: anchor.pixelY + (wp.y - anchor.gameY) * sy,
  };
}

function solve3x3(matrix, values) {
  const rows = matrix.map((row, index) => [...row, values[index]]);
  for (let col = 0; col < 3; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < 3; row += 1) {
      if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row;
    }
    if (Math.abs(rows[pivot][col]) < 1e-9) return null;
    [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    const div = rows[col][col];
    for (let j = col; j < 4; j += 1) rows[col][j] /= div;
    for (let row = 0; row < 3; row += 1) {
      if (row === col) continue;
      const factor = rows[row][col];
      for (let j = col; j < 4; j += 1) rows[row][j] -= factor * rows[col][j];
    }
  }
  return [rows[0][3], rows[1][3], rows[2][3]];
}

function affineCoefficients(points = [], pixelKey = "pixelX") {
  const valid = points.filter((p) =>
    Number.isFinite(Number(p.gameX)) &&
    Number.isFinite(Number(p.gameY)) &&
    Number.isFinite(Number(p[pixelKey]))
  );
  if (valid.length < 3) return null;

  const ata = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const atb = [0, 0, 0];
  for (const p of valid) {
    const v = [Number(p.gameX), Number(p.gameY), 1];
    const target = Number(p[pixelKey]);
    for (let i = 0; i < 3; i += 1) {
      atb[i] += v[i] * target;
      for (let j = 0; j < 3; j += 1) ata[i][j] += v[i] * v[j];
    }
  }
  return solve3x3(ata, atb);
}

function mapGameToPixel(map = {}, wp = {}) {
  const points = Array.isArray(map.gameCalibration) ? map.gameCalibration : [];
  const cx = affineCoefficients(points, "pixelX");
  const cy = affineCoefficients(points, "pixelY");
  if (cx && cy) {
    return {
      x: Number(wp.x) * cx[0] + Number(wp.y) * cx[1] + cx[2],
      y: Number(wp.x) * cy[0] + Number(wp.y) * cy[1] + cy[2],
    };
  }

  if (points.length < 2) return null;
  const ax = points[0];
  const bx = points.find((p) => p !== ax && Math.abs((p.gameX || 0) - (ax.gameX || 0)) > 1);
  const ay = points[0];
  const by = points.find((p) => p !== ay && Math.abs((p.gameY || 0) - (ay.gameY || 0)) > 1);
  if (!ax || !bx || !ay || !by) return null;
  const sx = (bx.pixelX - ax.pixelX) / (bx.gameX - ax.gameX);
  const sy = (by.pixelY - ay.pixelY) / (by.gameY - ay.gameY);
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return null;
  return { x: ax.pixelX + (wp.x - ax.gameX) * sx, y: ay.pixelY + (wp.y - ay.gameY) * sy };
}

function routeLooksVisible(points = [], mapW = 2048, mapH = 1798) {
  if (!points.length) return false;
  const marginX = mapW * 0.18;
  const marginY = mapH * 0.18;
  const visible = points.filter((p) =>
    Number.isFinite(p.x) &&
    Number.isFinite(p.y) &&
    p.x >= -marginX &&
    p.x <= mapW + marginX &&
    p.y >= -marginY &&
    p.y <= mapH + marginY
  );
  return visible.length >= Math.max(2, Math.ceil(points.length * 0.45));
}

function fitWaypointsToMap(waypoints = [], mapW = 2048, mapH = 1798) {
  if (!waypoints.length) return [];
  const xs = waypoints.map((p) => p.x).filter(Number.isFinite);
  const ys = waypoints.map((p) => p.y).filter(Number.isFinite);
  if (!xs.length || !ys.length) return [];
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const pad = 0.16;
  const drawW = mapW * (1 - pad * 2);
  const drawH = mapH * (1 - pad * 2);
  const scale = Math.min(drawW / spanX, drawH / spanY);
  const usedW = spanX * scale;
  const usedH = spanY * scale;
  const offsetX = (mapW - usedW) / 2;
  const offsetY = (mapH - usedH) / 2;
  return waypoints.map((wp) => ({
    x: offsetX + (wp.x - minX) * scale,
    y: offsetY + (wp.y - minY) * scale,
    schematic: true,
  }));
}

function getRouteDisplayPoints(route = {}, mapW = 2048, mapH = 1798, map = {}) {
  const waypoints = getRouteWaypoints(route);
  if (waypoints.length < 2) return [];
  const nativePixels = waypoints.map((wp) => ({ x: wp.x, y: wp.y }));
  if (route.coordinateSystem === "pixel" || route.coordinateSystem === "map" || routeLooksVisible(nativePixels, mapW, mapH)) return nativePixels;

  const mapCalibrated = waypoints.map((wp) => mapGameToPixel(map, wp)).filter(Boolean);
  if (mapCalibrated.length === waypoints.length && routeLooksVisible(mapCalibrated, mapW, mapH)) return mapCalibrated;

  const calibrated = waypoints.map(routeToMapPoint);
  if (routeLooksVisible(calibrated, mapW, mapH)) return calibrated;
  return fitWaypointsToMap(waypoints, mapW, mapH);
}

function Paragraphs({ text, className = "", dense = false }) {
  const content = cleanText(text, "No briefing text has been filed for this item.");
  return (
    <div className={cls("space-y-3", className)}>
      {content.split(/\n\s*\n/g).filter(Boolean).map((para, index) => (
        <p key={index} className={cls(dense ? "text-sm leading-6" : "leading-7", "text-stone-300")}>{para.trim()}</p>
      ))}
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2"><p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{label}</p><p className="mt-1 text-sm font-semibold text-stone-100">{value}</p></div>;
}


function prettyAircraft(value = "") {
  const t = cleanText(value, "Aircraft TBC");
  return t
    .replace(/_/g, " ")
    .replace(/\bBf-/g, "Bf ")
    .replace(/\bMe-/g, "Me ")
    .replace(/\bHe-/g, "He ")
    .replace(/\bDo-/g, "Do ")
    .replace(/\bJu-/g, "Ju ")
    .replace(/HurricaneMkI\b/g, "Hurricane Mk I")
    .replace(/SpitfireMkIa\b/g, "Spitfire Mk Ia")
    .replace(/SpitfireMkI\b/g, "Spitfire Mk I")
    .replace(/100oct/g, "100 oct")
    .replace(/\s+/g, " ")
    .trim();
}

function aircraftForRole(role = {}, routes = []) {
  const matched = routesForRole(routes, role)[0];
  return prettyAircraft(matched?.aircraft || role.aircraft || "Aircraft TBC");
}

function missionSourcePath(mission = {}) {
  const source = (mission.sourceFiles || []).find((file) => /\.mis$/i.test(file));
  return source || "";
}

function missionId(day = {}, mission = {}, role = {}) {
  return [day.date, mission.time, mission.title, role.unit || role.id].filter(Boolean).join(" | ");
}

const COMPANION_PORT = __COMPANION_PORT__;
function companionUrl(urlPath) {
  return `http://127.0.0.1:${COMPANION_PORT}${urlPath}`;
}

async function companionRequest(path, options = {}) {
  const response = await fetch(companionUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Companion bridge returned ${response.status}`);
  return response.json();
}

function loadPilotLogEntries() {
  try {
    const raw = localStorage.getItem("bob-pilot-log-v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePilotLogEntries(entries) {
  localStorage.setItem("bob-pilot-log-v1", JSON.stringify(entries));
}

function newPilotLogDraft(day = {}, mission = {}, role = {}, route = null) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    dayDate: day.date || "",
    dayTitle: day.title || "",
    missionTime: mission.time || "",
    missionTitle: mission.title || "",
    missionType: mission.type || "",
    side: role.side || inferSide(role),
    unit: role.unit || role.id || "",
    aircraft: aircraftForRole(role, route ? [route] : []),
    role: role.role || "",
    result: "Completed",
    claimsAir: "0",
    claimsGround: "0",
    damage: "None recorded",
    landing: "Returned to base",
    duration: "",
    notes: "",
    autoEvents: [],
  };
}

function selectedRouteForRole(routes = [], role = null) {
  if (!role) return routes[0] || null;
  return routesForRole(routes, role)[0] || routes[0] || null;
}
function defaultCompanionConfig() {
  return {
    clodInstallDir: String.raw`C:\Program Files (x86)\Steam\steamapps\common\IL-2 Sturmovik Cliffs of Dover Blitz`,
    clodDocumentsDir: String.raw`%USERPROFILE%\Documents\1C SoftClub\il-2 sturmovik cliffs of dover`,
    campaignRoot: String.raw`C:\Program Files (x86)\Steam\steamapps\common\IL-2 Sturmovik Cliffs of Dover Blitz\parts\bob\mission\campaign`,
    campaignTitle: "",
    pilotLogDir: String.raw`%USERPROFILE%\Documents\1C SoftClub\il-2 sturmovik cliffs of dover\CampaignBoard`,
    pilotLogPath: String.raw`%USERPROFILE%\Documents\1C SoftClub\il-2 sturmovik cliffs of dover\CampaignBoard\events.jsonl`,
    mapImagePath: "auto",
    autoSelectMap: false,
    assetMode: "reference",
    autoWriteSrcu: false,
    serverPassword: "",
  };
}

function pilotLogFolderFromConfig(config = {}) {
  if (config.pilotLogDir) return config.pilotLogDir;
  const value = String(config.pilotLogPath || "");
  if (/\.jsonl$/i.test(value)) return value.replace(/[\\/][^\\/]+$/, "");
  return value;
}

function companionConfigForSavePayload(next = {}) {
  const pilotLogDir = pilotLogFolderFromConfig(next);
  return {
    ...next,
    pilotLogDir,
    pilotLogPath: pilotLogDir ? `${pilotLogDir.replace(/[\\/]$/, "")}/events.jsonl` : next.pilotLogPath,
    mapImagePath: "auto",
    autoSelectMap: false,
    assetMode: "reference",
  };
}

function campaignMonthLabel(campaign = {}, days = []) {
  const first = days?.[0]?.date || campaign?.period?.slice(0, 10);
  if (!first) return "Campaign timeline";
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${first}T00:00:00Z`));
}

function OptionsPanel({ open, onClose, onCampaignLoaded, refreshCompanionStatus }) {
  const [config, setConfig] = useState(defaultCompanionConfig);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMessage("Checking local companion bridge…");
    companionRequest("/api/config")
      .then((data) => {
        setConfig(companionConfigForSave({ ...defaultCompanionConfig(), ...(data.config || data) }));
        setMessage("Local companion bridge online.");
      })
      .catch(() => setMessage("Local bridge is offline. Start scripts/local-companion-server.mjs to save options or scan a campaign folder."));
  }, [open]);

  if (!open) return null;

  function companionConfigForSave(next = config) {
    return companionConfigForSavePayload(next);
  }

  function update(field, value) {
    setConfig((current) => companionConfigForSave({ ...current, [field]: value }));
  }

  async function browseFolder(field, title) {
    setBusy(true);
    setMessage("Opening folder picker…");
    try {
      const result = await companionRequest("/api/browse-folder", {
        method: "POST",
        body: JSON.stringify({ title, initialDir: config[field] || "" }),
      });
      if (result.path) {
        update(field, result.path);
        setMessage("Folder selected.");
      } else {
        setMessage("Folder selection cancelled.");
      }
    } catch {
      setMessage("Could not open folder picker. Make sure the local companion bridge is running on Windows.");
    } finally {
      setBusy(false);
    }
  }

  async function browseFile(field, title) {
    setBusy(true);
    setMessage("Opening file picker…");
    try {
      const result = await companionRequest("/api/browse-file", {
        method: "POST",
        body: JSON.stringify({ title, initialFile: config[field] || "" }),
      });
      if (result.path) {
        update(field, result.path);
        setMessage("File selected.");
      } else {
        setMessage("File selection cancelled.");
      }
    } catch {
      setMessage("Could not open file picker. You can still paste the path manually.");
    } finally {
      setBusy(false);
    }
  }

  async function saveOptions() {
    setBusy(true);
    setMessage("Saving companion settings…");
    try {
      const payload = companionConfigForSave(config);
      const result = await companionRequest("/api/config", { method: "POST", body: JSON.stringify(payload) });
      setConfig(companionConfigForSave({ ...defaultCompanionConfig(), ...(result.config || payload) }));
      setMessage("Options saved to companion-config.json.");
      refreshCompanionStatus?.();
    } catch {
      setMessage("Could not save options. Make sure the local companion bridge is running.");
    } finally {
      setBusy(false);
    }
  }

  async function scanCampaign() {
    setBusy(true);
    setMessage("Scanning campaign folder…");
    try {
      const payload = companionConfigForSave(config);
      const result = await companionRequest("/api/scan-campaign", { method: "POST", body: JSON.stringify(payload) });
      if (result.config) setConfig(companionConfigForSave({ ...defaultCompanionConfig(), ...result.config }));
      if (result.campaign) onCampaignLoaded?.(normalizeCampaign(result.campaign));
      setMessage(result.message || "Campaign scanned and loaded.");
      refreshCompanionStatus?.();
    } catch {
      setMessage("Campaign scan failed. Check the folder path and confirm the companion bridge is running.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[84vh] w-full max-w-3xl overflow-auto rounded-3xl border border-white/10 bg-stone-950 p-5 shadow-2xl shadow-black/60">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-amber-100"><SettingsIcon className="h-4 w-4" /> Companion options</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Campaign & Cliffs paths</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">Set the folders, then scan. Maps are chosen automatically by theatre; campaign images remain in their original folders and are served by the local companion.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm text-stone-300"><span>Campaign display name</span><input value={config.campaignTitle || ""} onChange={(e) => update("campaignTitle", e.target.value)} placeholder="Leave blank to use campaigns.ini or folder name" className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-amber-200/40" /></label>

          <label className="grid gap-1 text-sm text-stone-300"><span className="flex items-center gap-2"><FolderIcon className="h-4 w-4 text-stone-500" /> Campaign folder</span><div className="flex gap-2"><input value={config.campaignRoot || ""} onChange={(e) => update("campaignRoot", e.target.value)} placeholder="C:\Program Files (x86)\Steam\steamapps\common\IL-2 Sturmovik Cliffs of Dover Blitz\parts\bob\mission\campaign" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-amber-200/40" /><button disabled={busy} onClick={() => browseFolder("campaignRoot", "Select campaign folder")} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-stone-100 hover:bg-white/[0.1] disabled:opacity-50">Browse</button></div></label>

          <label className="grid gap-1 text-sm text-stone-300"><span>Cliffs of Dover install folder</span><div className="flex gap-2"><input value={config.clodInstallDir || ""} onChange={(e) => update("clodInstallDir", e.target.value)} placeholder="C:\Program Files (x86)\Steam\steamapps\common\IL-2 Sturmovik Cliffs of Dover Blitz" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-amber-200/40" /><button disabled={busy} onClick={() => browseFolder("clodInstallDir", "Select Cliffs of Dover install folder")} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-stone-100 hover:bg-white/[0.1] disabled:opacity-50">Browse</button></div></label>

          <label className="grid gap-1 text-sm text-stone-300"><span>Cliffs of Dover documents folder</span><div className="flex gap-2"><input value={config.clodDocumentsDir || ""} onChange={(e) => update("clodDocumentsDir", e.target.value)} placeholder="%USERPROFILE%\Documents\1C SoftClub\il-2 sturmovik cliffs of dover" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-amber-200/40" /><button disabled={busy} onClick={() => browseFolder("clodDocumentsDir", "Select Cliffs of Dover documents folder")} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-stone-100 hover:bg-white/[0.1] disabled:opacity-50">Browse</button></div></label>

          <label className="grid gap-1 text-sm text-stone-300"><span>Pilot log folder</span><div className="flex gap-2"><input value={pilotLogFolderFromConfig(config)} onChange={(e) => update("pilotLogDir", e.target.value)} placeholder="%USERPROFILE%\Documents\1C SoftClub\il-2 sturmovik cliffs of dover\CampaignBoard" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-amber-200/40" /><button disabled={busy} onClick={() => browseFolder("pilotLogDir", "Select pilot log folder")} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-stone-100 hover:bg-white/[0.1] disabled:opacity-50">Browse</button></div><span className="text-xs text-stone-500">The companion will create <span className="font-mono text-stone-300">events.jsonl</span> inside this folder.</span></label>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-stone-400">
            <span className="font-semibold text-stone-200">Automatic handling:</span> map image is always set to <span className="font-mono text-amber-100">auto</span>, and briefing images are referenced from the scanned campaign folder rather than copied into the app.
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-stone-300"><input type="checkbox" checked={!!config.autoWriteSrcu} onChange={(e) => update("autoWriteSrcu", e.target.checked)} /> Automatically write srcu to run selected-mission.cmd when server starts</label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <button disabled={busy} onClick={saveOptions} className="inline-flex items-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm font-semibold text-stone-100 ring-1 ring-white/10 hover:bg-white/[0.1] disabled:opacity-50"><SaveIcon className="h-4 w-4" /> Save options</button>
            <button disabled={busy} onClick={scanCampaign} className="inline-flex items-center gap-2 rounded-2xl bg-amber-300/15 px-4 py-3 text-sm font-semibold text-amber-100 ring-1 ring-amber-200/25 hover:bg-amber-300/20 disabled:opacity-50"><Radio className="h-4 w-4" /> Scan campaign folder</button>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-stone-200 hover:bg-white/[0.1]">Close</button>
        </div>
        {message ? <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-stone-300">{message}</p> : null}
      </div>
    </div>
  );
}

function Header({ campaign, timelineItems, selectedTimelineKey, onSelectTimelineKey, timelineMode, setTimelineMode, sideFilter, setSideFilter, groupFilter, setGroupFilter, groups, missionTypeFilter, setMissionTypeFilter, missionTypes, aircraftFilter, setAircraftFilter, aircraftOptions, status, onOpenOptions }) {
  const theme = themeForSide(sideFilter);
  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-black/20">
      <div className={cls("absolute inset-0 -z-10", theme.headerGlow)} />
      <div className="mx-auto max-w-[1800px] px-4 py-6 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(420px,1fr)_minmax(300px,460px)] xl:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.22em] backdrop-blur">
              <Star className={cls("h-3.5 w-3.5", theme.accentText)} />
              <span className={theme.accentText}>{theme.badge}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 md:gap-5">
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">{campaign.title || "Battle of Britain"}</h1>
              <button
                onClick={onOpenOptions}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-stone-100 transition hover:bg-white/[0.1]"
                aria-label="Open options"
                title="Options"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
              {theme.emblem ? (
                <img
                  src={theme.emblem}
                  alt={theme.emblemAlt}
                  className="h-20 w-20 shrink-0 object-contain opacity-90 drop-shadow-2xl md:h-24 md:w-24"
                  draggable={false}
                />
              ) : null}
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
              Select a day’s operations, choose a flight section, then inspect the chart, photographs and briefing notes.
            </p>
            {status === "error" ? (
              <p className="mt-2 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
                Operations log unavailable — showing sample orders.
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur xl:justify-self-end xl:min-w-[420px]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Operations filter</p>
                <p className="mt-1 text-sm font-semibold text-stone-100">{theme.label}</p>
              </div>
              {theme.emblem ? (
                <img src={theme.emblem} alt="" className="h-10 w-10 object-contain opacity-50" draggable={false} />
              ) : null}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-stone-500">Choose side</span>
                <select
                  value={sideFilter}
                  onChange={(e) => { setSideFilter(e.target.value); setGroupFilter("All"); setAircraftFilter("All"); }}
                  className={cls("w-full rounded-2xl border border-white/10 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none ring-0", theme.focusBorder)}
                >
                  <option value="All">All forces</option>
                  <option value="RAF">RAF</option>
                  <option value="Luftwaffe">Luftwaffe</option>
                  <option value="Regia Aeronautica">Regia Aeronautica</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-stone-500">Follow Squadron / Gruppe</span>
                <select
                  value={groupFilter}
                  onChange={(e) => { setGroupFilter(e.target.value); setAircraftFilter("All"); }}
                  className={cls("w-full rounded-2xl border border-white/10 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none", theme.focusBorder)}
                >
                  <option value="All">All units</option>
                  {groups.map((group) => <option key={`${group.side}-${group.value}`} value={group.value}>{group.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-stone-500">Mission type</span>
                <select
                  value={missionTypeFilter}
                  onChange={(e) => { setMissionTypeFilter(e.target.value); setAircraftFilter("All"); }}
                  className={cls("w-full rounded-2xl border border-white/10 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none", theme.focusBorder)}
                >
                  <option value="All">All mission types</option>
                  {missionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-stone-500">Aircraft type</span>
                <select
                  value={aircraftFilter}
                  onChange={(e) => setAircraftFilter(e.target.value)}
                  className={cls("w-full rounded-2xl border border-white/10 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none", theme.focusBorder)}
                >
                  <option value="All">All aircraft</option>
                  {aircraftOptions.map((group) => (
                    <optgroup key={group.familyKey} label={group.family}>
                      <option value={group.familyKey}>All {group.family}</option>
                      {group.variants.map((variant) => <option key={variant.value} value={variant.value}>{variant.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TopTimeline
            campaign={campaign}
            items={timelineItems}
            selectedKey={selectedTimelineKey}
            onSelectKey={onSelectTimelineKey}
            mode={timelineMode}
            setMode={setTimelineMode}
            theme={theme}
          />
        </div>
      </div>
    </header>
  );
}

function TopTimeline({ campaign, items, selectedKey, onSelectKey, mode = "day", setMode = () => {}, theme = sideTheme.All }) {
  const railRef = useRef(null);
  const cardRefs = useRef({});
  const dayItems = items || [];
  const firstDate = dayItems.find((item) => item.date)?.date || campaign?.days?.[0]?.date || "1940-07-04";
  const timelineLabel = mode === "time" ? "Sortie times" : campaignMonthLabel(campaign, dayItems);

  useEffect(() => {
    const node = selectedKey ? cardRefs.current[selectedKey] : null;
    if (node) node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [dayItems, selectedKey]);

  const currentPos = Math.max(0, dayItems.findIndex((item) => item.key === selectedKey));
  const jump = (delta) => {
    if (!dayItems.length) return;
    const nextPos = clamp(currentPos + delta, 0, dayItems.length - 1);
    onSelectKey(dayItems[nextPos].key);
  };

  return (
    <section className="min-w-0 rounded-3xl border border-white/10 bg-stone-950/60 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">{mode === "time" ? "Time board" : "Campaign timeline"}</p>
          <p className="text-sm font-semibold text-stone-100">{timelineLabel}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-1">
            {[["day", "Days"], ["time", "Times"]].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={cls(
                  "min-w-[84px] rounded-xl px-3 py-2 text-sm transition",
                  mode === value ? "bg-amber-300/15 text-amber-100 ring-1 ring-amber-200/25" : "text-stone-400 hover:bg-white/[0.08]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => jump(-1)} className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-stone-300 hover:bg-white/[0.1]" aria-label="Previous timeline item"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => jump(1)} className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-stone-300 hover:bg-white/[0.1]" aria-label="Next timeline item"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
      <div ref={railRef} className="relative flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dayItems.map((item) => {
          const selected = item.key === selectedKey;
          const title = mode === "time" ? timeOfDayLabel(item.time) : item.title;
          const primary = mode === "time" ? `${item.time} hours` : `Day ${getDayNumber(item.date, firstDate)}`;
          const secondary = mode === "time" ? `${item.missionCount || item.missions?.length || 0} sortie${(item.missionCount || item.missions?.length || 0) === 1 ? "" : "s"}` : item.date?.slice(5);
          const note = mode === "time" ? `${item.roleCount || 0} flyable section${(item.roleCount || 0) === 1 ? "" : "s"}` : `${item.missions?.length || 0} mission${item.missions?.length === 1 ? "" : "s"}`;
          return (
            <button
              ref={(el) => { if (el) cardRefs.current[item.key] = el; }}
              key={item.key}
              onClick={() => onSelectKey(item.key)}
              className={cls(
                "min-w-[210px] rounded-2xl border p-3 text-left transition",
                selected ? theme.timelineSelected : "border-white/10 bg-white/[0.035] hover:bg-white/[0.07]"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-300">{primary}</span>
                <span className="text-xs text-stone-500">{secondary}</span>
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-stone-100">{title}</p>
              <p className="mt-1 text-xs text-stone-500">{note}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MissionCard({ mission, active, onClick }) {
  const Icon = missionTypeIcon(mission.type);
  const roles = mission.playable || [];
  return (
    <button onClick={onClick} className={cls("group relative min-h-[126px] overflow-hidden rounded-3xl border p-4 text-left transition", active ? "border-amber-300/55 bg-amber-200/[0.09] shadow-xl shadow-amber-950/30" : "border-white/10 bg-white/[0.055] hover:border-white/20 hover:bg-white/[0.085]")}> 
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-950/70 px-2.5 py-1 text-xs font-medium text-stone-300 ring-1 ring-white/10"><Clock className="h-3.5 w-3.5" /> {mission.time || "----"}</span>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-stone-50">{mission.title}</h3>
          <p className="mt-1 truncate text-sm text-stone-400">{mission.type || "Mission"}</p>
        </div>
        <div className="rounded-2xl bg-stone-950/60 p-3 text-stone-200 ring-1 ring-white/10"><Icon className="h-5 w-5" /></div>
      </div>
      {roles.length ? <div className="mt-4 flex flex-wrap gap-2">{roles.slice(0, 3).map((role, index) => <span key={`${role.unit}-${role.aircraft}-${index}`} className={cls("rounded-full border px-2.5 py-1 text-xs", sideTone[role.side] || sideTone.Unknown)}>{role.unit || role.id} · {prettyAircraft(role.aircraft || role.role)}</span>)}{roles.length > 3 ? <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-stone-400">+{roles.length - 3}</span> : null}</div> : <p className="mt-4 text-sm text-stone-500">No section orders filed.</p>}
    </button>
  );
}

function DayMissionPicker({ day, missions, selectedMissionIndex, setSelectedMissionIndex, query, setQuery }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-stone-950/60 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">{day?.key?.startsWith("time:") ? "Selected time" : "Selected day"}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{day?.date} · {day?.title}</h2>
          {day?.summary ? <p className="mt-2 max-w-5xl text-sm leading-6 text-stone-400">{truncate(day.summary, 520)}</p> : null}
        </div>
        <div className="grid gap-2 sm:min-w-[360px]">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-stone-300"><Search className="h-4 w-4 text-stone-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search squadron, Gruppe, aircraft..." className="w-full bg-transparent outline-none placeholder:text-stone-600" /></label>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Available sorties</p>
          <p className="text-sm text-stone-400">Pick a time slot, then choose the flight section shown on the sortie board.</p>
        </div>
        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-stone-300 ring-1 ring-white/10">{missions.length} listed</span>
      </div>
      {missions.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{missions.map((mission, index) => <MissionCard key={`${mission.time}-${mission.title}-${index}`} mission={mission} active={selectedMissionIndex === index} onClick={() => setSelectedMissionIndex(index)} />)}</div> : <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-white/[0.035] p-8 text-center"><Wind className="mx-auto h-8 w-8 text-stone-600" /><p className="mt-3 text-lg font-semibold text-stone-200">No sorties match the current filter</p></div>}
    </section>
  );
}

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;
  return <button onClick={onClick} className={cls("inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ring-1", active ? "bg-amber-300/15 text-amber-100 ring-amber-200/25" : "bg-white/[0.04] text-stone-400 ring-white/10 hover:bg-white/[0.08]")}><Icon className="h-4 w-4" />{tab.label}</button>;
}

function MissionDashboard({ campaign, day, mission, sideFilter = "All", groupFilter = "All", missionTypeFilter = "All", aircraftFilter = "All", pilotLogEntries = [], setPilotLogEntries = () => {}, companionStatus = "unknown", refreshCompanionStatus = () => {} }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const missionKey = `${day?.date}-${mission?.time}-${mission?.title}`;
  useKeyedReset(missionKey, setSlideIndex);
  useEffect(() => { setActiveTab("overview"); setSelectedRoleIndex(0); }, [missionKey, sideFilter, groupFilter, missionTypeFilter, aircraftFilter]);

  const allSlides = mission?.slides?.length ? mission.slides : mission?.images || [];
  const allRoutes = useMemo(() => dedupeRoutes(mission?._allRoutes || mission?.routes || []).map((route) => ({ ...route, side: inferSide(route) })), [mission]);
  const roles = (mission?.playable?.length ? mission.playable : mission?._allPlayable || []).map((role) => ({ ...role, side: inferSide(role) })).filter((role) => sideMatches(role, sideFilter) && roleMatchesGroup(role, groupFilter) && roleMatchesAircraft(role, aircraftFilter));
  const selectedRole = roles[selectedRoleIndex] || roles[0] || null;
  const routes = selectedRole ? routesForRole(allRoutes, selectedRole) : allRoutes.filter((route) => sideMatches(route, sideFilter) && routeMatchesGroup(route, groupFilter) && routeMatchesAircraft(route, aircraftFilter)).slice(0, 1);
  const selectedRoute = selectedRouteForRole(routes, selectedRole);
  const slides = slidesForSelection(allSlides, selectedRole, selectedRole?.side || sideFilter);
  const firstSlide = slides[slideIndex] || slides[0];
  const weather = weatherProfile(mission?.weather || day?.weather || "", mission?.time);
  const WeatherIcon = weather.Icon;
  useEffect(() => { if (selectedRoleIndex >= roles.length) setSelectedRoleIndex(0); }, [roles.length, selectedRoleIndex]);

  if (!mission) return <section className="rounded-3xl border border-white/10 bg-stone-950/70 p-10 text-center"><CloudSun className="mx-auto h-10 w-10 text-stone-600" /><p className="mt-4 text-xl font-semibold text-stone-100">No sortie listed for this day</p></section>;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-stone-950/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="border-b border-white/10 p-5 md:p-6">
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px_auto] 2xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-2 rounded-full bg-amber-300/15 px-3 py-1 text-sm font-medium text-amber-100 ring-1 ring-amber-200/20"><Clock className="h-4 w-4" /> {mission.time || "----"} hours</span><span className="rounded-full bg-white/10 px-3 py-1 text-sm text-stone-300 ring-1 ring-white/10">{timeOfDayLabel(mission.time)}</span><span className="rounded-full bg-white/10 px-3 py-1 text-sm text-stone-300 ring-1 ring-white/10">{mission.type || "Mission"}</span></div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{mission.title}</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
            <div className="flex items-center gap-3">
              <div className={cls("rounded-xl p-2 ring-1", weather.tone)}><WeatherIcon className="h-5 w-5" /></div>
              <div><p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Weather / light</p><p className="text-sm font-semibold text-stone-100">{weather.label} · {timeOfDayLabel(mission.time)}</p></div>
            </div>
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-stone-400">{mission.weather || day.weather || "Weather report unavailable."}</p>
          </div>
          <div className="flex flex-col gap-2 2xl:items-end">
            <div className="flex flex-wrap gap-2 2xl:justify-end">{tabDefs.filter((tab) => tab.id !== "launch" && tab.id !== "log").map((tab) => <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />)}</div>
            <div className="flex flex-wrap gap-2 2xl:justify-end border-t border-white/10 pt-2">{tabDefs.filter((tab) => tab.id === "launch" || tab.id === "log").map((tab) => <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />)}</div>
          </div>
        </div>
        <div className="mt-5">
          {roles.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Available flights</p>
                  <p className="text-xs text-stone-400">Choose the section whose orders, chart and photographs you want to inspect.</p>
                </div>
                <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-stone-300 ring-1 ring-white/10">{roles.length} section{roles.length === 1 ? "" : "s"}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                {roles.map((role, index) => (
                  <button key={`${role.id || role.unit}-${index}`} onClick={() => setSelectedRoleIndex(index)} className={cls("min-h-[62px] rounded-2xl border px-3 py-2 text-left text-xs transition", index === selectedRoleIndex ? sideSelectedTone[role.side] || sideSelectedTone.Unknown : sideTone[role.side] || sideTone.Unknown)} title={role.role || role.description || "Flight section"}>
                    <span className="block font-semibold">{role.unit || role.id}</span>
                    <span className="mt-1 block text-[11px] opacity-80">{[aircraftForRole(role, allRoutes), role.role].filter(Boolean).join(" · ")}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-stone-500">No flight sections match the current board filters.</p>}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="p-5 md:p-6">
          {activeTab === "overview" ? <OverviewTab campaign={campaign} day={day} mission={mission} slides={slides} firstSlide={firstSlide} routes={routes} selectedRole={selectedRole} setActiveTab={setActiveTab} /> : null}
          {activeTab === "map" ? <MapTab campaign={campaign} routes={routes} allRoutes={allRoutes} roles={roles} selectedRoleIndex={selectedRoleIndex} setSelectedRoleIndex={setSelectedRoleIndex} /> : null}
          {activeTab === "gallery" ? <GalleryTab slides={slides} slideIndex={slideIndex} setSlideIndex={setSlideIndex} /> : null}
          {activeTab === "briefing" ? <BriefingTab day={day} mission={mission} selectedRole={selectedRole} /> : null}
          {activeTab === "roles" ? <RolesTab roles={roles} routes={allRoutes} selectedRoleIndex={selectedRoleIndex} setSelectedRoleIndex={setSelectedRoleIndex} /> : null}
          {activeTab === "launch" ? <LaunchTab day={day} mission={mission} selectedRole={selectedRole} selectedRoute={selectedRoute} companionStatus={companionStatus} refreshCompanionStatus={refreshCompanionStatus} /> : null}
          {activeTab === "log" ? <PilotLogTab day={day} mission={mission} selectedRole={selectedRole} selectedRoute={selectedRoute} entries={pilotLogEntries} setEntries={setPilotLogEntries} companionStatus={companionStatus} /> : null}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function OverviewTab({ campaign, day, mission, slides, firstSlide, routes, selectedRole, setActiveTab }) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[minmax(720px,1.35fr)_minmax(420px,.65fr)]">
      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-1">
        <div className="group overflow-hidden rounded-3xl border border-white/10 bg-black/25 text-left transition hover:border-amber-200/30">
          <div className="flex items-center justify-between border-b border-white/10 p-4"><div><p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Navigation chart</p><h3 className="text-lg font-semibold text-stone-100">{selectedRole ? `${selectedRole.unit || selectedRole.id} flight plan` : "Flight plan"}</h3></div><button onClick={() => setActiveTab("map")} className="inline-flex items-center gap-2 rounded-2xl bg-white/[0.06] px-3 py-2 text-xs text-stone-200 ring-1 ring-white/10 hover:bg-white/[0.1]" title="Open full map"><Expand className="h-4 w-4" /> Open</button></div>
          <div className="h-[360px]" onDoubleClick={() => setActiveTab("map")} title="Double-click to open full map"><ZoomMap campaign={campaign} routes={routes} compact /></div>
        </div>
        <button onClick={() => setActiveTab("gallery")} className="group overflow-hidden rounded-3xl border border-white/10 bg-black/25 text-left transition hover:border-amber-200/30">
          <div className="flex items-center justify-between border-b border-white/10 p-4"><div><p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Briefing slide</p><h3 className="line-clamp-1 text-lg font-semibold text-stone-100">{firstSlide?.title || firstSlide?.filename || "No slide image"}</h3></div><Expand className="h-5 w-5 text-stone-500 group-hover:text-amber-100" /></div>
          <div className="grid min-h-[360px] xl:grid-cols-[1.2fr_.8fr] 2xl:grid-cols-[1fr_.75fr]">
            <div className="bg-black/35">{firstSlide?.src ? <img src={firstSlide.src} alt={firstSlide.title || firstSlide.filename || "Briefing slide"} className="h-full min-h-[260px] w-full object-cover" /> : <div className="flex h-full min-h-[260px] items-center justify-center text-stone-600"><ImageIcon className="h-10 w-10" /></div>}</div>
            <div className="max-h-[360px] overflow-auto border-l border-white/10 p-4"><p className="text-xs uppercase tracking-[0.22em] text-stone-500">{firstSlide?.sectionName || "Slide"}</p><h4 className="mt-1 text-base font-semibold text-stone-100">{firstSlide?.title || firstSlide?.filename || "No slide"}</h4><Paragraphs text={firstSlide?.caption || "This slide has no caption text."} dense className="mt-3" /></div>
          </div>
        </button>
      </div>
      <aside className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-1">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-stone-500"><FileText className="h-4 w-4" /> Briefing snapshot</div><div className="max-h-[340px] overflow-auto pr-2"><Paragraphs text={selectedRole?.description || selectedRole?.objective || mission.briefing} dense /></div><button onClick={() => setActiveTab("briefing")} className="mt-4 rounded-2xl bg-white/[0.06] px-3 py-2 text-sm text-stone-200 ring-1 ring-white/10 hover:bg-white/[0.1]">Read full briefing</button></div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-sky-300/10 p-3 text-sky-100 ring-1 ring-sky-200/20"><CloudSun className="h-6 w-6" /></div><div><p className="text-xs uppercase tracking-[0.22em] text-stone-500">Met report</p><h3 className="text-lg font-semibold text-stone-100">{weatherProfile(mission.weather || day.weather || "", mission.time).label}</h3></div></div><p className="mt-4 text-sm leading-6 text-stone-300">{mission.weather || day.weather || "Weather report unavailable."}</p><div className="mt-4 grid grid-cols-3 gap-2"><Metric label="Flights" value={mission.playable?.length || 0} /><Metric label="Slides" value={slides.length} /><Metric label="Route" value={routes.length ? "Filed" : "—"} /></div></div>
      </aside>
    </div>
  );
}

function BriefingTab({ day, mission, selectedRole }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(520px,1fr)_360px]">
      <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-stone-500"><FileText className="h-4 w-4" /> Full briefing</div><div className="max-h-[72vh] overflow-auto pr-2"><Paragraphs text={selectedRole?.description || selectedRole?.objective || mission.briefing} /></div></article>
      <aside className="space-y-4"><div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><p className="text-xs uppercase tracking-[0.22em] text-stone-500">Day context</p><h3 className="mt-1 text-xl font-semibold text-stone-100">{day.title}</h3><Paragraphs text={day.summary} dense className="mt-3" /></div><div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><p className="text-xs uppercase tracking-[0.22em] text-stone-500">Weather</p><p className="mt-3 text-sm leading-6 text-stone-300">{mission.weather || day.weather}</p></div></aside>
    </div>
  );
}

function GalleryTab({ slides, slideIndex, setSlideIndex }) {
  const slide = slides[slideIndex] || slides[0];
  if (!slides.length) return <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.035] p-10 text-center"><ImageIcon className="mx-auto h-10 w-10 text-stone-600" /><p className="mt-4 text-lg font-semibold text-stone-200">No briefing images found</p></div>;
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/25">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4"><div><p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Briefing slideshow</p><h3 className="text-xl font-semibold text-stone-100">{slide.title || slide.filename}</h3></div><div className="flex items-center gap-2"><button onClick={() => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)} className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-stone-300 hover:bg-white/[0.1]"><ChevronLeft className="h-4 w-4" /></button><span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-stone-300 ring-1 ring-white/10">{slideIndex + 1} / {slides.length}</span><button onClick={() => setSlideIndex((i) => (i + 1) % slides.length)} className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-stone-300 hover:bg-white/[0.1]"><ChevronRight className="h-4 w-4" /></button></div></div>
      <div className="grid min-h-[620px] xl:grid-cols-[1.35fr_.65fr]">
        <div className="flex items-center justify-center bg-black/40 p-4">{slide.src ? <img src={slide.src} alt={slide.title || slide.filename} className="max-h-[76vh] w-full rounded-2xl object-contain" /> : null}</div>
        <aside className="border-l border-white/10 p-5"><p className="text-xs uppercase tracking-[0.22em] text-stone-500">{slide.sectionName || slide.section || "Caption"}</p><h4 className="mt-1 text-xl font-semibold text-stone-100">{slide.title || slide.filename}</h4><div className="mt-4 max-h-[64vh] overflow-auto pr-2"><Paragraphs text={slide.caption || "No caption text attached to this image."} /></div></aside>
      </div>
    </div>
  );
}


function LaunchTab({ day, mission, selectedRole, selectedRoute, companionStatus, refreshCompanionStatus }) {
  const [message, setMessage] = useState("");
  const sourcePath = missionSourcePath(mission);
  const payload = {
    day,
    mission: {
      time: mission?.time,
      title: mission?.title,
      type: mission?.type,
      sourcePath,
      sourceFiles: mission?.sourceFiles || [],
    },
    role: selectedRole,
    route: selectedRoute,
    aircraft: aircraftForRole(selectedRole || {}, selectedRoute ? [selectedRoute] : []),
  };
  const launchCommand = `Launcher64.exe -server\nf bob-selected-mission.cmd\nmissLoad "${sourcePath || "missions\\Battle of Britain\\selected.mis"}"\nbattle start`;

  async function launchMission() {
    setMessage("Sending selected sortie to the local companion bridge…");
    try {
      const result = await companionRequest("/api/launch-mission", { method: "POST", body: JSON.stringify(payload) });
      setMessage(result.message || "Launch command sent. Check the Cliffs of Dover server window.");
    } catch (error) {
      setMessage("Local companion bridge is not running yet. Start scripts/local-companion-server.mjs, or use the command-file preview below.");
    }
  }

  async function copyPlan() {
    await navigator.clipboard?.writeText(launchCommand);
    setMessage("Launch plan copied to clipboard.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(520px,1fr)_420px]">
      <div className="xl:col-span-2 rounded-2xl border border-amber-200/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
        <span className="font-semibold">Mission launching is not yet available.</span> IL-2: Cliffs of Dover does not currently support command-line mission loading. This tab previews the planned workflow for when Team Fusion exposes that capability.
      </div>
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Local companion</p>
            <h3 className="mt-1 text-2xl font-semibold text-stone-100">Launch selected sortie</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
              This public board can brief the sortie; the local companion bridge can hand it to Cliffs of Dover, write the server command file, and prepare the pilot log entry.
            </p>
          </div>
          <span className={cls("rounded-full px-3 py-1 text-xs ring-1", companionStatus === "online" ? "bg-emerald-300/10 text-emerald-100 ring-emerald-200/20" : "bg-amber-300/10 text-amber-100 ring-amber-200/20")}>
            Bridge {companionStatus === "online" ? "online" : "offline"}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Metric label="Flight" value={selectedRole?.unit || selectedRole?.id || "Choose a section"} />
          <Metric label="Aircraft" value={aircraftForRole(selectedRole || {}, selectedRoute ? [selectedRoute] : [])} />
          <Metric label="Mission file" value={sourcePath ? sourcePath.split(/\\|\//).pop() : "Not identified"} />
          <Metric label="Route" value={selectedRoute?.waypoints?.length ? `${selectedRoute.waypoints.length} waypoints` : "Not charted"} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button disabled onClick={launchMission} className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl bg-amber-300/15 px-4 py-3 text-sm font-semibold text-amber-100 ring-1 ring-amber-200/25 opacity-40">
            <PlayIcon className="h-4 w-4" /> Launch via companion
          </button>
          <button onClick={copyPlan} className="inline-flex items-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-stone-200 ring-1 ring-white/10 hover:bg-white/[0.1]">
            <ClipboardIcon className="h-4 w-4" /> Copy launch plan
          </button>
          <button onClick={refreshCompanionStatus} className="inline-flex items-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-stone-200 ring-1 ring-white/10 hover:bg-white/[0.1]">
            <WrenchIcon className="h-4 w-4" /> Check bridge
          </button>
        </div>

        {message ? <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-stone-300">{message}</p> : null}
      </section>

      <aside className="rounded-3xl border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Command-file preview</p>
        <h4 className="mt-1 text-lg font-semibold text-stone-100">Cliffs server start sequence</h4>
        <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black/40 p-4 text-xs leading-5 text-stone-300 ring-1 ring-white/10">{launchCommand}</pre>
        <p className="mt-4 text-sm leading-6 text-stone-400">
          The first local version uses Cliffs’ server-mode workflow. Later, if Team Fusion exposes a direct single-player mission launch argument, this tab can switch to that cleaner path.
        </p>
      </aside>
    </div>
  );
}

function PilotLogTab({ day, mission, selectedRole, selectedRoute, entries, setEntries, companionStatus }) {
  const [draft, setDraft] = useState(() => newPilotLogDraft(day, mission, selectedRole || {}, selectedRoute));
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft(newPilotLogDraft(day, mission, selectedRole || {}, selectedRoute));
    setMessage("");
  }, [day?.date, mission?.time, mission?.title, selectedRole?.unit, selectedRole?.id, selectedRoute?.id]);

  const relevantEntries = entries.filter((entry) => entry.missionTitle === mission?.title && entry.missionTime === mission?.time);

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveEntry() {
    const next = [{ ...draft, updatedAt: new Date().toISOString() }, ...entries];
    setEntries(next);
    savePilotLogEntries(next);
    setMessage("Pilot log entry saved locally.");
  }

  async function autofillFromBridge() {
    setMessage("Checking the local sortie recorder…");
    try {
      const result = await companionRequest(`/api/latest-sortie?mission=${encodeURIComponent(missionId(day, mission, selectedRole || {}))}`);
      const event = result.event || result;
      setDraft((current) => ({
        ...current,
        result: event.result || current.result,
        claimsAir: String(event.claimsAir ?? current.claimsAir),
        claimsGround: String(event.claimsGround ?? current.claimsGround),
        damage: event.damage || current.damage,
        landing: event.landing || current.landing,
        duration: event.duration || current.duration,
        autoEvents: event.events || current.autoEvents || [],
      }));
      setMessage("Sortie recorder data applied to the draft.");
    } catch {
      setMessage("No local recorder data found yet. You can still file the log manually.");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(560px,1fr)_420px]">
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Pilot’s log</p>
            <h3 className="mt-1 text-2xl font-semibold text-stone-100">File sortie report</h3>
            <p className="mt-2 text-sm text-stone-400">{draft.dayDate} · {draft.missionTime} · {draft.missionTitle}</p>
          </div>
          <span className={cls("rounded-full px-3 py-1 text-xs ring-1", sideTone[draft.side] || sideTone.Unknown)}>{draft.side || "Unknown"}</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-stone-300">Unit / Gruppe<input value={draft.unit} onChange={(e) => updateDraft("unit", e.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40" /></label>
          <label className="grid gap-1 text-sm text-stone-300">Aircraft variant<input value={draft.aircraft} onChange={(e) => updateDraft("aircraft", e.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40" /></label>
          <label className="grid gap-1 text-sm text-stone-300">Result<select value={draft.result} onChange={(e) => updateDraft("result", e.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40"><option>Completed</option><option>Aborted</option><option>Shot down</option><option>Bailed out</option><option>Captured</option><option>Killed</option></select></label>
          <label className="grid gap-1 text-sm text-stone-300">Landing<select value={draft.landing} onChange={(e) => updateDraft("landing", e.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40"><option>Returned to base</option><option>Landed away</option><option>Ditched</option><option>Crash-landed</option><option>Not landed</option></select></label>
          <label className="grid gap-1 text-sm text-stone-300">Air claims<input value={draft.claimsAir} onChange={(e) => updateDraft("claimsAir", e.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40" /></label>
          <label className="grid gap-1 text-sm text-stone-300">Ground / shipping claims<input value={draft.claimsGround} onChange={(e) => updateDraft("claimsGround", e.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40" /></label>
        </div>
        <label className="mt-4 grid gap-1 text-sm text-stone-300">Damage / remarks<input value={draft.damage} onChange={(e) => updateDraft("damage", e.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40" /></label>
        <label className="mt-4 grid gap-1 text-sm text-stone-300">Pilot notes<textarea value={draft.notes} onChange={(e) => updateDraft("notes", e.target.value)} rows={6} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 outline-none focus:border-amber-200/40" placeholder="What happened? Contact reports, claims, damage, lessons learned…" /></label>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={saveEntry} className="inline-flex items-center gap-2 rounded-2xl bg-amber-300/15 px-4 py-3 text-sm font-semibold text-amber-100 ring-1 ring-amber-200/25 hover:bg-amber-300/20"><SaveIcon className="h-4 w-4" /> Save log entry</button>
          <button onClick={autofillFromBridge} className="inline-flex items-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-stone-200 ring-1 ring-white/10 hover:bg-white/[0.1]"><Radio className="h-4 w-4" /> Autofill from recorder</button>
        </div>
        {message ? <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-stone-300">{message}</p> : null}
      </section>

      <aside className="rounded-3xl border border-white/10 bg-black/25 p-5">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.22em] text-stone-500">Logbook</p><h4 className="text-lg font-semibold text-stone-100">Recent entries</h4></div><span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-stone-300 ring-1 ring-white/10">{entries.length}</span></div>
        <div className="mt-4 max-h-[620px] space-y-3 overflow-auto pr-1">
          {relevantEntries.length ? relevantEntries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs text-stone-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "Filed sortie"}</p>
              <h5 className="mt-1 font-semibold text-stone-100">{entry.unit} · {entry.aircraft}</h5>
              <p className="mt-1 text-sm text-stone-400">{entry.result} · {entry.landing} · Air claims {entry.claimsAir}</p>
              {entry.notes ? <p className="mt-3 text-sm leading-6 text-stone-300">{entry.notes}</p> : null}
            </div>
          )) : <p className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-stone-500">No log entries for this sortie yet.</p>}
        </div>
        <p className="mt-4 text-xs leading-5 text-stone-500">Bridge status: {companionStatus}. Saved entries are stored locally until the companion app writes them to a file.</p>
      </aside>
    </div>
  );
}

function MapTab({ campaign, routes, allRoutes, roles, selectedRoleIndex, setSelectedRoleIndex }) {
  return <div className="grid gap-5 xl:grid-cols-[minmax(640px,1fr)_360px]"><div className="h-[76vh] min-h-[560px] overflow-hidden rounded-3xl border border-white/10 bg-black/25"><ZoomMap campaign={campaign} routes={routes} /></div><RouteList roles={roles} routes={routes} allRoutes={allRoutes} selectedRoleIndex={selectedRoleIndex} setSelectedRoleIndex={setSelectedRoleIndex} /></div>;
}

function RouteList({ roles = [], routes = [], allRoutes = [], selectedRoleIndex, setSelectedRoleIndex }) {
  return <aside className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
    <div className="mb-3 flex items-center justify-between">
      <div><p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Sortie board</p><h3 className="text-lg font-semibold text-stone-100">Choose flight section</h3></div>
      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-stone-300 ring-1 ring-white/10">{roles.length || allRoutes.length}</span>
    </div>
    {roles.length ? <div className="max-h-[38vh] space-y-2 overflow-auto pr-1">
      {roles.map((role, index) => {
        const selected = index === selectedRoleIndex;
        const matchedRoutes = routesForRole(allRoutes, role);
        return <button key={`${role.id || role.unit}-${index}`} onClick={() => setSelectedRoleIndex(index)} className={cls("w-full rounded-2xl border p-3 text-left transition", selected ? (sideSelectedTone[role.side] || sideSelectedTone.Unknown) : "border-white/10 bg-black/20 hover:bg-white/[0.06]")}>
          <div className="flex items-start justify-between gap-3"><div><span className={cls("rounded-full border px-2 py-0.5 text-[11px]", sideTone[role.side] || sideTone.Unknown)}>{role.side || "Unknown"}</span><h4 className="mt-2 text-sm font-semibold text-stone-100">{role.unit || role.id}</h4><p className="text-xs text-stone-400">{[aircraftForRole(role, matchedRoutes), role.role].filter(Boolean).join(" · ")}</p></div><Plane className="h-4 w-4 text-stone-500" /></div>
          <p className="mt-2 text-xs text-stone-500">{matchedRoutes.reduce((sum, route) => sum + (getRouteWaypoints(route).length || 0), 0)} waypoints</p>
        </button>;
      })}
    </div> : null}
    <div className="mt-4 border-t border-white/10 pt-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Charted flight plan</p>
      <div className="mt-3 space-y-3">
        {routes.length ? routes.map((route, index) => <div key={`${route.id}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="flex items-start justify-between gap-3"><div><span className={cls("rounded-full border px-2 py-0.5 text-[11px]", sideTone[route.side] || sideTone.Unknown)}>{route.side || "Unknown"}</span><h4 className="mt-2 text-sm font-semibold text-stone-100">{route.briefing || route.id}</h4><p className="text-xs text-stone-400">{prettyAircraft(route.aircraft)} · {route.formation}</p></div><Plane className="h-4 w-4 text-stone-500" /></div><p className="mt-2 text-xs text-stone-500">{getRouteWaypoints(route).length || 0} waypoints</p></div>) : <p className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-stone-500">No charted route filed for this section.</p>}
      </div>
    </div>
  </aside>;
}

function ZoomMap({ campaign, routes = [], compact = false }) {
  const map = campaign.map || fallbackCampaign.map;
  const points = mergeCalibration(map);
  const highResFactor = Math.max(1, Math.max(map.width || 2048, map.height || 1798) / 2200);
  const minZoom = compact ? 0.12 : 0.16;
  const maxZoom = compact ? 3.5 * highResFactor : 5.5 * highResFactor;
  const initialZoom = compact ? (highResFactor > 1.25 ? 0.26 : 0.58) : (highResFactor > 1.25 ? 0.36 : 0.72);
  const initialPan = compact ? { x: -420, y: -190 } : { x: -320, y: -120 };
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState(initialPan);
  const [dragging, setDragging] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const viewportRef = useRef(null);
  const zoomRef = useRef(initialZoom);
  const panRef = useRef(initialPan);
  const mapW = map.width || 2048;
  const mapH = map.height || 1798;
  const lineRoutes = useMemo(() => routes.filter((r) => getRouteWaypoints(r).length >= 2), [routes]);
  const routeFrameKey = useMemo(() => lineRoutes.map((route, index) => {
    const waypoints = getRouteWaypoints(route);
    return `${route.id || route.briefing || index}:${waypoints.length}:${waypoints[0]?.x || 0}:${waypoints[0]?.y || 0}:${waypoints.at(-1)?.x || 0}:${waypoints.at(-1)?.y || 0}`;
  }).join("|"), [lineRoutes]);
  const inverseZoom = 1 / Math.max(zoom, 0.12);
  const routeStroke = (compact ? 4.5 : 6) * inverseZoom;
  const routeHaloStroke = routeStroke + 5 * inverseZoom;
  const waypointOuterRadius = (compact ? 7 : 9) * inverseZoom;
  const waypointInnerRadius = (compact ? 4 : 5.5) * inverseZoom;

  useEffect(() => {
    zoomRef.current = zoom;
    panRef.current = pan;
  }, [zoom, pan]);

  function clampPan(nextPan, nextZoom = zoomRef.current) {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return nextPan;
    const scaledW = mapW * nextZoom;
    const scaledH = mapH * nextZoom;
    const margin = 48;
    const clampAxis = (value, viewport, scaled) => {
      if (scaled <= viewport) return (viewport - scaled) / 2;
      return clamp(value, viewport - scaled - margin, margin);
    };
    return {
      x: clampAxis(nextPan.x, rect.width, scaledW),
      y: clampAxis(nextPan.y, rect.height, scaledH),
    };
  }

  function commitView(nextZoom, nextPan) {
    const z = clamp(Number(nextZoom.toFixed(3)), minZoom, maxZoom);
    const p = clampPan(nextPan, z);
    zoomRef.current = z;
    panRef.current = p;
    setZoom(z);
    setPan(p);
  }

  function applyZoom(nextZoom) {
    commitView(nextZoom, panRef.current);
  }

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const rect = node.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const currentZoom = zoomRef.current;
      const currentPan = panRef.current;
      const factor = Math.exp(-event.deltaY * 0.00115);
      const nextZoom = clamp(currentZoom * factor, minZoom, maxZoom);
      const worldX = (mouseX - currentPan.x) / currentZoom;
      const worldY = (mouseY - currentPan.y) / currentZoom;
      const nextPan = {
        x: mouseX - worldX * nextZoom,
        y: mouseY - worldY * nextZoom,
      };

      commitView(nextZoom, nextPan);
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [minZoom, maxZoom, mapW, mapH]);

  function startDrag(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging({ x: event.clientX, y: event.clientY, pan: panRef.current });
  }

  function moveDrag(event) {
    if (!dragging) return;
    event.preventDefault();
    const nextPan = {
      x: dragging.pan.x + (event.clientX - dragging.x),
      y: dragging.pan.y + (event.clientY - dragging.y),
    };
    const clamped = clampPan(nextPan, zoomRef.current);
    panRef.current = clamped;
    setPan(clamped);
  }

  function endDrag() {
    setDragging(null);
  }

  function fitRouteView() {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || !lineRoutes.length) return false;

    const pts = lineRoutes
      .flatMap((route) => getRouteDisplayPoints(route, mapW, mapH, map))
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

    if (pts.length < 2) return false;

    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = Math.max(80, maxX - minX);
    const spanY = Math.max(80, maxY - minY);
    const padding = compact ? 46 : 82;
    const availableW = Math.max(160, rect.width - padding * 2);
    const availableH = Math.max(160, rect.height - padding * 2);
    const targetZoom = clamp(Math.min(availableW / spanX, availableH / spanY), minZoom, maxZoom);
    const targetPan = {
      x: (rect.width - spanX * targetZoom) / 2 - minX * targetZoom,
      y: (rect.height - spanY * targetZoom) / 2 - minY * targetZoom,
    };

    commitView(targetZoom, targetPan);
    return true;
  }

  function resetView() {
    if (!fitRouteView()) commitView(initialZoom, initialPan);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!fitRouteView()) commitView(initialZoom, initialPan);
    });
    return () => cancelAnimationFrame(frame);
  }, [routeFrameKey, mapW, mapH, compact]);

  return (
    <div
      ref={viewportRef}
      className="relative h-full min-h-[300px] overflow-hidden overscroll-contain bg-black/40 touch-none"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      style={{ overscrollBehavior: "contain" }}
    >
      <div className="absolute right-3 top-3 z-20 flex gap-2">
        <button onClick={() => setShowLabels((value) => !value)} className="rounded-full bg-black/60 px-3 py-1 text-xs text-stone-100 ring-1 ring-white/15">Labels {showLabels ? "on" : "off"}</button>
        <button onClick={() => applyZoom(zoomRef.current + 0.15)} className="rounded-full bg-black/60 px-3 py-1 text-sm text-stone-100 ring-1 ring-white/15">+</button>
        <button onClick={() => applyZoom(zoomRef.current - 0.15)} className="rounded-full bg-black/60 px-3 py-1 text-sm text-stone-100 ring-1 ring-white/15">−</button>
        <button onClick={resetView} className="rounded-full bg-black/60 px-3 py-1 text-xs text-stone-100 ring-1 ring-white/15">Fit route</button>
      </div>
      <div className="absolute left-3 top-3 z-20 rounded-2xl bg-black/60 px-3 py-2 text-xs text-stone-300 ring-1 ring-white/15">Mouse wheel controls chart · drag to pan</div>
      <div
        className="absolute left-0 top-0 origin-top-left cursor-grab active:cursor-grabbing"
        onPointerDown={startDrag}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, width: mapW, height: mapH }}
      >
        <img src={map.image || "/strait_of_dover_map.jpg"} alt="Strait of Dover map" draggable={false} className="absolute inset-0 h-full w-full select-none object-fill opacity-90" />
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${mapW} ${mapH}`}>
          {lineRoutes.map((route, index) => {
            const pts = getRouteDisplayPoints(route, mapW, mapH, map).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
            if (pts.length < 2) return null;
            const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
            const colour = sideLine[route.side] || sideLine.Unknown;
            return (
              <g key={`${route.id}-${index}`}>
                <path d={d} fill="none" stroke="rgba(0,0,0,.84)" strokeWidth={routeHaloStroke} strokeLinecap="round" strokeLinejoin="round" opacity="0.92" />
                <path d={d} fill="none" stroke={colour} strokeWidth={routeStroke} strokeLinecap="round" strokeLinejoin="round" opacity={pts.some((p) => p.schematic) ? "0.82" : "0.98"} strokeDasharray={pts.some((p) => p.schematic) ? `${14 * inverseZoom} ${10 * inverseZoom}` : undefined} />
                {pts.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r={waypointOuterRadius} fill="rgba(0,0,0,.75)" />
                    <circle cx={p.x} cy={p.y} r={waypointInnerRadius} fill={colour} opacity={idx === 0 ? 1 : 0.94} />
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
        {showLabels ? points.map((point) => {
          const visible = point.pixelX >= 0 && point.pixelY >= 0 && point.pixelX <= mapW && point.pixelY <= mapH;
          if (!visible) return null;
          return (
            <div key={point.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: point.pixelX, top: point.pixelY }}>
              <div style={{ transform: `scale(${inverseZoom})`, transformOrigin: "center" }} className={cls("whitespace-nowrap rounded-full border px-2 py-1 text-[11px] font-semibold shadow-xl", point.side === "Luftwaffe" ? "border-slate-200/70 bg-slate-950/80 text-slate-100" : point.side === "Regia Aeronautica" ? "border-emerald-200/70 bg-emerald-950/80 text-emerald-100" : "border-sky-200/70 bg-sky-950/80 text-sky-100")}>{point.name}</div>
            </div>
          );
        }) : null}
      </div>
    </div>
  );
}

function RoleCard({ role, route, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={cls(
        "rounded-3xl border p-5 text-left transition",
        selected ? "border-amber-300/50 bg-amber-300/10" : "border-white/10 bg-white/[0.045] hover:bg-white/[0.065]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={cls("rounded-full border px-2.5 py-1 text-xs", sideTone[role.side] || sideTone.Unknown)}>
            {role.side || "Unknown"}
          </span>
          <h4 className="mt-3 text-xl font-semibold text-stone-100">{role.unit || role.id}</h4>
          <p className="text-sm text-stone-400">{[aircraftForRole(role, route ? [route] : []), role.role].filter(Boolean).join(" · ")}</p>
        </div>
        <Plane className="h-5 w-5 text-stone-500" />
      </div>
      <div className="mt-4 max-h-[280px] overflow-auto pr-1">
        <Paragraphs text={role.objective || role.description} dense />
      </div>
      {route ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Metric label="Flight plan" value={`${getRouteWaypoints(route).length || 0} WP`} />
          <Metric label="Formation" value={route.formation || "—"} />
        </div>
      ) : null}
    </button>
  );
}

function RolesTab({ roles, routes, selectedRoleIndex = 0, setSelectedRoleIndex = () => {} }) {
  const routeByBriefing = useMemo(() => {
    const m = new Map();
    for (const route of routes) {
      const key = (route.briefing || "").toLowerCase();
      if (key && !m.has(key)) m.set(key, route);
    }
    return m;
  }, [routes]);

  if (!roles.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.035] p-10 text-center">
        <Plane className="mx-auto h-10 w-10 text-stone-600" />
        <p className="mt-4 text-lg font-semibold text-stone-200">No playable roles listed</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {roles.map((role, index) => {
        const key = (role.id || role.unit || "").toLowerCase();
        const route = routeByBriefing.get(key) || routesForRole(routes, role)[0];
        return (
          <RoleCard
            key={role.id || role.unit || `${role.aircraft}-${index}`}
            role={role}
            route={route}
            selected={index === selectedRoleIndex}
            onSelect={() => setSelectedRoleIndex(index)}
          />
        );
      })}
    </div>
  );
}

function normalizeCampaign(data) {
  if (!data || !Array.isArray(data.days)) return fallbackCampaign;
  return { ...fallbackCampaign, ...data, map: { ...fallbackCampaign.map, ...(data.map || {}) } };
}

export default function BattleOfBritainCampaignShowcase() {
  const [campaign, setCampaign] = useState(fallbackCampaign);
  const [status, setStatus] = useState("loading");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [sideFilter, setSideFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [missionTypeFilter, setMissionTypeFilter] = useState("All");
  const [aircraftFilter, setAircraftFilter] = useState("All");
  const [timelineMode, setTimelineMode] = useState("day");
  const [selectedTimeKey, setSelectedTimeKey] = useState("");
  const [pilotLogEntries, setPilotLogEntries] = useState(loadPilotLogEntries);
  const [companionStatus, setCompanionStatus] = useState("unknown");
  const [optionsOpen, setOptionsOpen] = useState(false);

  async function refreshCompanionStatus() {
    try {
      await companionRequest("/api/status");
      setCompanionStatus("online");
    } catch {
      setCompanionStatus("offline");
    }
  }

  function handleCampaignLoaded(nextCampaign) {
    setCampaign(nextCampaign);
    setStatus("ok");
    setSelectedDayIndex(0);
    setSelectedMissionIndex(0);
    setQuery("");
    setSideFilter("All");
    setGroupFilter("All");
    setMissionTypeFilter("All");
    setAircraftFilter("All");
    setTimelineMode("day");
    setSelectedTimeKey("");
  }

  useEffect(() => { refreshCompanionStatus(); }, []);
  useEffect(() => { savePilotLogEntries(pilotLogEntries); }, [pilotLogEntries]);

  useEffect(() => {
    let cancelled = false;
    fetch("/campaign-data.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Campaign log unavailable"))))
      .then((data) => {
        if (!cancelled) {
          setCampaign(normalizeCampaign(data));
          setStatus("ok");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCampaign(fallbackCampaign);
          setStatus("error");
        }
      });
    return () => { cancelled = true; };
  }, []);

  const days = campaign.days || [];
  const theme = themeForSide(sideFilter);
  const groups = useMemo(() => extractGroups(days, sideFilter), [days, sideFilter]);
  const missionTypes = useMemo(() => extractMissionKinds(days, sideFilter, groupFilter, aircraftFilter), [days, sideFilter, groupFilter, aircraftFilter]);
  const aircraftOptions = useMemo(() => extractAircraftOptions(days, sideFilter, groupFilter, missionTypeFilter), [days, sideFilter, groupFilter, missionTypeFilter]);
  const filteredDays = useMemo(() => {
    const q = query.trim().toLowerCase();
    return days.map((day, dayIndex) => {
      const missions = (day.missions || [])
        .map((mission) => missionWithDisplayFilters(mission, q, sideFilter, groupFilter, missionTypeFilter, aircraftFilter))
        .filter(Boolean);
      return { ...day, missions, originalIndex: dayIndex, key: `day:${dayIndex}` };
    }).filter((day) => day.missions.length || (!q && sideFilter === "All" && groupFilter === "All" && missionTypeFilter === "All" && aircraftFilter === "All"));
  }, [days, query, sideFilter, groupFilter, missionTypeFilter, aircraftFilter]);

  const timeSlots = useMemo(() => {
    const map = new Map();
    for (const day of filteredDays) {
      for (const mission of day.missions || []) {
        const time = mission.time || "----";
        const key = `time:${time}`;
        if (!map.has(key)) map.set(key, { key, time, date: day.date, title: timeOfDayLabel(time), missions: [], missionCount: 0, roleCount: 0 });
        const slot = map.get(key);
        slot.missions.push({ ...mission, _dayDate: day.date, _dayTitle: day.title });
        slot.missionCount += 1;
        slot.roleCount += roleCountForMission(mission);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.time.localeCompare(b.time));
  }, [filteredDays]);

  const timelineItems = timelineMode === "time" ? timeSlots : filteredDays.map((day) => ({ ...day, key: `day:${day.originalIndex}` }));
  const selectedTimelineKey = timelineMode === "time" ? (selectedTimeKey || timeSlots[0]?.key || "") : `day:${selectedDayIndex}`;

  useEffect(() => {
    if (!filteredDays.length) return;
    const stillVisible = filteredDays.some((day) => day.originalIndex === selectedDayIndex);
    if (!stillVisible) {
      setSelectedDayIndex(filteredDays[0].originalIndex);
      setSelectedMissionIndex(0);
    }
  }, [filteredDays, selectedDayIndex]);

  useEffect(() => {
    if (timelineMode !== "time") return;
    if (!timeSlots.length) return;
    if (!timeSlots.some((slot) => slot.key === selectedTimeKey)) {
      setSelectedTimeKey(timeSlots[0].key);
      setSelectedMissionIndex(0);
    }
  }, [timelineMode, timeSlots, selectedTimeKey]);

  const selectedDayByDay = filteredDays.find((d) => d.originalIndex === selectedDayIndex) || filteredDays[0];
  const selectedSlot = timeSlots.find((slot) => slot.key === selectedTimelineKey) || timeSlots[0];
  const selectedDay = timelineMode === "time" && selectedSlot
    ? { date: selectedSlot.date || "", title: `${selectedSlot.time} · ${timeOfDayLabel(selectedSlot.time)}`, summary: `${selectedSlot.missionCount} sortie${selectedSlot.missionCount === 1 ? "" : "s"} and ${selectedSlot.roleCount} flyable section${selectedSlot.roleCount === 1 ? "" : "s"} filed for this time slot.`, weather: selectedSlot.missions?.[0]?.weather || "", missions: selectedSlot.missions || [], originalIndex: -1, key: selectedSlot.key }
    : selectedDayByDay || { date: "", title: "No matching operations", summary: "Adjust the side, unit, mission type, aircraft or search filters to restore the operations board.", weather: "", missions: [], originalIndex: -1 };

  const selectedMission = selectedDay?.missions?.[selectedMissionIndex] || selectedDay?.missions?.[0] || null;

  function selectTimelineKey(key) {
    if (timelineMode === "time") {
      setSelectedTimeKey(key);
    } else {
      const index = Number(String(key).replace("day:", ""));
      if (Number.isFinite(index)) setSelectedDayIndex(index);
    }
    setSelectedMissionIndex(0);
  }

  useEffect(() => { setSelectedMissionIndex(0); }, [query, sideFilter, groupFilter, missionTypeFilter, aircraftFilter, timelineMode]);

  return (
    <div className="min-h-screen bg-[#080908] text-stone-100">
      {status === "loading" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080908]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-amber-300/60" />
            <p className="mt-4 text-sm uppercase tracking-widest text-stone-500">Loading operations board</p>
          </div>
        </div>
      )}
      <div className={cls("fixed inset-0 -z-10", theme.pageGlow)} />
      <Header
        campaign={campaign}
        timelineItems={timelineItems}
        selectedTimelineKey={selectedTimelineKey}
        onSelectTimelineKey={selectTimelineKey}
        timelineMode={timelineMode}
        setTimelineMode={setTimelineMode}
        sideFilter={sideFilter}
        setSideFilter={setSideFilter}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        groups={groups}
        missionTypeFilter={missionTypeFilter}
        setMissionTypeFilter={setMissionTypeFilter}
        missionTypes={missionTypes}
        aircraftFilter={aircraftFilter}
        setAircraftFilter={setAircraftFilter}
        aircraftOptions={aircraftOptions}
        status={status}
        onOpenOptions={() => setOptionsOpen(true)}
      />
      <OptionsPanel open={optionsOpen} onClose={() => setOptionsOpen(false)} onCampaignLoaded={handleCampaignLoaded} refreshCompanionStatus={refreshCompanionStatus} />
      <main className="mx-auto grid max-w-[1800px] gap-5 px-4 py-5 md:px-8">
        <DayMissionPicker
          day={selectedDay}
          missions={selectedDay?.missions || []}
          selectedMissionIndex={selectedMissionIndex}
          setSelectedMissionIndex={setSelectedMissionIndex}
          query={query}
          setQuery={setQuery}
        />
        <MissionDashboard
          campaign={campaign}
          day={selectedDay}
          mission={selectedMission}
          sideFilter={sideFilter}
          groupFilter={groupFilter}
          missionTypeFilter={missionTypeFilter}
          aircraftFilter={aircraftFilter}
          pilotLogEntries={pilotLogEntries}
          setPilotLogEntries={setPilotLogEntries}
          companionStatus={companionStatus}
          refreshCompanionStatus={refreshCompanionStatus}
        />
      </main>
    </div>
  );
}
