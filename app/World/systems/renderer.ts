import { WebGLRenderer } from 'three';

export const createRenderer = (canvas?: HTMLCanvasElement) => {
  return new WebGLRenderer({ canvas });
};
