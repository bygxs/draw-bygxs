"use client";
import { useState, useRef, useEffect } from "react";

// Pen Icon Component
const PenIcon = ({ selected }: { selected: boolean }) => (
  <svg
    className={`w-8 h-8 ${selected ? "text-blue-500" : "text-gray-600"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={7}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

export default function DrawingPage() {
  const [penColor, setPenColor] = useState<string>("#100000"); // Default pen color is black
  const [canvasColor, setCanvasColor] = useState("#333333"); // Darker background

  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 5; // Pen stroke width
        setContext(ctx);
      }
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
    }
  }, []);

  // Start drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context || !canvasRef.current) return;
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const rect = canvasRef.current.getBoundingClientRect();
    context.beginPath();
    context.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  // Handle drawing
  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const rect = canvasRef.current.getBoundingClientRect();

    context.strokeStyle = penColor; // Use the selected pen color
    context.lineWidth = 5; // Pen stroke width
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Update pen color
  const handlePenColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenColor(e.target.value); // Set the new pen color
  };

  // Update canvas background color
  const handleCanvasColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasColor(e.target.value); // Set the new canvas background color
  };

  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      {/* Toolbar */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b flex gap-6 items-center">
        {/* Pen Tool */}
        <button className="p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <PenIcon selected={true} />
        </button>

        {/* Pen Color Picker Button - Visible */}
        <button className="p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <input
            type="color"
            value={penColor}
            onChange={handlePenColorChange}
            className="w-8 h-8 cursor-pointer"
            title="Pick Pen Color"
          />
        </button>

        {/* Canvas Color Picker Button */}
        <button className="p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <input
            type="color"
            value={canvasColor}
            onChange={handleCanvasColorChange}
            className="w-8 h-8 cursor-pointer"
            title="Pick Canvas Color"
          />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative" style={{ backgroundColor: canvasColor }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={handleDraw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={handleDraw}
        />
      </div>
    </div>
  );
}
