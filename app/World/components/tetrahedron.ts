import { TetrahedronGeometry, MathUtils, Mesh } from 'three';

import { createMaterial } from './material';

const radiansPerSecond = MathUtils.degToRad(30);
export const createTetrahedron = () => {
  const geometry = new TetrahedronGeometry(2, 0);

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
