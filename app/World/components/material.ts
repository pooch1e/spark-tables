import { MeshStandardMaterial, TextureLoader } from 'three';

export const createMaterial = () => {
  const textureLoader = new TextureLoader();
  const colorTexture = textureLoader.load(
    '/textures/blue_metal_plate_1k/blue_metal_plate_diff_1k.jpg'
  );
  const arm = textureLoader.load(
    '/textures/blue_metal_plate_1k/blue_metal_plate_arm_1k.jpg'
  );
  const disp = textureLoader.load(
    '/textures/blue_metal_plate_1k/blue_metal_plate_disp_1k.jpg'
  );
  const normal = textureLoader.load(
    '/textures/blue_metal_plate_1k/blue_metal_plate_nor_gl_1k.jpg'
  );

  const material = new MeshStandardMaterial({
    color: 'blue',
    map: colorTexture,
    roughnessMap: arm,
    normalMap: normal,
    metalnessMap: arm,
    aoMap: arm,
    displacementMap: disp,
    displacementBias: 0.3,
    displacementScale: 0.1,
  });

  return material;
};
