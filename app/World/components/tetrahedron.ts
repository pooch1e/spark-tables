import { TetrahedronGeometry, MeshBasicMaterial, Mesh } from 'three';
export const createTetrahedron = () => {
  const geometry = new TetrahedronGeometry(2, 0);
  const material = new MeshBasicMaterial();
  const cube = new Mesh(geometry, material);

  return cube;
};
