"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DrawingPad } from "./drawing-pad";

type Props = {
  apiUrl: string;
};

export function FrontKiosk({ apiUrl }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    embossingDepth: 5,
    embossingSpeed: 50,
    imageType: "svg",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSaveDesign = (dataUrl: string) => {
    // Send the design to your Raspberry Pi API
    // dataUrl contains the PNG image data as a base64 string
    console.log("Design saved:", dataUrl);

    // Example: Send to API
    fetch("http://your-raspberry-pi-api/api/emboss", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: dataUrl,
        // Add other metadata as needed
      }),
    });
  };
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image file");
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Create form data for API submission
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("description", formData.description);
      apiFormData.append("embossingDepth", formData.embossingDepth.toString());
      apiFormData.append("embossingSpeed", formData.embossingSpeed.toString());
      apiFormData.append("imageType", formData.imageType);
      apiFormData.append("image", selectedFile);

      // Replace with your Raspberry Pi API endpoint
      // For local development: http://localhost:5000/api/emboss
      // For production: http://your-raspberry-pi-ip:5000/api/emboss
      const destionationUrl = `${apiUrl}/api/emboss`;

      // Send data to API
      const response = await fetch(destionationUrl, {
        method: "POST",
        body: apiFormData,
        // Don't set Content-Type header when using FormData
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: "Successfully sent to embossing device!",
        });
      } else {
        throw new Error(result.message || "Failed to send to embossing device");
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Embossing Device Manager</h1>
      <p className="mb-6 text-gray-600">
        This page allows you to send embossing jobs to your Raspberry Pi, which will control the
        embossing machine. Upload an image and set parameters for the embossing process.
      </p>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Submit Embossing Job</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Name */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Job Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter a name for this embossing job"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter any additional details about this job"
            />
          </div>

          {/* Embossing Parameters */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="embossingDepth"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Embossing Depth (1-10)
              </label>
              <input
                type="number"
                id="embossingDepth"
                name="embossingDepth"
                value={formData.embossingDepth}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="embossingSpeed"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Embossing Speed (1-100)
              </label>
              <input
                type="number"
                id="embossingSpeed"
                name="embossingSpeed"
                value={formData.embossingSpeed}
                onChange={handleInputChange}
                min="1"
                max="100"
                required
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="imageType" className="mb-1 block text-sm font-medium text-gray-700">
                Image Type
              </label>
              <select
                id="imageType"
                name="imageType"
                value={formData.imageType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="svg">SVG</option>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="mb-1 block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Image Preview:</p>
              <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-300">
                <Image src={imagePreview} alt="Preview" fill style={{ objectFit: "contain" }} />
              </div>
            </div>
          )}
          <DrawingPad width={1000} height={600} onSave={handleSaveDesign} />

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Sending..." : "Send to Embossing Device"}
            </button>
          </div>
        </form>

        {/* Result Message */}
        {submitResult && (
          <div
            className={`mt-4 rounded-lg p-4 ${
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
          <li>Enter a name for your embossing job</li>
          <li>Add an optional description with any special instructions</li>
          <li>Set the embossing depth (1-10) - higher values create deeper impressions</li>
          <li>Set the embossing speed (1-100) - lower values create more precise results</li>
          <li>Select the image type (SVG recommended for best results)</li>
          <li>Upload your image file</li>
          <li>Click send to start the job</li>
        </ol>
      </div>
    </div>
  );
}
