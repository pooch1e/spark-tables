import * as CANNON from 'cannon-es';
import * as THREE from 'three';
export const createTetrahedronFromGeometry = (
  size: number = 2
): CANNON.Body => {
  console.log('Creating tetrahedron physics body with size:', size);

  // Create Three.js tetrahedron geometry for reference
  const geometry = new THREE.TetrahedronGeometry(size / 2, 0);

  // Extract vertices from the geometry
  const vertices: CANNON.Vec3[] = [];
  const positions = geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    vertices.push(
      new CANNON.Vec3(positions[i], positions[i + 1], positions[i + 2])
    );
  }

  // Extract faces from geometry indices
  const faces: number[][] = [];
  if (geometry.index) {
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3) {
      faces.push([indices[i], indices[i + 1], indices[i + 2]]);
    }
  } else {
    // If no index, create faces from vertex order
    for (let i = 0; i < vertices.length; i += 3) {
      faces.push([i, i + 1, i + 2]);
    }
  }

  console.log('Tetrahedron vertices:', vertices.length);
  console.log('Tetrahedron faces:', faces.length);

  try {
    const shape = new CANNON.ConvexPolyhedron({ vertices, faces });

    const body = new CANNON.Body({
      mass: 5,
      shape: shape,
      position: new CANNON.Vec3(0, 10, 0),
    });

    console.log('Successfully created tetrahedron physics body');
    return body;
  } catch (error) {
    console.error('Failed to create ConvexPolyhedron:', error);
    return createSimpleTetrahedron(size);
  }
};

export const createSimpleTetrahedron = (size: number): CANNON.Body => {
  console.log('Creating simple manual tetrahedron');

  // Simple tetrahedron vertices (regular tetrahedron inscribed in cube)
  const s = size / 2;
  const vertices = [
    new CANNON.Vec3(s, s, s),
    new CANNON.Vec3(-s, -s, s),
    new CANNON.Vec3(-s, s, -s),
    new CANNON.Vec3(s, -s, -s),
  ];

  // Faces with correct winding
  const faces = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [1, 3, 2],
  ];

  try {
    const shape = new CANNON.ConvexPolyhedron({ vertices, faces });

    return new CANNON.Body({
      mass: 5,
      shape: shape,
      position: new CANNON.Vec3(0, 10, 0),
    });
  } catch (error) {
    console.error('Even simple tetrahedron failed, using box:', error);
    return createBoxFallback(size);
  }
};

// Final fallback: box shape
export const createBoxFallback = (size: number): CANNON.Body => {
  console.log('Using box fallback');

  const boxShape = new CANNON.Box(
    new CANNON.Vec3(size / 2, size / 2, size / 2)
  );

  return new CANNON.Body({
    mass: 5,
    shape: boxShape,
    position: new CANNON.Vec3(0, 10, 0),
  });
};
