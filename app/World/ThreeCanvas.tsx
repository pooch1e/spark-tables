'use client';
import { useRef, useEffect } from 'react';
import { World } from './World';
export const ThreeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const world = new World(canvasRef);
    world.render();

    return () => {
      world.dispose(); // ensures Resizer cleans up listeners
    };
  }, []);

  return (
    <div className="div">
      <p>canvas here</p>
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};
