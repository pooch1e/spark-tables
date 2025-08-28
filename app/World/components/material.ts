import { MeshMatcapMaterial, TextureLoader } from 'three';

export const createMaterial = () => {
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load('/textures/3.png');

  const material = new MeshMatcapMaterial({
    map: texture,
  });

  return material;
};
