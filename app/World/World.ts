import { createCamera } from './components/camera';
import { createLights } from './components/lights';
import { createScene } from './components/scene';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';
import { ModelLoader } from './systems/GLTFloader';
import { createMaterial } from './components/material';
import { createFloor } from './components/floor';
import * as THREE from 'three';

//physics
import { PhysicsWorld } from './physics/PhysicsWorld';

// Import the camera animation system
import { DiceCameraController } from './systems/CameraAnimationState';

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
  private targetSize = 2; // Consistent size for both visual and physics
  private floor;

  // Camera animation
  private cameraController: DiceCameraController | null = null;
  private originalCameraPosition: THREE.Vector3;
  private isFollowingDice = true; // Track if camera should follow dice

  constructor(container: React.RefObject<HTMLCanvasElement>) {
    this.camera = createCamera();

    // Store original camera position for potential reset
    this.originalCameraPosition = this.camera.position.clone();

    this.scene = createScene();

    this.container = container;
    const orbitControls = new OrbitControls(
      this.camera,
      this.container.current
    );
    this.scene.add(orbitControls)
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
    // const axesHelper = createAxesHelper();
    this.floor = createFloor();
    this.scene.add(directionalLight, ambientLight, this.floor);

    // Add physics update to the render loop
    this.loop.updatables.push({
      tick: (delta: number) => this.updatePhysics(delta),
    });
  }

  async init() {
    await this.physics.init(true); // init physics

    // Get the physics body that was created
    const bodies = this.physics.getBodies();
    this.diceBody = bodies.find((body) => body.mass > 0);

    if (!this.diceBody) {
      console.error('No physics body found!');
      return;
    }

    // Load and setup the visual mesh
    await this.loadAndSetupVisualDice();

    // Initialize camera controller after dice body is available
    if (this.diceBody) {
      this.cameraController = new DiceCameraController(
        this.camera,
        this.diceBody
      );

      // Optional: Listen for animation events
      this.cameraController.onAnimationStart = () => {
        console.log('Camera zoom animation started');
        this.isFollowingDice = false; // Stop following dice during animation
      };

      this.cameraController.onAnimationComplete = () => {
        console.log('Camera zoom animation completed');
        // Keep camera in zoomed position, don't resume following
      };
    }

    this.physics.start();
  }

  private async loadAndSetupVisualDice() {
    try {
      // Load dice model
      const loader = new ModelLoader();
      const data = await loader.load('/models/dice_fixed.glb');
      const dice = loader.setupModel(data);
      const material = createMaterial();

      // Apply material to all meshes
      dice.traverse((child: any) => {
        if (child.isMesh) {
          child.material = material;
        }
      });

      // Get model dimensions
      const box = new THREE.Box3().setFromObject(dice);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Create a group for better control
      const diceGroup = new THREE.Group();

      // Center the dice within the group
      dice.position.sub(center);

      diceGroup.add(dice);

      // Scale to match the SAME size as physics body
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = this.targetSize / maxDimension;
      diceGroup.scale.setScalar(scale);

      // Sync initial position and rotation with physics body
      if (this.diceBody) {
        diceGroup.position.copy(
          this.diceBody.position as unknown as THREE.Vector3
        );
        diceGroup.quaternion.copy(
          this.diceBody.quaternion as unknown as THREE.Quaternion
        );
      }

      // Store reference & add to scene
      this.diceMesh = diceGroup;
      this.scene.add(diceGroup);

      return diceGroup;
    } catch (error) {
      console.error('Failed to load visual dice:', error);
      // Create a simple visual fallback
      this.createVisualFallback();
    }
  }

  private createVisualFallback() {
    // Create a visual tetrahedron as fallback
    const geometry = new THREE.TetrahedronGeometry(this.targetSize / 2, 0);
    const material = createMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    if (this.diceBody) {
      mesh.position.copy(this.diceBody.position as unknown as THREE.Vector3);
      mesh.quaternion.copy(
        this.diceBody.quaternion as unknown as THREE.Quaternion
      );
    }

    this.diceMesh = mesh;
    this.scene.add(mesh);

    // turn off debugger
    this.physics.cannonDebugger.showDebugWireframes(); //this not working
  }

  // Update method to sync visual dice with physics
  private updatePhysics(deltaTime?: number) {
    if (this.diceBody && this.diceMesh) {
      // Copy position and rotation from physics body to visual mesh
      this.diceMesh.position.copy(this.diceBody.position);
      this.diceMesh.quaternion.copy(this.diceBody.quaternion);

      // Only make camera follow dice if not in animation mode
      if (this.isFollowingDice && !this.cameraController?.isAnimating()) {
        this.camera.lookAt(this.diceMesh.position);
      }
    }

    // Update camera animation controller
    if (this.cameraController && deltaTime) {
      this.cameraController.update(deltaTime);
    }

    // Update physics debug renderer
    if (this.physics.cannonDebugger) {
      this.physics.cannonDebugger.update();
    }

    this.physics.toggleDebugRenderer();
  }

  // Method to roll the dice again
  rollDice() {
    if (this.diceBody) {
      // Reset camera animation state for new roll
      if (this.cameraController) {
        this.cameraController.reset();
      }

      // Reset camera following
      this.isFollowingDice = true;

      // Optionally reset camera to original position
      // this.resetCamera();

      this.diceBody.rollDice();
    }
  }

  // Reset camera to original position
  resetCamera() {
    this.camera.position.copy(this.originalCameraPosition);
    this.camera.lookAt(0, 0, 0); // or wherever you want it to look
    this.isFollowingDice = true;

    if (this.cameraController) {
      this.cameraController.reset();
    }
  }

  // Manually trigger camera animation (if you want a button for it)
  triggerCameraZoom() {
    if (this.cameraController) {
      this.cameraController.triggerAnimation();
    }
  }

  // Toggle between following dice and free camera
  toggleCameraFollow() {
    this.isFollowingDice = !this.isFollowingDice;

    if (this.cameraController) {
      if (!this.isFollowingDice) {
        this.cameraController.reset();
      }
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

  getTargetSize() {
    return this.targetSize;
  }

  getCameraController() {
    return this.cameraController;
  }

  // Check if camera is currently animating
  isCameraAnimating() {
    return this.cameraController?.isAnimating() || false;
  }
}
