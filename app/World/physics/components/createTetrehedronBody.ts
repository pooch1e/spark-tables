import * as CANNON from 'cannon-es';

export const createTetrahedron = (size: number = 2): CANNON.Body => {
  // Regular tetrahedron vertices (centered at origin)
  const h = size * Math.sqrt(2 / 3); 
  const vertices = [
    new CANNON.Vec3(0, h / 2, 0), // top vertex
    new CANNON.Vec3(-size / 2, -h / 2, size / 2), // bottom front left
    new CANNON.Vec3(size / 2, -h / 2, size / 2), // bottom front right
    new CANNON.Vec3(0, -h / 2, -size / 2), // bottom back
  ];

  // Tetrahedron faces (counter-clockwise winding)
  const faces = [
    [0, 2, 1], // top-right-left
    [0, 3, 2], // top-back-right
    [0, 1, 3], // top-left-back
    [1, 2, 3], // bottom triangle
  ];

  try {
    const shape = new CANNON.ConvexPolyhedron({ vertices, faces });
    return new CANNON.Body({
      mass: 5,
      shape,
      position: new CANNON.Vec3(0, 0, 0), //temp made 000 but normaly 0 10 0 to start in air
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
