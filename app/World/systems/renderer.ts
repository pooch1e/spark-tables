import { WebGLRenderer } from 'three';

export const createRenderer = (canvas?: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({ antialias: true, canvas }) as any;

  // turn on the physically correct lighting model
  renderer.phyiscallCorrectLights = true;

  // start the loop
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  return renderer;
};
