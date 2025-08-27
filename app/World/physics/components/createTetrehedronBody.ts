import * as CANNON from 'cannon-es';

export const createTetrahedron = (size: number = 2): CANNON.Body => {
  // Regular tetrahedron vertices (centered at origin)
  const h = size * Math.sqrt(2 / 3);
  const vertices = [
    new CANNON.Vec3(0, h / 2, 0), // top vertex (0)
    new CANNON.Vec3(-size / 2, -h / 2, size / 2), // bottom front left (1)
    new CANNON.Vec3(size / 2, -h / 2, size / 2), // bottom front right (2)
    new CANNON.Vec3(0, -h / 2, -size / 2), // bottom back (3)
  ];

  // Tetrahedron faces with correct counter-clockwise winding
  // When viewed from outside the tetrahedron, vertices should be ordered CCW
  const faces = [
    [0, 1, 2], // top face: top -> left -> right (CCW from outside)
    [0, 3, 1], // left face: top -> back -> left (CCW from outside)
    [0, 2, 3], // right face: top -> right -> back (CCW from outside)
    [1, 3, 2], // bottom face: left -> back -> right (CCW from outside/below)
  ];

  try {
    const shape = new CANNON.ConvexPolyhedron({ vertices, faces });
    return new CANNON.Body({
      mass: 5,
      shape,
      position: new CANNON.Vec3(0, 10, 0), 
    });
  } catch (error) {
    console.warn('Failed to create tetrahedron, using box fallback:', error);
    // Fallback to box shape
    const boxShape = new CANNON.Box(
      new CANNON.Vec3(size / 2, size / 2, size / 2)
    );
    return new CANNON.Body({
      mass: 5,
      shape: boxShape,
      position: new CANNON.Vec3(0, 10, 0),
    });
  }
};
