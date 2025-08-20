import {
  TetrahedronGeometry,
  MeshBasicMaterial,
  Mesh,
  MeshStandardMaterial,
} from 'three';
export const createTetrahedron = () => {
  const spec = {
    color: 'purple',
  };
  const geometry = new TetrahedronGeometry(2, 0);
  const material = new MeshStandardMaterial(spec);
  const tetrahedron = new Mesh(geometry, material);

  tetrahedron.rotation.set(-0.5, -0.1, 0.8);

  // this method will be called once per frame
  tetrahedron.tick = () => {
    // increase the cube's rotation each frame
    tetrahedron.rotation.z += 0.01;
    tetrahedron.rotation.x += 0.01;
    tetrahedron.rotation.y += 0.01;
  };

  return tetrahedron;
};
