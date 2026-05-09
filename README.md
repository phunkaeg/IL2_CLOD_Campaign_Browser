# Cliffs Campaign Board

## What This Is

IL-2 Sturmovik: Cliffs of Dover has a built-in campaign system, but it was never designed for the kind of large-scale, historically-structured mission packs that the community has produced. ATAG_Lenny's Battle of Britain mission set is a good example: dozens of individual `.mis` files, one per time slot across multiple days, flyable from both RAF and Luftwaffe perspectives. They don't plug into the game's campaign engine. They're just files — but they contain a remarkable amount of structured data.

The Cliffs Campaign Board reads that data and builds something the game itself doesn't provide: a mission browser that organises those flights by date and time, shows you what's available for each side, displays the briefing, draws the routes on a map, and helps you find the sortie you want to fly.

The original use case was ATAG_Lenny's Battle of Britain mission pack. It was later extended to cover his Operation Jubilee pack (a single-day Dieppe raid with multiple time slots), North Africa / Tobruk missions with Italian Regia Aeronautica participation, and the stock CloD campaign format. The browser adapts its layout depending on the mission pack: BoB is browsed day-by-day across a full season; Jubilee can be displayed either as a single day or broken out by time slot.

![Campaign overview — timeline, day summary, and mission list](docs/mainscreen1.png)

### The Core Problem It Solves

Finding the right mission in CloD's own mission selector is painful. You know you want to fly a Bf 109E-3 scramble out of Calais-Marck on the morning of 15th August 1940 — but the game gives you a flat list of filenames. The Campaign Board gives you a timeline, a map, a briefing, and a list of available roles. You pick the sortie, then load the corresponding file in the game.

Beyond browsing, the app also exposes a plane loadout panel where pilots can configure weapon sets, ammunition belts, and gun convergence before committing to a sortie — information that can then be manually applied in-game.

![Plane loadout — weapon sets, convergence, and ammunition selection](docs/planeloadout.png)

### The Current Limitation

IL-2 Cliffs of Dover does not support loading a mission file from the command line or an external process. The Campaign Board can identify which file you want and write a command stub, but at present it cannot actually launch the mission for you. The intended workflow is:

1. Open the Campaign Board and select your mission and role.
2. Note the mission file path shown in the Launch tab.
3. Open IL-2 CloD separately and locate the same file through the mission selector.

This is an acknowledged limitation of the current game engine. If Team Fusion were to add command-line mission loading to the launcher (e.g. `Launcher64.exe -mission "path\to\file.mis"`), the Campaign Board already has the plumbing to trigger it: the companion server writes a `selected-mission.cmd` file and can spawn an external process. Integration would be straightforward from the application side.

---

## How It Works

### Data Source: `.mis` and `.briefing` Files

CloD mission files are structured text. A `.mis` file defines the scenario: air groups, aircraft types, waypoints, spawn positions, player slots, formation settings, and skill levels. A paired `.briefing` file contains narrative sections — intro text, success/failure conditions, and per-flight briefings keyed to air group IDs.

The companion server scans a campaign root folder, parses every `.mis` and `.briefing` pair it finds, and assembles a `campaign-data.json` index. This is a one-time scan; the app reads the JSON at startup and the campaign folder itself is not touched again during normal use.

Key things the scanner infers from the raw files:

- **Date and time** — parsed from briefing text (e.g. `0700 hours, 9th of April 1941`) or from folder/file naming conventions
- **Mission type** — inferred by regex matching against briefing text and air group IDs (Patrol, Escort, Scramble, Intercept, Bomber, etc.)
- **Side** — detected from air group ID prefixes (`BoB_LW_`, `BoB_RAF_`, `Tobruk_RA_`, etc.)
- **Theatre** — determined by file paths and unit naming, used to select the correct map
- **Playable roles** — identified by checking which air groups have a valid player slot in the `.mis` file
- **Narrative vs. flyable briefing sections** — `Intro`, `Success`, and `Failure` sections are filtered out; only genuine flight briefings are surfaced

### Map and Route Rendering

