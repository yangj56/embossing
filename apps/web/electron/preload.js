// Use CommonJS syntax for the preload script
const { contextBridge, ipcRenderer } = require("electron");

// Log when the preload script runs to verify it's being loaded
console.log("Preload script is running");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Serial port operations
  listSerialPorts: () => ipcRenderer.invoke("list-serial-ports"),
  connectSerial: (options) => ipcRenderer.invoke("connect-serial", options),
  disconnectSerial: () => ipcRenderer.invoke("disconnect-serial"),
  sendSerialData: (data) => ipcRenderer.invoke("send-serial-data", data),
  sendImageData: (imageData) => ipcRenderer.invoke("send-image-data", imageData),

  // USB operations
  listUsbDevices: () => ipcRenderer.invoke("list-usb-devices"),
  connectUsb: (deviceId) => ipcRenderer.invoke("connect-usb", deviceId),
  disconnectUsb: () => ipcRenderer.invoke("disconnect-usb"),

  // Event listeners
  onSerialPortsList: (callback) => {
    ipcRenderer.on("serial-ports-list", (event, ports) => callback(ports));
    return () => ipcRenderer.removeListener("serial-ports-list", callback);
  },
  onSerialConnected: (callback) => {
    ipcRenderer.on("serial-connected", (event, port) => callback(port));
    return () => ipcRenderer.removeListener("serial-connected", callback);
  },
  onSerialError: (callback) => {
    ipcRenderer.on("serial-error", (event, error) => callback(error));
    return () => ipcRenderer.removeListener("serial-error", callback);
  },
  onSerialData: (callback) => {
    ipcRenderer.on("serial-data", (event, data) => callback(data));
    return () => ipcRenderer.removeListener("serial-data", callback);
  },
  onUsbDevicesList: (callback) => {
    ipcRenderer.on("usb-devices-list", (event, devices) => callback(devices));
    return () => ipcRenderer.removeListener("usb-devices-list", callback);
  },
  onUsbConnected: (callback) => {
    ipcRenderer.on("usb-connected", (event, device) => callback(device));
    return () => ipcRenderer.removeListener("usb-connected", callback);
  },
  onUsbError: (callback) => {
    ipcRenderer.on("usb-error", (event, error) => callback(error));
    return () => ipcRenderer.removeListener("usb-error", callback);
  },
  onUsbData: (callback) => {
    ipcRenderer.on("usb-data", (event, data) => callback(data));
    return () => ipcRenderer.removeListener("usb-data", callback);
  },
});

// Expose a simple test API
contextBridge.exposeInMainWorld("electronTest", {
  ping: () => "pong",
});
