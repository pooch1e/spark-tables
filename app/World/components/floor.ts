import { PlaneGeometry, MeshStandardMaterial, Mesh } from 'three';

export const createFloor = () => {
  const geometry = new PlaneGeometry(50, 50);
  const material = new MeshStandardMaterial({ color: 0xffff00 });
  const floor = new Mesh(geometry, material);

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -10;
  floor.receiveShadow = true;

  return floor;
};
