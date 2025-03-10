import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import usb from "usb";
import { SerialPort } from "serialport";
import { fileURLToPath } from "url";
import log from "electron-log";

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// Create the browser window
function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");
  console.log("Preload path:", preloadPath); // Log the path to verify it's correct

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
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

// USB Device Handling
ipcMain.handle("get-usb-devices", async () => {
  try {
    const devices = usb.getDeviceList();
    return devices.map((device) => ({
      vendorId: device.deviceDescriptor.idVendor,
      productId: device.deviceDescriptor.idProduct,
      manufacturer: device.deviceDescriptor.iManufacturer,
      product: device.deviceDescriptor.iProduct,
    }));
  } catch (error) {
    console.error("Error getting USB devices:", error);
    return [];
  }
});

// Serial Port Handling
ipcMain.handle("get-serial-ports", async () => {
  try {
    return await SerialPort.list();
  } catch (error) {
    console.error("Error getting serial ports:", error);
    return [];
  }
});

// Connect to USB device
ipcMain.handle("connect-usb-device", async (event, { vendorId, productId }) => {
  try {
    const device = usb.findByIds(vendorId, productId);
    if (!device) {
      throw new Error("Device not found");
    }

    device.open();
    return { success: true, message: "Device connected successfully" };
  } catch (error) {
    console.error("Error connecting to USB device:", error);
    return { success: false, message: error.message };
  }
});

// Connect to serial port
ipcMain.handle("connect-serial-port", async (event, { path, baudRate }) => {
  try {
    const port = new SerialPort({ path, baudRate: baudRate || 9600 });

    // Store the port reference for later use
    global.serialPort = port;

    return { success: true, message: "Serial port connected successfully" };
  } catch (error) {
    console.error("Error connecting to serial port:", error);
    return { success: false, message: error.message };
  }
});

// Send data to serial port
ipcMain.handle("send-serial-data", async (event, data) => {
  try {
    if (!global.serialPort) {
      throw new Error("Serial port not connected");
    }

    global.serialPort.write(data);
    return { success: true, message: "Data sent successfully" };
  } catch (error) {
    console.error("Error sending data to serial port:", error);
    return { success: false, message: error.message };
  }
});

// List all USB devices
ipcMain.handle("list-usb-devices", () => {
  try {
    const devices = usb.getDeviceList();
    log.info(`Found ${devices.length} USB devices`);

    // Map devices to a more readable format
    const deviceList = devices.map((device) => ({
      vendorId: device.deviceDescriptor.idVendor,
      productId: device.deviceDescriptor.idProduct,
      manufacturer: device.deviceDescriptor.iManufacturer,
      product: device.deviceDescriptor.iProduct,
      serialNumber: device.deviceDescriptor.iSerialNumber,
    }));

    if (mainWindow) {
      mainWindow.webContents.send("usb-devices-list", deviceList);
    }

    return deviceList;
  } catch (err) {
    log.error("Error listing USB devices:", err);
    return [];
  }
});

// Store active USB device
let activeUsbDevice = null;

// Connect to USB device
ipcMain.handle("connect-usb", async (event, deviceId) => {
  try {
    const [vendorId, productId] = deviceId.split(":").map((id) => parseInt(id, 16));
    const device = usb.findByIds(vendorId, productId);

    if (!device) {
      return { success: false, message: "Device not found" };
    }

    // Close existing connection if any
    if (activeUsbDevice) {
      try {
        activeUsbDevice.close();
      } catch (e) {
        log.warn("Error closing previous USB device:", e);
      }
    }

    device.open();
    activeUsbDevice = device;

    log.info(`Connected to USB device: ${deviceId}`);

    if (mainWindow) {
      mainWindow.webContents.send("usb-connected", deviceId);
    }

    return { success: true, message: `Connected to USB device: ${deviceId}` };
  } catch (err) {
    log.error("Error connecting to USB device:", err);
    return { success: false, message: err.message };
  }
});

// Disconnect from USB device
ipcMain.handle("disconnect-usb", async () => {
  try {
    if (activeUsbDevice) {
      activeUsbDevice.close();
      activeUsbDevice = null;
      return { success: true, message: "Disconnected from USB device" };
    }
    return { success: false, message: "No active USB connection" };
  } catch (err) {
    log.error("Error disconnecting from USB device:", err);
    return { success: false, message: err.message };
  }
});

// Add this to get __dirname equivalent in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
