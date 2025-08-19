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

  return tetrahedron;
};
