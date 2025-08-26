import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { createSimpleTetrahedron } from '../../physics/components/createTetrehedronBody';

export const createBodyFromModel = async (
  targetHeight: number = 2
): Promise<CANNON.Body> => {
  console.log('Creating D4 physics body with target height:', targetHeight);

  // For a D4 dice, we want to force a tetrahedron shape regardless of the model
  // The visual model can be complex, but physics should be a simple tetrahedron
  return createPerfectTetrahedron(targetHeight);
};

// Create a perfect tetrahedron for D4 physics
const createPerfectTetrahedron = (size: number): CANNON.Body => {
  console.log('Creating perfect tetrahedron for D4 with size:', size);

  // Perfect regular tetrahedron vertices
  // This creates a tetrahedron that sits properly (one face on ground)
  const h = size * 0.8165; // Height of tetrahedron = edge * sqrt(2/3)
  const r = size * 0.5774; // Circumradius = edge * sqrt(6)/4

  const vertices = [
    // Bottom face vertices (equilateral triangle)
    new CANNON.Vec3(r, 0, r / Math.sqrt(3)), // Front vertex
    new CANNON.Vec3(-r, 0, r / Math.sqrt(3)), // Left vertex
    new CANNON.Vec3(0, 0, (-2 * r) / Math.sqrt(3)), // Back vertex
    // Top vertex
    new CANNON.Vec3(0, h, 0), // Apex
  ];

  // Faces with correct winding (counter-clockwise from outside)
  const faces = [
    [0, 1, 3], // Front face
    [1, 2, 3], // Left face
    [2, 0, 3], // Right face
    [0, 2, 1], // Bottom face (reversed for correct normal)
  ];

  console.log('Perfect tetrahedron vertices:', vertices);

  try {
    const shape = new CANNON.ConvexPolyhedron({ vertices, faces });

    const body = new CANNON.Body({
      mass: 5,
      shape: shape,
      position: new CANNON.Vec3(0, 10, 0),
    });

    console.log('Successfully created perfect tetrahedron physics body');
    return body;
  } catch (error) {
    console.error('Perfect tetrahedron failed:', error);
    return createSimpleTetrahedron(size);
  }
};

// Alternative: Create from regular tetrahedron geometry
export const createTetrahedronFromGeometry = (
  size: number = 2
): CANNON.Body => {
  // Create Three.js tetrahedron geometry
  const geometry = new THREE.TetrahedronGeometry(size, 0);

  // Extract vertices and faces
  const vertices: CANNON.Vec3[] = [];
  const faces: number[][] = [];

  // Get vertices from geometry
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    vertices.push(
      new CANNON.Vec3(positions[i], positions[i + 1], positions[i + 2])
    );
  }

  // Get faces from geometry indices
  if (geometry.index) {
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3) {
      faces.push([indices[i], indices[i + 1], indices[i + 2]]);
    }
  }

  console.log(
    'Tetrahedron from geometry - vertices:',
    vertices.length,
    'faces:',
    faces.length
  );

  const shape = new CANNON.ConvexPolyhedron({ vertices, faces });

  return new CANNON.Body({
    mass: 5,
    shape: shape,
    position: new CANNON.Vec3(0, 10, 0),
  });
};
