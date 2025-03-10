"use client";

import React, { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { FrontKiosk } from "./front-kiosk";

type ConnectionMode = "local" | "web";

type ApiConfig = {
  mode: ConnectionMode;
  localUrl: string;
  webUrl: string;
  embossingSpeed?: number;
  embossingDuration?: number;
  embossingDepth?: number;
  acceleration?: number;
  jerk?: number;
  coolingTime?: number;
};

export function Kiosk() {
  const [showSettings, setShowSettings] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    mode: "local",
    localUrl: "http://localhost:5000/api/emboss",
    webUrl: "https://embossing-api.onrender.com/api/emboss",
    embossingSpeed: 50,
    embossingDuration: 200,
    embossingDepth: 5,
    acceleration: 1000,
    jerk: 8,
    coolingTime: 0,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

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
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="mb-8">
        <FrontKiosk apiUrl={apiConfig.mode === "local" ? apiConfig.localUrl : apiConfig.webUrl} />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="my-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white pb-2">
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

                  {/* Embossing Speed Configuration */}
                  <div>
                    <label
                      htmlFor="embossingSpeed"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Embossing Speed (mm/s)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        id="embossingSpeed"
                        min="1"
                        max="100"
                        value={apiConfig.embossingSpeed || 50}
                        onChange={(e) =>
                          setApiConfig({
                            ...apiConfig,
                            embossingSpeed: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <span className="w-12 text-center">{apiConfig.embossingSpeed || 50}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Controls how fast the embossing head moves. Lower values create more precise
                      results.
                    </p>
                  </div>

                  {/* Embossing Duration Configuration */}
                  <div>
                    <label
                      htmlFor="embossingDuration"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Embossing Duration (ms)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        id="embossingDuration"
                        min="50"
                        max="500"
                        step="10"
                        value={apiConfig.embossingDuration || 200}
                        onChange={(e) =>
                          setApiConfig({
                            ...apiConfig,
                            embossingDuration: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <span className="w-12 text-center">{apiConfig.embossingDuration || 200}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Controls how long the embossing head stays at each point. Higher values create
                      deeper impressions.
                    </p>
                  </div>

                  {/* Embossing Depth Configuration */}
                  <div>
                    <label
                      htmlFor="embossingDepth"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Embossing Depth (1-10)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        id="embossingDepth"
                        min="1"
                        max="10"
                        value={apiConfig.embossingDepth || 5}
                        onChange={(e) =>
                          setApiConfig({
                            ...apiConfig,
                            embossingDepth: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <span className="w-12 text-center">{apiConfig.embossingDepth || 5}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Controls how deep the embossing head presses into the material.
                    </p>
                  </div>

                  {/* Advanced Settings Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showAdvancedSettings ? "Hide Advanced Settings" : "Show Advanced Settings"}
                    </button>
                  </div>

                  {/* Advanced Settings */}
                  {showAdvancedSettings && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h3 className="mb-3 text-sm font-medium text-gray-700">Advanced Settings</h3>

                      {/* Acceleration Setting */}
                      <div className="mb-3">
                        <label
                          htmlFor="acceleration"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Acceleration (mm/s²)
                        </label>
                        <input
                          type="number"
                          id="acceleration"
                          min="100"
                          max="3000"
                          value={apiConfig.acceleration || 1000}
                          onChange={(e) =>
                            setApiConfig({
                              ...apiConfig,
                              acceleration: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                      </div>

                      {/* Jerk Setting */}
                      <div className="mb-3">
                        <label
                          htmlFor="jerk"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Jerk (mm/s)
                        </label>
                        <input
                          type="number"
                          id="jerk"
                          min="1"
                          max="20"
                          value={apiConfig.jerk || 8}
                          onChange={(e) =>
                            setApiConfig({
                              ...apiConfig,
                              jerk: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                      </div>

                      {/* Cooling Time */}
                      <div>
                        <label
                          htmlFor="coolingTime"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Cooling Time (s)
                        </label>
                        <input
                          type="number"
                          id="coolingTime"
                          min="0"
                          max="60"
                          step="5"
                          value={apiConfig.coolingTime || 0}
                          onChange={(e) =>
                            setApiConfig({
                              ...apiConfig,
                              coolingTime: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Time to wait between embossing operations to prevent overheating (0 to
                          disable)
                        </p>
                      </div>
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
