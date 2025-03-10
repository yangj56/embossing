"use client";

import React, { useState, useRef } from "react";
import { DrawingPad } from "./drawing-pad";

type Props = {
  apiUrl: string;
};

type Model = "engraving" | "embroidery";

export function FrontKiosk({ apiUrl }: Props) {
  const [userData, setUserData] = useState({
    name: "",
    contactNumber: "",
  });
  const [selectedModel, setSelectedModel] = useState<Model>("engraving");
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Create a ref to access the DrawingPad component
  const drawingPadRef = useRef<{ saveCanvas: () => string | null }>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle model selection change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value as Model);
  };

  // Helper function to check if the drawing is empty
  const isDrawingEmpty = (dataUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(true); // If we can't check, assume it's empty to be safe
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Count non-white pixels
        let nonWhitePixels = 0;
        const threshold = 5; // Tolerance for "almost white" pixels

        for (let i = 0; i < data.length; i += 4) {
          // Check if pixel is not white (allowing for some tolerance)
          // A pixel is non-white if any RGB channel differs significantly from 255
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (
            r &&
            g &&
            b &&
            r < 255 - threshold && // R
            g < 255 - threshold && // G
            b < 255 - threshold // B
          ) {
            nonWhitePixels++;

            // Early exit if we find enough non-white pixels
            if (nonWhitePixels > 50) {
              resolve(false);
              return;
            }
          }
        }

        // If we found very few non-white pixels, consider it empty
        resolve(nonWhitePixels < 50);
      };

      img.onerror = () => {
        resolve(true); // If we can't load the image, assume it's empty to be safe
      };

      img.src = dataUrl;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!userData.name.trim()) {
      setSubmitResult({
        success: false,
        message: "Please enter your name",
      });
      return;
    }

    if (!userData.contactNumber.trim()) {
      setSubmitResult({
        success: false,
        message: "Please enter your contact number",
      });
      return;
    }

    // Validate contact number format (optional)
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(userData.contactNumber.trim())) {
      setSubmitResult({
        success: false,
        message: "Please enter a valid contact number",
      });
      return;
    }

    // First, save the design from the drawing pad
    if (!drawingPadRef.current) {
      alert("Drawing pad not initialized");
      return;
    }

    // Get the canvas data URL from the drawing pad
    const dataUrl = drawingPadRef.current.saveCanvas();

    if (!dataUrl) {
      setSubmitResult({
        success: false,
        message: "Please create a design before submitting",
      });
      return;
    }
    console.log("dataUrl", dataUrl);
    // Check if the canvas is empty (mostly white pixels)
    const isCanvasEmpty = await isDrawingEmpty(dataUrl);
    if (isCanvasEmpty) {
      setSubmitResult({
        success: false,
        message: "Please create a design before submitting",
      });
      return;
    }

    // Set the design image
    setDesignImage(dataUrl);

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Prepare data for API submission
      const submissionData = {
        name: userData.name,
        contactNumber: userData.contactNumber,
        image: dataUrl,
        model: selectedModel,
        timestamp: new Date().toISOString(),
      };

      // Send data to API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: `Successfully sent to ${selectedModel} device!`,
        });
        // Reset form after successful submission
        setUserData({ name: "", contactNumber: "" });
        setDesignImage(null);
      } else {
        throw new Error(result.message || `Failed to send to ${selectedModel} device`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold">Create Your Design</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="contactNumber"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={userData.contactNumber}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your contact number"
              />
            </div>

            <div>
              <label htmlFor="modelSelect" className="mb-1 block text-sm font-medium text-gray-700">
                Select Model
              </label>
              <select
                id="modelSelect"
                value={selectedModel}
                onChange={handleModelChange}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="engraving">Engraving</option>
                <option value="embroidery">Embroidery</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {selectedModel === "engraving"
                  ? "Engraving creates designs on hard surfaces"
                  : "Embroidery creates designs on fabric"}
              </p>
            </div>
          </div>

          {/* Drawing Pad */}
          <div className="flex w-full flex-col items-center justify-center">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Create Your Design
            </label>
            <p className="mb-4 text-sm text-gray-500">
              Use the drawing tools below to create your {selectedModel} design
            </p>
            <DrawingPad width={1200} height={500} ref={drawingPadRef} hideSaveButton={true} />
          </div>

          {/* Design Preview */}
          {designImage && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Your Design (Saved):</p>
              <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-300">
                <img src={designImage} alt="Your design" className="h-full w-full object-contain" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting
                ? "Sending..."
                : `Submit ${selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)} Design`}
            </button>

            <p className="text-sm text-gray-600">
              to save and send your design to the {selectedModel} machine
            </p>
          </div>
        </form>

        {/* Result Message */}
        {submitResult && (
          <div
            className={`mt-6 rounded-lg p-4 ${
              submitResult.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {submitResult.message}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-xl font-bold">Instructions</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Enter your name and contact number</li>
          <li>Select the model type ({selectedModel})</li>
          <li>Use the drawing tools to create your design</li>
          <li>Your design will be saved and sent to the {selectedModel} machine</li>
        </ol>
      </div>
    </div>
  );
}
