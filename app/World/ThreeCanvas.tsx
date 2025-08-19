import { useRef, useEffect, useState } from 'react';
import { World } from './ThreeService';
const ThreeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const world = new World(canvasRef);
    world.render();
  }, []);

  return (
    <div className="div">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
