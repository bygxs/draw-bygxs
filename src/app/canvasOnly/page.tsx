// pages/index.js
"use client"
import { useState, useRef } from 'react';
import { SketchPicker } from 'react-color';

const Home = () => {
  const [canvasColor, setCanvasColor] = useState('#ffffff'); // Default color
  const canvasRef = useRef(null);

  const handleColorChange = (color) => {
    setCanvasColor(color.hex);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SketchPicker
        color={canvasColor}
        onChangeComplete={handleColorChange}
        className="mb-4"
      />
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: canvasColor }}
        className="border w-full h-full max-w-md"
      />
    </div>
  );
};

export default Home;

