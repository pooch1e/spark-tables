import { ModelLoader } from '../../systems/GLTFloader';
import CANNON from 'cannon-es';
import * as THREE from 'three';
import { threeToCannon } from 'three-to-cannon';
export const createBodyFromModel = async (
  targetHeight: number = 2
): Promise<CANNON.Body> => {
  try {
    const loader = new ModelLoader();
    const data = await loader.load('/models/4_sided_dice.glb');
    const dice = loader.setupModel(data);

    // Get the actual height of the model
    const box = new THREE.Box3().setFromObject(dice);
    const size = new THREE.Vector3();
    box.getSize(size);

    const modelHeight = size.y; // Height of the pyramid
    const scaleFactor = targetHeight / modelHeight;

    // Convert and scale
    const result = threeToCannon(dice);

    if (!result || !result.shape) {
      throw new Error('Failed to convert model to physics shape');
    }

    // Scale the physics shape vertices
    if (result.shape instanceof CANNON.ConvexPolyhedron) {
      result.shape.vertices.forEach((vertex) => {
        vertex.x *= scaleFactor;
        vertex.y *= scaleFactor;
        vertex.z *= scaleFactor;
      });
      result.shape.updateNormals();
      result.shape.updateBoundingSphereRadius();
    }

    const diceBody = new CANNON.Body({
      mass: 5,
      shape: result.shape,
      position: new CANNON.Vec3(0, 10, 0),
    });

    return diceBody;
  } catch (err) {
    console.error('Error with three-to-cannon, using manual tetrahedron:', err);
    return createManualTetrahedronBody(2);
  }
};

const createManualTetrahedronBody = (height: number): CANNON.Body => {
  const halfHeight = height / 2;
  const baseRadius = height / Math.sqrt(3); // For equilateral triangle base

  const vertices = [
    new CANNON.Vec3(0, halfHeight, 0), // Apex
    new CANNON.Vec3(0, -halfHeight / 3, (2 * baseRadius) / 3), // Base vertex 1
    new CANNON.Vec3(-baseRadius, -halfHeight / 3, -baseRadius / 3), // Base vertex 2
    new CANNON.Vec3(baseRadius, -halfHeight / 3, -baseRadius / 3), // Base vertex 3
  ];

  const faces = [
    [0, 2, 1], // Face A-B-C
    [0, 3, 2], // Face A-D-B
    [0, 1, 3], // Face A-C-D
    [1, 2, 3], // Base face C-B-D
  ];

  const shape = new CANNON.ConvexPolyhedron({ vertices, faces });

  return new CANNON.Body({
    mass: 5,
    shape: shape,
  });
};
