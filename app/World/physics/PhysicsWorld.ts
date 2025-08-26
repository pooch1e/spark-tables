import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';
import {
  createBodyFromModel,
  createTetrahedronFromGeometry,
} from '../components/helpers/threeToPhysicsBody';

export class PhysicsWorld {
  private world: CANNON.World;
  private scene: THREE.Scene;
  private timeStep: number = 1 / 60;
  private lastCallTime: number = 0;
  public cannonDebugger: any;
  private debugEnabled = true;
  private targetSize = 2; // Consistent with World class

  constructor(scene: THREE.Scene) {
    this.world = new CANNON.World();
    this.scene = scene;
  }

  async init() {
    // Set gravity
    this.world.gravity.set(0, -9.82, 0);

    // Enable contact material
    this.world.defaultContactMaterial.friction = 0.4;
    this.world.defaultContactMaterial.restitution = 0.3;

    // Plane to land on
    this.addGround();

    // Add dice body to world - wait for it to be created
    const diceBody = await this.addBody();

    //add inital velocity and angles
    diceBody.quaternion.setFromEuler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    diceBody.velocity.set(
      (Math.random() - 0.5) * 5,
      8,
      (Math.random() - 0.5) * 5
    );
    diceBody.angularVelocity.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    this.world.addBody(diceBody);

    console.log('Added dice body to physics world:', diceBody);
  }

  private addGround() {
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundBody.position.set(0, -5, 0);

    // Add ground material properties
    const groundMaterial = new CANNON.Material('ground');
    groundMaterial.friction = 0.4;
    groundMaterial.restitution = 0.3;
    groundBody.material = groundMaterial;

    this.world.addBody(groundBody);
  }

  private async addBody(): Promise<CANNON.Body> {
    try {
      console.log('Attempting to create dice body from model...');
      const diceBody = await createBodyFromModel(this.targetSize);
      diceBody.position.set(0, 10, 0);

      // Add dice material properties
      const diceMaterial = new CANNON.Material('dice');
      diceMaterial.friction = 0.4;
      diceMaterial.restitution = 0.3;
      diceBody.material = diceMaterial;

      console.log('Successfully created dice body from model');
      return diceBody;
    } catch (error) {
      console.error('Failed to create physics body from model:', error);
      console.log('Using geometric fallback...');

      // Try the geometry-based approach first
      try {
        const diceBody = createTetrahedronFromGeometry(this.targetSize);
        diceBody.position.set(0, 10, 0);

        const diceMaterial = new CANNON.Material('dice');
        diceMaterial.friction = 0.4;
        diceMaterial.restitution = 0.3;
        diceBody.material = diceMaterial;

        console.log('Successfully created dice body from geometry');
        return diceBody;
      } catch (geoError) {
        console.error('Geometry approach also failed:', geoError);
        // Final fallback to simple box
        return this.createFallbackBody();
      }
    }
  }

  private createFallbackBody(): CANNON.Body {
    console.log('Using box fallback for physics body');
    const size = this.targetSize;
    const boxShape = new CANNON.Box(
      new CANNON.Vec3(size / 2, size / 2, size / 2)
    );

    const diceBody = new CANNON.Body({
      mass: 5,
      shape: boxShape,
      position: new CANNON.Vec3(0, 10, 0),
    });

    const diceMaterial = new CANNON.Material('dice');
    diceMaterial.friction = 0.4;
    diceMaterial.restitution = 0.3;
    diceBody.material = diceMaterial;

    return diceBody;
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    const time = performance.now() / 1000;
    const deltaTime = time - this.lastCallTime;
    this.lastCallTime = time;
    this.world.fixedStep(this.timeStep, deltaTime);

    if (this.cannonDebugger && this.debugEnabled) {
      this.cannonDebugger.update();
    }
  };

  toggleDebugRenderer() {
    this.debugEnabled = !this.debugEnabled;
  }

  start() {
    this.lastCallTime = performance.now() / 1000;
    this.animate();
  }

  getWorld(): CANNON.World {
    return this.world;
  }

  getBodies(): CANNON.Body[] {
    return this.world.bodies;
  }
}
