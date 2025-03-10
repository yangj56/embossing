"use client";

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Pencil, Type, Eraser, Download } from "lucide-react";
import { Canvas, IText, PencilBrush } from "fabric";

interface DrawingPadProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  hideSaveButton?: boolean;
}

// Available fonts for text
const AVAILABLE_FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
] as const;

// Use forwardRef to allow parent components to access this component's methods
export const DrawingPad = forwardRef<{ saveCanvas: () => string | null }, DrawingPadProps>(
  ({ width = 600, height = 400, onSave, hideSaveButton = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const [activeMode, setActiveMode] = useState<"draw" | "text" | "eraser" | "select">("select");
    const [brushSize, setBrushSize] = useState<number>(5);
    const [color, setColor] = useState<string>("#000000");
    const [textInput, setTextInput] = useState<string>("");
    const [showTextInput, setShowTextInput] = useState<boolean>(false);
    const [selectedFont, setSelectedFont] = useState<string>(AVAILABLE_FONTS[0].value);

    // Expose the saveCanvas method to parent components
    useImperativeHandle(ref, () => ({
      saveCanvas: () => {
        if (!fabricCanvasRef.current) return null;

        // Convert canvas to data URL (PNG format)
        const dataUrl = fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2,
        });

        // Call the onSave callback if provided
        if (onSave) {
          onSave(dataUrl);
        }

        return dataUrl;
      },
    }));

    // Initialize Fabric.js canvas
    useEffect(() => {
      if (canvasRef.current && !fabricCanvasRef.current) {
        const canvas = new Canvas(canvasRef.current, {
          width,
          height,
          backgroundColor: "#ffffff",
          isDrawingMode: false,
        });
        // Set up drawing brush
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = color;

        fabricCanvasRef.current = canvas;

        // Clean up on unmount
        return () => {
          canvas.dispose();
          fabricCanvasRef.current = null;
        };
      }
    }, [width, height]);

    // Update brush when settings change
    useEffect(() => {
      if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
        fabricCanvasRef.current.freeDrawingBrush.color = color;
      }
    }, [brushSize, color]);

    // Handle mode changes
    useEffect(() => {
      if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return;

      const canvas = fabricCanvasRef.current;

      // Set drawing mode based on active tool
      canvas.isDrawingMode = activeMode === "draw" || activeMode === "eraser";

      // Configure eraser
      if (activeMode === "eraser" && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = brushSize * 2;
        canvas.freeDrawingBrush.color = "#ffffff";
      } else if (activeMode === "draw" && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = color;
      }

      // Set selection mode
      if (activeMode === "select") {
        canvas.selection = true;
        canvas.forEachObject((obj) => {
          obj.selectable = true;
        });
      } else {
        canvas.selection = false;
        canvas.forEachObject((obj) => {
          obj.selectable = false;
        });
      }
    }, [activeMode, brushSize, color]);

    // Handle tool selection
    const handleToolSelect = (mode: typeof activeMode) => {
      setActiveMode(mode);
      setShowTextInput(mode === "text");
    };

    // Add text to canvas
    const addText = () => {
      if (!fabricCanvasRef.current || !textInput.trim()) return;

      const text = new IText(textInput, {
        left: 50,
        top: 50,
        fontFamily: selectedFont.split(",")[0]?.trim() || "Arial", // Use first font in the font-family list
        fontSize: brushSize * 5,
        fill: color,
      });

      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      setTextInput("");
      setActiveMode("select");
      setShowTextInput(false);
    };

    // Clear canvas
    const clearCanvas = () => {
      if (!fabricCanvasRef.current) return;

      if (confirm("Are you sure you want to clear the canvas?")) {
        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.backgroundColor = "#ffffff";
      }
    };

    // Save canvas
    const saveCanvas = () => {
      if (!fabricCanvasRef.current) return;

      // Convert canvas to data URL (PNG format)
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });

      if (onSave) {
        onSave(dataUrl);
      } else {
        // If no onSave callback, download the image
        const link = document.createElement("a");
        link.download = "embossing-design.png";
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tool Selection */}
          <button
            onClick={() => handleToolSelect("select")}
            className={`rounded-lg p-2 ${
              activeMode === "select" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            title="Select"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
              <path d="m13 13 6 6" />
            </svg>
          </button>

          <button
            onClick={() => handleToolSelect("draw")}
            className={`rounded-lg p-2 ${
              activeMode === "draw" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            title="Draw"
          >
            <Pencil size={24} />
          </button>

          <button
            onClick={() => handleToolSelect("text")}
            className={`rounded-lg p-2 ${
              activeMode === "text" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            title="Add Text"
          >
            <Type size={24} />
          </button>

          <button
            onClick={() => handleToolSelect("eraser")}
            className={`rounded-lg p-2 ${
              activeMode === "eraser" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            title="Eraser"
          >
            <Eraser size={24} />
          </button>

          <div className="ml-2 flex items-center space-x-2">
            <label htmlFor="brushSize" className="text-sm">
              Size:
            </label>
            <input
              id="brushSize"
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="colorPicker" className="text-sm">
              Color:
            </label>
            <input
              id="colorPicker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 cursor-pointer"
            />
          </div>

          <div className="ml-auto flex space-x-2">
            <button
              onClick={clearCanvas}
              className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
              title="Clear Canvas"
            >
              Clear
            </button>

            {/* Only show Save button if not hidden */}
            {!hideSaveButton && (
              <button
                onClick={saveCanvas}
                className="rounded-lg bg-green-500 px-3 py-2 text-white hover:bg-green-600"
                title="Save Design"
              >
                <Download size={24} className="mr-1 inline" />
                Save
              </button>
            )}
          </div>
        </div>

        {/* Text Input */}
        {showTextInput && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="flex-1 rounded-lg border border-gray-300 p-2"
              />
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="rounded-lg border border-gray-300 p-2"
              >
                {AVAILABLE_FONTS.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addText}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Add Text
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Preview:{" "}
              <span style={{ fontFamily: selectedFont }}>{textInput || "Sample Text"}</span>
            </div>
          </div>
        )}

        {/* Canvas Container */}
        <div
          className="relative border border-gray-300"
          style={{
            width: `${width + 10}px`,
            height: `${height + 10}px`,
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
    );
  },
);

// Add display name for better debugging
DrawingPad.displayName = "DrawingPad";
