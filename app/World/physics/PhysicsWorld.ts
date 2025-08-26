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
    const diceBody = createTetrahedron(this.diceSize);

    // Set material properties
    diceBody.material = new CANNON.Material('dice');
    diceBody.material.friction = 0.4;
    diceBody.material.restitution = 0.3;

    // Add random initial conditions
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

  getWorld(): CANNON.World {
    return this.world;
  }

  getBodies(): CANNON.Body[] {
    return this.world.bodies;
  }
}
