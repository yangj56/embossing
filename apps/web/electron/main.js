import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { fileURLToPath } from "url";

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// Create the browser window
function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");
  console.log("Preload path:", preloadPath);

  // Get the primary display dimensions
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
    // Remove frame for a cleaner kiosk look (optional)
    frame: false,
    // Start in fullscreen mode
    fullscreen: true,
  });

  // Load the Next.js app
  const startUrl = isDev
    ? "http://localhost:3001"
    : `file://${path.join(__dirname, "../.next/server/app/page.html")}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for fullscreen control
ipcMain.handle("toggle-fullscreen", () => {
  if (mainWindow) {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
    return !isFullScreen;
  }
  return false;
});

ipcMain.handle("enter-fullscreen", () => {
  if (mainWindow) {
    mainWindow.setFullScreen(true);
    return true;
  }
  return false;
});

ipcMain.handle("exit-fullscreen", () => {
  if (mainWindow) {
    mainWindow.setFullScreen(false);
    return true;
  }
  return false;
});

// Add this to get __dirname equivalent in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
