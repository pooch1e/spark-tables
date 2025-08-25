import { createCamera } from './components/camera';

import { createLights } from './components/lights';

import { createScene } from './components/scene';
import { createAxesHelper } from './components/helpers/axesHelper';
import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';
import { ModelLoader } from './systems/GLTFloader';
import { createMaterial } from './components/material';
import * as THREE from 'three';

//physics
import { PhysicsWorld } from './physics/PhysicsWorld';

export class World {
  private camera;
  private scene;
  private renderer;
  private resizer: any;
  private loop: Loop;
  private container: React.RefObject<HTMLCanvasElement>;

  //physics
  private physics: PhysicsWorld;
  private diceMesh: THREE.Object3D | null = null;
  private diceBody: any = null;

  constructor(container: React.RefObject<HTMLCanvasElement>) {
    this.camera = createCamera();
    this.scene = createScene();
    this.container = container;
    //init renderer
    this.renderer = createRenderer(this.container.current || undefined);
    //init physics world
    this.physics = new PhysicsWorld(this.scene);
    //init animation loop
    this.loop = new Loop(this.camera, this.scene, this.renderer);

    const [directionalLight, ambientLight] = createLights();

    if (this.container.current) {
      this.resizer = new Resizer(
        this.container.current,
        this.camera,
        this.renderer
      );
    }

    // ADD AXES HELPER
    const axesHelper = createAxesHelper();

    //removing test tetrehedron
    // this.loop.updatables.push(this.camera);
    this.scene.add(directionalLight, ambientLight, axesHelper);

    // Add physics update to the render loop
    this.loop.updatables.push({
      tick: () => this.updatePhysics(),
    });
  }

  async init() {
    this.physics.init(true); //init physics

    //load dice
    const loader = new ModelLoader();
    const data = await loader.load('/models/4_sided_dice.glb');
    const dice = loader.setupModel(data);
    const material = createMaterial();

    this.setupDiceMesh(dice, material, 2);

    this.physics.start();
  }

  private setupDiceMesh(
    dice: THREE.Object3D,
    material: THREE.Material,
    physicsSize = 2
  ) {
    dice.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material;
      }
    });

    // --- 2. Recenter pivot so rotation matches Cannon's center of mass
    const box = new THREE.Box3().setFromObject(dice);
    const center = box.getCenter(new THREE.Vector3());
    dice.position.sub(center);
    dice.rotation.set(Math.PI / 2, 2, 0);
    // --- 3. Scale mesh to match physics dimensions
    const visualSize = box.getSize(new THREE.Vector3());
    const scale = physicsSize / visualSize.length();
    dice.scale.setScalar(scale);

    // --- 4. Match with physics body
    const bodies = this.physics.getBodies();
    this.diceBody = bodies.find((body) => body.mass > 0);

    if (this.diceBody) {
      // Place mesh at body’s position & rotation
      dice.position.copy(this.diceBody.position as unknown as THREE.Vector3);
      dice.quaternion.copy(
        this.diceBody.quaternion as unknown as THREE.Quaternion
      );
    }

    // --- 5. Store reference & add to scene
    this.diceMesh = dice;
    this.scene.add(dice);

    return dice;
  }

  // Update method to sync visual dice with physics
  private updatePhysics() {
    if (this.diceBody && this.diceMesh) {
      // Copy position and rotation from physics body to visual mesh
      this.diceMesh.position.copy(this.diceBody.position);
      this.diceMesh.quaternion.copy(this.diceBody.quaternion);
    }

    // Update physics debug renderer
    if (this.physics.cannonDebugger) {
      this.physics.cannonDebugger.update();
    }
  }
  // Method to roll the dice again
  rollDice() {
    if (this.diceBody) {
      // Reset position above ground
      this.diceBody.position.set(
        Math.random() * 4 - 2, // Random x position
        10,
        Math.random() * 4 - 2 // Random z position
      );

      // Reset velocity
      this.diceBody.velocity.set(0, 0, 0);

      // Add random angular velocity for spinning
      // this.diceBody.angularVelocity.set(
      //   Math.random() * 10 - 5,
      //   Math.random() * 10 - 5,
      //   Math.random() * 10 - 5
      // );
    }
  }

  // Toggle debug wireframes on/off
  toggleDebugWireframes() {
    if (this.physics) {
      this.physics.toggleDebugRenderer();
    }
  }

  // Method to adjust dice scale if physics doesn't match visual
  scaleDice(scale: number) {
    if (this.diceMesh) {
      this.diceMesh.scale.setScalar(scale);
    }
  }
  //for resizer
  dispose() {
    this.resizer?.dispose();
  }
  //produce single frame
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  // animated loop
  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  // Getters for external access
  getPhysicsWorld() {
    return this.physics;
  }

  getDiceMesh() {
    return this.diceMesh;
  }

  getDiceBody() {
    return this.diceBody;
  }
}
