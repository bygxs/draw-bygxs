"use client";
import { useState, useRef, useEffect } from 'react';

export default function DrawingPage() {
  const [selectedTool, setSelectedTool] = useState('pen');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        setContext(ctx);
      }
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    if (context && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      context.beginPath();
      context.moveTo(clientX - rect.left, clientY - rect.top);
      setIsDrawing(true);
      setStartPos({ x: clientX - rect.left, y: clientY - rect.top });
    }
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    const rect = canvasRef.current!.getBoundingClientRect();
    
    context.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : '#000000';
    context.lineWidth = selectedTool === 'eraser' ? 20 : 5;
    
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Toolbar */}
      <div className="p-4 bg-gray-100 border-b flex gap-4">
        <button
          onClick={() => setSelectedTool('pen')}
          className={`px-4 py-2 ${selectedTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-white'}`}
        >
          Pen
        </button>
        <button
          onClick={() => setSelectedTool('eraser')}
          className={`px-4 py-2 ${selectedTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white'}`}
        >
          Eraser
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseUp={() => setIsDrawing(false)}
          onMouseMove={handleDraw}
          onTouchStart={startDrawing}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={handleDraw}
        />
      </div>
    </div>
  );
}