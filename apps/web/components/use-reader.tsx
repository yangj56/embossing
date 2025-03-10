"use client";

import { useUsbSerial } from "@/app/hooks/useUsbSerial";
import { useState, useEffect } from "react";

export function UseReader() {
  const {
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
  } = useUsbSerial();

  const [message, setMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Display a status message when the component mounts
  useEffect(() => {
    if (isElectron) {
      setStatusMessage("Electron API is available");
    } else {
      setStatusMessage("Electron API is not available - running in browser mode");
    }
  }, [isElectron]);

  const handleSendData = async () => {
    if (message.trim()) {
      const result = await sendSerialData(message);
      if (result?.success) {
        setStatusMessage(`Sent: ${message}`);
      }
      setMessage("");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-8 font-sans">
      <div className="w-full max-w-6xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold">Electron + Next.js USB App</h1>

        {statusMessage && (
          <div className="mb-4 rounded-lg bg-blue-100 p-4 text-center text-blue-700">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-center text-red-700">{error}</div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-all dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold">USB Devices</h2>
            <button
              onClick={getUsbDevices}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              Refresh USB Devices
            </button>

            {loading && <p className="mt-4">Loading...</p>}

            <div className="mt-4">
              {usbDevices.length === 0 ? (
                <p>No USB devices found</p>
              ) : (
                <ul className="space-y-4">
                  {usbDevices.map((device, index) => (
                    <li
                      key={index}
                      className="flex flex-col justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center"
                    >
                      <div>
                        <strong>Vendor ID:</strong> {device.vendorId.toString(16)}
                        <br />
                        <strong>Product ID:</strong> {device.productId.toString(16)}
                        <br />
                        <strong>Manufacturer:</strong> {device.manufacturer || "Unknown"}
                        <br />
                        <strong>Product:</strong> {device.product || "Unknown"}
                      </div>
                      <button
                        onClick={() => connectUsbDevice(device.vendorId, device.productId)}
                        disabled={loading}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 md:mt-0"
                      >
                        Connect
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-all dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold">Serial Ports</h2>
            <button
              onClick={getSerialPorts}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              Refresh Serial Ports
            </button>

            {loading && <p className="mt-4">Loading...</p>}

            <div className="mt-4">
              {serialPorts.length === 0 ? (
                <p>No serial ports found</p>
              ) : (
                <ul className="space-y-4">
                  {serialPorts.map((port, index) => (
                    <li
                      key={index}
                      className="flex flex-col justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center"
                    >
                      <div>
                        <strong>Path:</strong> {port.path}
                        <br />
                        {port.manufacturer && (
                          <>
                            <strong>Manufacturer:</strong> {port.manufacturer}
                            <br />
                          </>
                        )}
                        {port.serialNumber && (
                          <>
                            <strong>Serial Number:</strong> {port.serialNumber}
                            <br />
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => connectSerialPort(port.path)}
                        disabled={loading}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 md:mt-0"
                      >
                        Connect
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-all dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">Send Data</h2>
          {connectedPort ? (
            <div className="w-full">
              <p>
                Connected to: <strong>{connectedPort.path}</strong>
              </p>
              <div className="mt-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message to send"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <button
                  onClick={handleSendData}
                  disabled={loading || !message.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <p>Connect to a serial port to send data</p>
          )}
        </div>

        {/* Example of using the monospace font */}
        <div className="mt-8 rounded-lg bg-gray-100 p-4 font-mono dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold">Device Information</h3>
          <pre className="overflow-x-auto">
            {connectedDevice && JSON.stringify(connectedDevice, null, 2)}
            {connectedPort && JSON.stringify(connectedPort, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
