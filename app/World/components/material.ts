import { MeshStandardMaterial, TextureLoader } from "three";

export const createMaterial = () => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load('/textures/damascus-steel_albedo.png');

    const spec = {
      color: 'blue',
    };
    const material = new MeshStandardMaterial({
      map: texture,
      metalness: 0.7,
      roughness: 0.3,
    });
    // const normalMaterial = new MeshBasicMaterial({
    //   map: texture,
    // });
    // material.metalness = 1;
    return material;
  };