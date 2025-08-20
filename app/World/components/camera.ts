import { PerspectiveCamera, MathUtils } from 'three';
const radiansPerSecond = MathUtils.degToRad(30);
export const createCamera = () => {
  const camera = new PerspectiveCamera(
    35, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    100 // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(0, 0, 10);

  // animate camera position on tick
  const speed = 2; // units per second
  const maxZ = 20;
  const minZ = 5;

  camera.tick = (delta) => {
    camera.position.z += speed * delta;
    if (camera.position.z > maxZ) {
      camera.position.z = minZ;
    }
  };

  return camera;
};
