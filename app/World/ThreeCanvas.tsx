'use client';
import { useRef, useEffect, useState, ReactElement } from 'react';
import { World } from './World';
export const ThreeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [buttonState, setButtonState] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const world = new World(canvasRef);
    world.start();

    return () => {
      world.dispose(); // ensures Resizer cleans up listeners
    };
  }, [buttonState]);

  return (
    <div className="div">
      {!buttonState && (
        <button
          className="p-2 bg-blue-500 text-white rounded mb-2"
          onClick={() => setButtonState(true)}>
          Start Scene
        </button>
      )}

      {buttonState && (
        <canvas
          ref={canvasRef}
          className="w-full h-full border border-gray-300"
        />
      )}
    </div>
  );
};
