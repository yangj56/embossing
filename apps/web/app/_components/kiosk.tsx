"use client";

import React, { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { FrontKiosk } from "./front-kiosk";

type ConnectionMode = "local" | "web";

type ApiConfig = {
  mode: ConnectionMode;
  localUrl: string;
  webUrl: string;
};

export function Kiosk() {
  const [showSettings, setShowSettings] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    mode: "local",
    localUrl: "http://localhost:5000/api/emboss",
    webUrl: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load saved config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("embossingApiConfig");
    if (savedConfig) {
      try {
        setApiConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Failed to parse saved config:", e);
      }
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
      if (!adminPassword) {
        throw new Error("ADMIN_PASSWORD is not set");
      }

      if (password === adminPassword) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Failed to verify password");
      console.error("Password verification error:", err);
    }
  };

  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URLs
    if (apiConfig.mode === "local" && !apiConfig.localUrl) {
      setError("Local URL is required");
      return;
    }

    if (apiConfig.mode === "web" && !apiConfig.webUrl) {
      setError("Web URL is required");
      return;
    }

    try {
      // Save to localStorage
      localStorage.setItem("embossingApiConfig", JSON.stringify(apiConfig));
      setSuccessMessage("Configuration saved successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (e) {
      setError("Failed to save configuration");
      console.error("Config save error:", e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Embossing Device Manager</h1>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      </div>

      <p className="mb-6 text-gray-600">
        This page allows you to connect to and communicate with USB/Serial devices for the embossing
        kiosk. You can send commands and images to the embossing device.
      </p>

      <div className="mb-8">
        <FrontKiosk apiUrl={apiConfig.mode === "local" ? apiConfig.localUrl : apiConfig.webUrl} />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">API Configuration</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-full p-1 hover:bg-gray-200"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Admin Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                >
                  Authenticate
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleConfigSave} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">API Mode</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="apiMode"
                          value="local"
                          checked={apiConfig.mode === "local"}
                          onChange={() => setApiConfig({ ...apiConfig, mode: "local" })}
                          className="mr-2"
                        />
                        Local URL
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="apiMode"
                          value="web"
                          checked={apiConfig.mode === "web"}
                          onChange={() => setApiConfig({ ...apiConfig, mode: "web" })}
                          className="mr-2"
                        />
                        Web URL
                      </label>
                    </div>
                  </div>

                  {apiConfig.mode === "local" ? (
                    <div>
                      <label
                        htmlFor="localUrl"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Local API URL
                      </label>
                      <input
                        type="url"
                        id="localUrl"
                        value={apiConfig.localUrl}
                        onChange={(e) => setApiConfig({ ...apiConfig, localUrl: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="http://localhost:5000/api/emboss"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Use this for connecting to a Raspberry Pi on your local network
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="webUrl"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Web API URL
                      </label>
                      <input
                        type="url"
                        id="webUrl"
                        value={apiConfig.webUrl}
                        onChange={(e) => setApiConfig({ ...apiConfig, webUrl: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://your-api-endpoint.com/api/emboss"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Use this for connecting to a remote API endpoint
                      </p>
                    </div>
                  )}

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                    >
                      Save Configuration
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
                    >
                      Logout
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
