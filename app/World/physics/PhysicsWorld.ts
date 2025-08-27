import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import CannonDebugger from 'cannon-es-debugger';
import { createTetrahedron } from '../physics/components/createTetrehedronBody';

export class PhysicsWorld {
  private world: CANNON.World;
  private scene: THREE.Scene;
  private timeStep = 1 / 60;
  private lastCallTime = 0;
  public cannonDebugger: any;
  private debugEnabled = true;
  private readonly diceSize = 2;
  private diceBody;

  constructor(scene: THREE.Scene) {
    this.world = new CANNON.World();
    this.scene = scene;
  }

  init() {
    this.setupWorld();
    this.addGround();
    this.addDice();
    // this.initDebugger();
  }

  private setupWorld() {
    this.world.gravity.set(0, -9.82, 0);
    this.world.defaultContactMaterial.friction = 0.4;
    this.world.defaultContactMaterial.restitution = 0.3;
  }

  private addGround() {
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: new CANNON.Material('ground'),
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundBody.position.set(0, -5, 0);

    this.world.addBody(groundBody);
  }

  private addDice() {
    this.diceBody = createTetrahedron(this.diceSize);

    // Set material properties
    this.diceBody.material = new CANNON.Material('dice');
    this.diceBody.material.friction = 0.4;
    this.diceBody.material.restitution = 0.3;

    // Add random initial conditions
    this.diceBody.quaternion.setFromEuler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    this.diceBody.velocity.set(
      (Math.random() - 0.5) * 5,
      8,
      (Math.random() - 0.5) * 5
    );

    this.diceBody.angularVelocity.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );

    this.world.addBody(this.diceBody);
    console.log('Added dice to physics world');
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

  start() {
    this.lastCallTime = performance.now() / 1000;
    this.animate();
  }

  private initDebugger() {
    this.cannonDebugger = new CannonDebugger(this.scene, this.world);
    console.log('Cannon debugger initialized');
  }

  toggleDebugRenderer() {
    this.debugEnabled = !this.debugEnabled;
  }

  rollDice() {
    // Reset position above ground
    this.diceBody.position.set(
      Math.random() * 4 - 2, // Random x position
      10,
      Math.random() * 4 - 2 // Random z position
    );

    // Reset velocity
    this.diceBody.velocity.set(0, 0, 0);
    this.diceBody.angularVelocity.set(0, 0, 0);

    // Add random angular velocity for spinning
    this.diceBody.angularVelocity.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );
  }

  getWorld(): CANNON.World {
    return this.world;
  }

  getBodies(): CANNON.Body[] {
    return this.world.bodies;
  }
}
