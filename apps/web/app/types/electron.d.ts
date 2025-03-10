interface ElectronAPI {
  // USB functions
  getUsbDevices: () => Promise<UsbDevice[]>;
  connectUsbDevice: (options: { vendorId: number; productId: number }) => Promise<ConnectionResult>;

  // Serial port functions
  getSerialPorts: () => Promise<SerialPortInfo[]>;
  connectSerialPort: (options: { path: string; baudRate?: number }) => Promise<ConnectionResult>;
  sendSerialData: (data: string | Buffer) => Promise<ConnectionResult>;
}

interface UsbDevice {
  vendorId: number;
  productId: number;
  manufacturer: string;
  product: string;
}

interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

interface ConnectionResult {
  success: boolean;
  message: string;
}

interface Window {
  electron: ElectronAPI;
}

declare global {
  interface Electron {
    getUsbDevices: () => Promise<UsbDevice[]>;
    connectUsbDevice: (options: {
      vendorId: number;
      productId: number;
    }) => Promise<ConnectionResult>;

    getSerialPorts: () => Promise<SerialPortInfo[]>;
    connectSerialPort: (options: { path: string; baudRate?: number }) => Promise<ConnectionResult>;
  }
}
