"use client";

import { useState, useEffect, useCallback } from "react";

// Define types for USB devices and serial ports
interface UsbDevice {
  vendorId: number;
  productId: number;
  manufacturer?: string;
  product?: string;
  serialNumber?: string;
}

interface SerialPort {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

export function useUsbSerial() {
  const [usbDevices, setUsbDevices] = useState<UsbDevice[]>([]);
  const [serialPorts, setSerialPorts] = useState<SerialPort[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<UsbDevice | null>(null);
  const [connectedPort, setConnectedPort] = useState<SerialPort | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  // Check if running in Electron environment
  useEffect(() => {
    // This will only run on the client side
    const checkElectron = () => {
      console.log("Window object keys:", Object.keys(window));
      console.log("electronTest available:", !!window.electronTest);
      console.log("electronAPI available:", !!window.electronAPI);

      if (window.electronTest) {
        console.log("Test ping result:", window.electronTest.ping());
      }

      setIsElectron(!!window.electronAPI);
      if (!window.electronAPI) {
        console.warn("Electron API not available - running in browser mode");
        setError("Electron API not available - running in browser mode");
      } else {
        console.log("Electron API available:", Object.keys(window.electronAPI));
        setError(null);
      }
    };

    // Delay the check to ensure the API has time to load
    const timer = setTimeout(checkElectron, 500);
    return () => clearTimeout(timer);
  }, []);

  // Get USB devices
  const getUsbDevices = useCallback(async () => {
    if (!window.electronAPI) {
      setError("Electron API not available - cannot list USB devices");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const devices = await window.electronAPI.listUsbDevices();
      setUsbDevices(devices);
    } catch (err) {
      console.error("Error listing USB devices:", err);
      setError(`Failed to list USB devices: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get serial ports
  const getSerialPorts = useCallback(async () => {
    if (!window.electronAPI) {
      setError("Electron API not available - cannot list serial ports");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const ports = await window.electronAPI.listSerialPorts();
      setSerialPorts(ports);
    } catch (err) {
      console.error("Error listing serial ports:", err);
      setError(`Failed to list serial ports: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect to USB device
  const connectUsbDevice = useCallback(
    async (vendorId: number, productId: number) => {
      if (!window.electronAPI) {
        setError("Electron API not available - cannot connect to USB device");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const deviceId = `${vendorId.toString(16)}:${productId.toString(16)}`;
        const result = await window.electronAPI.connectUsb(deviceId);

        if (result.success) {
          const device = usbDevices.find(
            (d) => d.vendorId === vendorId && d.productId === productId,
          );
          if (device) {
            setConnectedDevice(device);
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error("Error connecting to USB device:", err);
        setError(
          `Failed to connect to USB device: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setLoading(false);
      }
    },
    [usbDevices],
  );

  // Connect to serial port
  const connectSerialPort = useCallback(
    async (path: string) => {
      if (!window.electronAPI) {
        setError("Electron API not available - cannot connect to serial port");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await window.electronAPI.connectSerial({
          port: path,
          baudRate: 9600, // Default baud rate, you might want to make this configurable
        });

        if (result.success) {
          const port = serialPorts.find((p) => p.path === path);
          if (port) {
            setConnectedPort(port);
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error("Error connecting to serial port:", err);
        setError(
          `Failed to connect to serial port: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setLoading(false);
      }
    },
    [serialPorts],
  );

  // Send data to serial port
  const sendSerialData = useCallback(
    async (data: string) => {
      if (!window.electronAPI) {
        setError("Electron API not available - cannot send data");
        return;
      }

      if (!connectedPort) {
        setError("No serial port connected");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await window.electronAPI.sendSerialData(data);

        if (!result.success) {
          setError(result.message);
        }

        return result;
      } catch (err) {
        console.error("Error sending data:", err);
        setError(`Failed to send data: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    },
    [connectedPort],
  );

  // Set up event listeners when the component mounts
  useEffect(() => {
    if (!window.electronAPI) {
      return;
    }

    // Set up event listeners
    const removeSerialDataListener = window.electronAPI.onSerialData((data) => {
      console.log("Received serial data:", data);
      // You might want to handle received data here
    });

    const removeSerialErrorListener = window.electronAPI.onSerialError((errorMsg) => {
      console.error("Serial error:", errorMsg);
      setError(errorMsg);
    });

    // Clean up event listeners when component unmounts
    return () => {
      removeSerialDataListener();
      removeSerialErrorListener();
    };
  }, []);

  // Initial load of devices and ports
  useEffect(() => {
    if (isElectron) {
      getUsbDevices();
      getSerialPorts();
    }
  }, [isElectron, getUsbDevices, getSerialPorts]);

  return {
    usbDevices,
    serialPorts,
    loading,
    error,
    connectedDevice,
    connectedPort,
    isElectron,
    getUsbDevices,
    getSerialPorts,
    connectUsbDevice,
    connectSerialPort,
    sendSerialData,
  };
}
