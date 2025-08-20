import {
  TetrahedronGeometry,
  MathUtils
  Mesh,
  MeshStandardMaterial,
} from 'three';

const radiansPerSecond = MathUtils.degToRad(30);
export const createTetrahedron = () => {
  const spec = {
    color: 'purple',
  };
  const geometry = new TetrahedronGeometry(2, 0);
  const material = new MeshStandardMaterial(spec);
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
