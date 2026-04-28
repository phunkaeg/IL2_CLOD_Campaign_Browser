import { app, BrowserWindow, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow(port) {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: "Cliffs Campaign Board",
    backgroundColor: "#080908",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  win.loadURL(`http://127.0.0.1:${port}`);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(async () => {
  // Resolve app root — different when packaged vs in development
  const appRoot = app.isPackaged
    ? path.join(process.resourcesPath, "app")
    : path.resolve(__dirname, "..");

  // Tell the companion server where to find its files and write its config
  process.env.BOB_APP_ROOT = appRoot;
  process.env.BOB_CONFIG_DIR = app.getPath("userData");

  const { start } = await import("../scripts/local-companion-server.mjs");
  const port = await start(Number(process.env.BOB_COMPANION_PORT) || 8765);

  createWindow(port);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(port);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