Each theatre has a calibrated base map image (`strait_of_dover_map.jpg` for the Channel, `tobruk_map.jpg` for North Africa). Calibration is done using known real-world locations that appear in both the map image and the game's coordinate system — airfields like Hawkinge or Pihen that have well-established pixel and game-world coordinates.

A pair of calibration points is enough to define a linear transform from game-world coordinates (X, Y) to image pixels. Waypoints from the `.mis` file are in game-world space; the browser projects them through this transform and draws the route as an SVG overlay on top of the map image. The result is that mission routes appear in approximately the right geographic position without any dependency on the game engine or its map renderer.

The transform is a straightforward linear interpolation:

```
pixelX = ( (gameX - refGameX) / (gameX2 - refGameX) ) * (refPixelX2 - refPixelX) + refPixelX
```

Both theatres have pre-defined calibration sets. If a future campaign uses a different map, new calibration points can be added to the config.

![Map tab — route overlay with airfield callouts and flight section selector](docs/mainscreen3.png)

The map is also embedded in the mission overview alongside the briefing slide and available role cards, giving a quick spatial read of the mission before committing to a flight section.

![Mission overview — map, briefing slide, and playable roles](docs/mainscreen2.png)

### The Companion Server

The browser runs as a React SPA served by a local Node.js HTTP server on port 8765. The server is deliberately dependency-free — it uses only Node.js built-in modules (`http`, `fs`, `path`, `child_process`). This keeps deployment simple: `node local-companion-server.mjs` is all that's needed.

The server provides a small REST API:

| Endpoint | Purpose |
|---|---|
| `GET /api/status` | Health check |
| `GET /api/config` | Read companion config |
| `POST /api/config` | Write companion config |
| `POST /api/scan-campaign` | Trigger a full campaign scan and regenerate `campaign-data.json` |
| `POST /api/browse-folder` | Open a Windows folder picker dialog (via PowerShell / WinForms) |
| `POST /api/browse-file` | Open a Windows file picker dialog |
| `POST /api/launch-mission` | Write `selected-mission.cmd` and attempt to launch `Launcher64.exe` |
| `GET /api/latest-sortie` | Return the most recent event from `events.jsonl` |
| `GET /api/asset?path=...` | Stream a campaign image from its original location on disk |

The folder picker spawns a PowerShell one-liner using `System.Windows.Forms.FolderBrowserDialog`. A hosted static website cannot do this — it's an intentional capability of the local companion model.

### Pilot Log Integration

An in-game C# script (built against the Maddox Games SDK) monitors mission events and writes them as line-delimited JSON to `events.jsonl` in a configurable folder. The browser polls `/api/latest-sortie` while the Pilot Log tab is open, and displays the most recent sortie result — takeoff time, damage received, landing outcome, and so on.

This gives the browser a read-back channel from the game without requiring any persistent socket connection. The game script writes; the browser reads. They share only a file path.

![Pilot log — sortie report form and recent logbook entries](docs/pilotlog.png)

### UI Theming by Side

The UI renders differently depending on which side's filter is active:

- **RAF** — sky blue palette, RAF roundel, "Sector Operations Board" heading style
- **Luftwaffe** — slate/neutral palette, Iron Cross emblem, "Gruppenkarte" style
- **Regia Aeronautica** — emerald palette, Italian Air Force emblem
- **Combined / All** — amber/stone palette, "Operations Board"

This is cosmetic, but it matters for immersion. The goal was to feel like the kind of physical plotting board each side would have used.

---

## Setup

```powershell
npm install
npm run build
copy companion-config.example.json companion-config.json
npm run companion
```

Open `http://127.0.0.1:8765/` in a browser, then use the Options panel to point the app at your campaign folder and scan it.

The Browse buttons require the companion server to be running on the same Windows machine. A hosted static build cannot access local folders.

### Campaign Title Resolution

When scanning, the display title is chosen in this order:

1. Manual override in Options → Campaign display name
2. Title from a parent `campaigns.ini` file
3. Cleaned folder name as fallback

### Asset Handling

Campaign briefing images are served from their original folders via `/api/asset` — they are not copied into the app. This keeps the scan fast and avoids duplicating potentially large image sets. A future static/hosted build would need to copy assets at scan time, since a web server cannot reach back into the user's local filesystem.
