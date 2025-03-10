interface ElectronAPI {
  // Serial port operations
  listSerialPorts: () => Promise<any[]>;
  connectSerial: (options: {
    port: string;
    baudRate: number;
  }) => Promise<{ success: boolean; message: string }>;
  disconnectSerial: () => Promise<{ success: boolean; message: string }>;
  sendSerialData: (data: string) => Promise<{ success: boolean; message: string }>;
  sendImageData: (imageData: string) => Promise<{ success: boolean; message: string }>;

  // USB operations
  listUsbDevices: () => Promise<any[]>;
  connectUsb: (deviceId: string) => Promise<{ success: boolean; message: string }>;
  disconnectUsb: () => Promise<{ success: boolean; message: string }>;

  // Event listeners
  onSerialPortsList: (callback: (ports: any[]) => void) => () => void;
  onSerialConnected: (callback: (port: string) => void) => () => void;
  onSerialError: (callback: (error: string) => void) => () => void;
  onSerialData: (callback: (data: string) => void) => () => void;
  onUsbDevicesList: (callback: (devices: any[]) => void) => () => void;
  onUsbConnected: (callback: (device: string) => void) => () => void;
  onUsbError: (callback: (error: string) => void) => () => void;
  onUsbData: (callback: (data: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
