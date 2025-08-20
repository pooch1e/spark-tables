import {
  TetrahedronGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  TextureLoader,
} from 'three';

const radiansPerSecond = MathUtils.degToRad(30);
export const createTetrahedron = () => {
  const geometry = new TetrahedronGeometry(2, 0);

  const createMaterial = () => {
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

  const material = createMaterial();
  const tetrahedron = new Mesh(geometry, material);

  tetrahedron.rotation.set(-0.5, -0.1, 0.8);

  // this method will be called once per frame
  tetrahedron.tick = (delta) => {
    // increase the tetrahedron's rotation each frame
    tetrahedron.rotation.z += radiansPerSecond * delta;
    tetrahedron.rotation.x += radiansPerSecond * delta;
    tetrahedron.rotation.y += radiansPerSecond * delta;
  };

  return tetrahedron;
};
