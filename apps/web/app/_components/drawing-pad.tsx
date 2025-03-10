"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Type,
  Eraser,
  Square,
  Circle,
  Image as ImageIcon,
  Download,
  Trash2,
} from "lucide-react";
import { Canvas, IText, Rect, Circle as FabricCircle, Image, PencilBrush } from "fabric";

interface DrawingPadProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
}

export const DrawingPad: React.FC<DrawingPadProps> = ({ width = 600, height = 400, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [activeMode, setActiveMode] = useState<
    "draw" | "text" | "eraser" | "rect" | "circle" | "select"
  >("select");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [color, setColor] = useState<string>("#000000");
  const [textInput, setTextInput] = useState<string>("");
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

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
      fontFamily: "Arial",
      fontSize: brushSize * 5,
      fill: color,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    setTextInput("");
    setActiveMode("select");
    setShowTextInput(false);
  };

  // Add rectangle to canvas
  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;

    const rect = new Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      fill: "transparent",
      stroke: color,
      strokeWidth: brushSize / 2,
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    setActiveMode("select");
  };

  // Add circle to canvas
  const addCircle = () => {
    if (!fabricCanvasRef.current) return;

    const circle = new FabricCircle({
      left: 50,
      top: 50,
      radius: 50,
      fill: "transparent",
      stroke: color,
      strokeWidth: brushSize / 2,
    });

    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    setActiveMode("select");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvasRef.current || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;

      const imgUrl = event.target.result.toString();

      Image.fromURL(imgUrl, (img: any) => {
        // Scale image to fit within canvas while maintaining aspect ratio
        const maxWidth = width * 0.8;
        const maxHeight = height * 0.8;

        if (img.width && img.height) {
          if (img.width > maxWidth || img.height > maxHeight) {
            const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
            img.scale(scaleFactor);
          }
        }

        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.add(img);
          fabricCanvasRef.current.setActiveObject(img);
          setActiveMode("select");
        }
      });
    };

    reader.readAsDataURL(file);
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

        <button
          onClick={() => {
            handleToolSelect("rect");
            addRectangle();
          }}
          className={`rounded-lg p-2 ${
            activeMode === "rect" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          title="Add Rectangle"
        >
          <Square size={24} />
        </button>

        <button
          onClick={() => {
            handleToolSelect("circle");
            addCircle();
          }}
          className={`rounded-lg p-2 ${
            activeMode === "circle" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          title="Add Circle"
        >
          <Circle size={24} />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg bg-gray-200 p-2"
          title="Upload Image"
        >
          <ImageIcon size={24} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
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

          <button
            onClick={saveCanvas}
            className="rounded-lg bg-green-500 px-3 py-2 text-white hover:bg-green-600"
            title="Save Design"
          >
            Save
          </button>
        </div>
      </div>

      {/* Text Input */}
      {showTextInput && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text..."
            className="flex-1 rounded-lg border border-gray-300 p-2"
          />
          <button
            onClick={addText}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Text
          </button>
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
};
