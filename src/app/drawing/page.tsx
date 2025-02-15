// app/drawing/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter(); // Use Next.js router for navigation
  const [penColor, setPenColor] = useState<string>("black");
  const [canvasColor, setCanvasColor] = useState<string>("#FFFFFF");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Initialize canvas dimensions and background color
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load saved drawing from localStorage
    const savedDrawing = localStorage.getItem("savedDrawing");
    if (savedDrawing) {
      const img = new Image();
      img.src = savedDrawing;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Drawing functionality
    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      ctx.beginPath();
      ctx.strokeStyle = penColor; // Use selected pen color
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      [lastX, lastY] = [e.offsetX, e.offsetY];

      // Auto-save drawing to localStorage
      saveDrawing();
    };

    const stopDrawing = () => {
      isDrawing = false;
      saveDrawing();
    };

    // Add event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Auto-save every 5 seconds
    const autoSaveInterval = setInterval(saveDrawing, 5000);

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      clearInterval(autoSaveInterval);
    };

    // Save drawing to localStorage
    function saveDrawing() {
      const dataURL = canvas.toDataURL();
      localStorage.setItem("savedDrawing", dataURL);
    }
  }, [penColor, canvasColor]);

  const saveDrawing = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL("image/png"); // Converts the canvas content to a base64 image URL
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "drawing.png"; // Set the filename for the download
      link.click();
    }
  };

  // Function to fill the canvas with a selected color
  const fillCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveDrawing(); // Save the filled canvas
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative max-w-7xl mx-auto p-4">
          {/* Canvas Area */}
          <div className="bg-white rounded-lg shadow-md h-[600px] border border-gray-200 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
            ></canvas>
          </div>

          {/* Toolbar */}
          <div className="mt-4 flex justify-around">
            {/* Pen Tool */}
            <button
              className="p-4 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition duration-200"
              title="Pen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>

            {/* Brush Tool */}
            <button
              className="p-4 bg-gray-200 text-gray-600 rounded-full shadow hover:bg-gray-300 transition duration-200"
              title="Brush"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
            </button>

            {/* Pen Color Picker */}
            <input
              type="color"
              value={penColor}
              onChange={(e) => setPenColor(e.target.value)}
              className="p-4 rounded-full shadow cursor-pointer"
              title="Pen Color"
            />

            {/* Canvas Fill Color */}
            <button
              onClick={fillCanvas}
              className="p-4 bg-yellow-400 text-gray-700 rounded-full shadow hover:bg-yellow-500 transition duration-200"
              title="Fill Canvas"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9z m9-4 3 3-3 3"
                />
              </svg>
            </button>

            {/* Eraser Tool */}
            <button
              className="p-4 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition duration-200"
              title="Eraser"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>

            {/* Save Button */}
            <button
              className="p-4 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition duration-200"
              title="Save"
              onClick={() => {
                if (canvasRef.current) {
                  const dataURL = canvasRef.current.toDataURL();
                  const link = document.createElement("a");
                  link.href = dataURL;
                  link.download = "drawing.png";
                  link.click();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
