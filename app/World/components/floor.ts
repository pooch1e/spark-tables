import { PlaneGeometry, MeshStandardMaterial, Mesh } from 'three';

export const createFloor = () => {
  const geometry = new PlaneGeometry(100, 100);
  const material = new MeshStandardMaterial({ color: 0xffff00 });
  const floor = new Mesh(geometry, material);

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -5.3;
  floor.receiveShadow = true;

  return floor;
};
