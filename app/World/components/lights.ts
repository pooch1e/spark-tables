import { DirectionalLight, AmbientLight } from 'three';
export const createLights = () => {
  const directionalLight = new DirectionalLight('white', 8);
  // move the light right, up, and towards us
  directionalLight.position.set(10, 10, 10);

  const ambientLight = new AmbientLight('white', 4);
  ambientLight.position.set(-10, -10, -10);

  return [directionalLight, ambientLight];
};
