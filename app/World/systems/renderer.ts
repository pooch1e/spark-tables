import { WebGLRenderer } from 'three';

export const createRenderer = (canvas?: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({ antialias: true, canvas }) as any;

  // turn on the physically correct lighting model
  renderer.phyiscallCorrectLights = true;

  return renderer;
};
