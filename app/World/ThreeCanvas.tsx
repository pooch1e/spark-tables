import { useRef, useEffect, useState } from 'react';
import { World } from './ThreeService';
const ThreeCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    
    const world = new World(canvasRef);
  });

  return (
    <div className="div">
      <canvas></canvas>
    </div>
  );
};
