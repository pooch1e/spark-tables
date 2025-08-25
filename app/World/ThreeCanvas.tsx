'use client';
import { useRef, useEffect, useState } from 'react';
import { World } from './World';

export const ThreeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const worldRef = useRef<World | null>(null);

  useEffect(() => {
    if (isRunning && canvasRef.current) {
      const world = new World(canvasRef);
      world.init();
      world.start();
      worldRef.current = world;

      
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!worldRef.current) return;

        switch (event.code) {
          case 'KeyR':
            worldRef.current.rollDice();
            break;
          case 'KeyD':
            worldRef.current.toggleDebugWireframes();
            break;
          case 'Equal': // "+" key (Shift + "=" on most keyboards)
            worldRef.current.scaleDice(1.1);
            break;
          case 'Minus':
            worldRef.current.scaleDice(0.9);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        // cleanup
        document.removeEventListener('keydown', handleKeyDown);
        world.stop();
        world.dispose();
        worldRef.current = null;
      };
    }
  }, [isRunning]);

  const handleStop = () => {
    worldRef.current?.stop();
    worldRef.current?.dispose();
    worldRef.current = null;
    setIsRunning(false);
  };

  return (
    <section>
      <div className="div">
        {!isRunning && (
          <button
            className="p-2 bg-blue-500 text-white rounded mb-2"
            onClick={() => setIsRunning(true)}>
            Start Scene
          </button>
        )}

        {isRunning && (
          <div className="flex flex-col items-start">
            <button
              className="p-2 bg-red-500 text-white rounded mb-2"
              onClick={handleStop}>
              Stop Scene
            </button>
            <canvas
              ref={canvasRef}
              className="w-full h-full border border-gray-300"
            />
          </div>
        )}
      </div>
    </section>
  );
};
