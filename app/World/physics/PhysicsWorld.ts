import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';

export class PhysicsWorld {
  private world: CANNON.World;
  private scene: THREE.Scene;
  private timeStep: number = 1 / 60; // 60 FPS
  private lastCallTime: number = 0;
  public cannonDebugger: any;

  constructor(scene: THREE.Scene) {
    this.world = new CANNON.World();
    this.scene = scene;
  }

  init(showDebugWireframes: boolean = true) {
    // Set gravity
    this.world.gravity.set(0, -9.82, 0);

    // Add solver settings for better stability
    this.world.solver.iterations = 10;
    this.world.solver.tolerance = 0.0001;

    // Plane to land on
    this.addGround();

    // Add tetrahedron body to world
    this.world.addBody(this.addBody());

    // Set up debug renderer if requested
    if (showDebugWireframes) {
      this.cannonDebugger = new CannonDebugger(this.scene, this.world, {
        color: 0x00ff00, // Green wireframes
        scale: 1.0,
      });
    }
  }

  private addGround() {
    // Create a ground plane for the dice to land on
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0, // Static body
      shape: groundShape,
    });

    // Rotate the plane to be horizontal (ground)
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundBody.position.set(0, 0, 0);

    this.world.addBody(groundBody);
  }

  private addBody() {
    // Define the vertices of a regular tetrahedron (d4)
    const vertices = [
      new CANNON.Vec3(1, 1, 1), // vertex 0
      new CANNON.Vec3(-1, -1, 1), // vertex 1
      new CANNON.Vec3(-1, 1, -1), // vertex 2
      new CANNON.Vec3(1, -1, -1), // vertex 3
    ];

    // Define faces with CORRECT counter-clockwise winding order
    // Each face should have vertices ordered CCW when viewed from OUTSIDE
    const faces = [
      [0, 2, 1], // Face 1: Fixed winding order
      [0, 3, 2], // Face 2: Fixed winding order
      [0, 1, 3], // Face 3: Fixed winding order
      [1, 2, 3], // Face 4: Fixed winding order
    ];

    // Create the convex polyhedron shape
    const tetrahedronShape = new CANNON.ConvexPolyhedron({
      vertices: vertices,
      faces: faces,
    });

    // Create the physics body
    const tetrahedronBody = new CANNON.Body({
      mass: 5, // kg
      shape: tetrahedronShape,
    });

    // Set position above ground
    tetrahedronBody.position.set(0, 10, 0);

    // Add some initial rotation for realistic dice roll
    // tetrahedronBody.angularVelocity.set(
    //   Math.random() * 5 - 2.5,
    //   Math.random() * 5 - 2.5,
    //   Math.random() * 5 - 2.5
    // );

    return tetrahedronBody;
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // Calculate time since last call
    const time = performance.now() / 1000;
    const deltaTime = time - this.lastCallTime;
    this.lastCallTime = time;

    // Step the physics simulation
    this.world.fixedStep(this.timeStep, deltaTime);

    // Update debug renderer if it exists
    if (this.cannonDebugger) {
      this.cannonDebugger.update();
    }
  };

  toggleDebugRenderer() {
    if (this.cannonDebugger) {
      this.cannonDebugger.enabled = !this.cannonDebugger.enabled;
    }
  }

  start() {
    this.lastCallTime = performance.now() / 1000;
    this.animate();
  }

  // Get world
  getWorld(): CANNON.World {
    return this.world;
  }

  // Get all bodies
  getBodies(): CANNON.Body[] {
    return this.world.bodies;
  }
}
