// Use CommonJS syntax for the preload script
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron");

// Log when the preload script runs to verify it's being loaded
console.log("Preload script is running");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Fullscreen controls
  toggleFullscreen: () => ipcRenderer.invoke("toggle-fullscreen"),
  enterFullscreen: () => ipcRenderer.invoke("enter-fullscreen"),
  exitFullscreen: () => ipcRenderer.invoke("exit-fullscreen"),

  // You could add local storage functionality here if needed
  // For example, saving and loading configuration
  saveConfig: (config) => ipcRenderer.invoke("save-config", config),
  loadConfig: () => ipcRenderer.invoke("load-config"),
});

// Expose a simple test API
contextBridge.exposeInMainWorld("electronTest", {
  ping: () => "pong",
});
