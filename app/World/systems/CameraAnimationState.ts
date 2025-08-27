import * as THREE from 'three';
import * as CANNON from 'cannon-es';

interface CameraAnimationState {
  isAnimating: boolean;
  startTime: number;
  startPosition: THREE.Vector3;
  startLookAt: THREE.Vector3;
  targetPosition: THREE.Vector3;
  targetLookAt: THREE.Vector3;
  duration: number;
}

export class DiceCameraController {
  private camera: THREE.Camera;
  private diceBody: CANNON.Body;
  private animationState: CameraAnimationState | null = null;
  private velocityThreshold = 0.1; // Consider stopped when velocity is below this
  private stillTime = 0; // How long the dice has been still
  private requiredStillDuration = 1000; // Wait 1 second after stopping before animating
  private lastPosition = new THREE.Vector3();
  private hasAnimated = false; // Prevent multiple animations

  // Callback functions
  public onAnimationStart?: () => void;
  public onAnimationComplete?: () => void;

  constructor(camera: THREE.Camera, diceBody: CANNON.Body) {
    this.camera = camera;
    this.diceBody = diceBody;
    this.lastPosition.copy(diceBody.position);
  }

  // Call this in your animation loop
  update(deltaTime: number) {
    const currentTime = Date.now();

    // Check if dice is moving
    const velocity = this.diceBody.velocity.length();
    const angularVelocity = this.diceBody.angularVelocity.length();
    const totalVelocity = velocity + angularVelocity;

    // Track how long dice has been still
    if (totalVelocity < this.velocityThreshold) {
      this.stillTime += deltaTime * 1000; // Convert to milliseconds
    } else {
      this.stillTime = 0;
      this.hasAnimated = false; // Reset if dice starts moving again
    }

    // Start animation if dice has been still long enough
    if (
      this.stillTime >= this.requiredStillDuration &&
      !this.animationState &&
      !this.hasAnimated
    ) {
      this.startCameraAnimation();
    }

    // Update camera animation
    if (this.animationState) {
      this.updateCameraAnimation(currentTime);
    }
  }

  private startCameraAnimation() {
    const dicePosition = new THREE.Vector3(
      this.diceBody.position.x,
      this.diceBody.position.y,
      this.diceBody.position.z
    );

    // Calculate camera positions
    const currentCameraPos = this.camera.position.clone();

    // Calculate where the camera is currently looking
    // Since your camera.lookAt(diceMesh.position) in World, it's looking at the dice
    const currentLookAt = dicePosition.clone(); // Camera is already looking at dice position

    // Target: closer to dice, looking down at it
    const offset = new THREE.Vector3(2, 3, 2); // Adjust these values for desired angle
    const targetPosition = dicePosition.clone().add(offset);
    const targetLookAt = dicePosition.clone();

    this.animationState = {
      isAnimating: true,
      startTime: Date.now(),
      startPosition: currentCameraPos,
      startLookAt: currentLookAt,
      targetPosition: targetPosition,
      targetLookAt: targetLookAt,
      duration: 2000, // 2 seconds
    };

    this.hasAnimated = true;

    // Trigger callback
    if (this.onAnimationStart) {
      this.onAnimationStart();
    }
  }

  private updateCameraAnimation(currentTime: number) {
    if (!this.animationState) return;

    const elapsed = currentTime - this.animationState.startTime;
    const progress = Math.min(elapsed / this.animationState.duration, 1);

    // Smooth easing function (ease-in-out cubic)
    const easedProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Interpolate camera position
    const newPosition = this.animationState.startPosition
      .clone()
      .lerp(this.animationState.targetPosition, easedProgress);

    // Interpolate look-at target
    const newLookAt = this.animationState.startLookAt
      .clone()
      .lerp(this.animationState.targetLookAt, easedProgress);

    // Apply to camera
    this.camera.position.copy(newPosition);
    if (
      this.camera instanceof THREE.PerspectiveCamera ||
      this.camera instanceof THREE.OrthographicCamera
    ) {
      this.camera.lookAt(newLookAt);
    }

    // End animation
    if (progress >= 1) {
      this.animationState = null;
      // Trigger completion callback
      if (this.onAnimationComplete) {
        this.onAnimationComplete();
      }
    }
  }

  // Check if currently animating
  isAnimating(): boolean {
    return this.animationState !== null;
  }

  // Optional: Reset for new dice throw
  reset() {
    this.animationState = null;
    this.stillTime = 0;
    this.hasAnimated = false;
  }

  // Optional: Manually trigger animation
  triggerAnimation() {
    if (!this.animationState && !this.hasAnimated) {
      this.startCameraAnimation();
    }
  }
}

// Usage example in your main animation loop:
/*
const cameraController = new DiceCameraController(camera, diceBody);

function animate() {
  const deltaTime = clock.getDelta();
  
  // Update physics
  physicsWorld.step(deltaTime);
  
  // Update camera animation
  cameraController.update(deltaTime);
  
  // Render
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
*/

// Alternative: Simple function-based approach
export const createCameraAnimation = (
  camera: THREE.Camera,
  diceBody: CANNON.Body,
  duration: number = 2000
) => {
  return new Promise<void>((resolve) => {
    const startTime = Date.now();
    const startPosition = camera.position.clone();
    const startLookAt = new THREE.Vector3(0, 0, 0); // Adjust based on current target

    const dicePosition = new THREE.Vector3(
      diceBody.position.x,
      diceBody.position.y,
      diceBody.position.z
    );

    const targetPosition = dicePosition.clone().add(new THREE.Vector3(2, 3, 2));
    const targetLookAt = dicePosition.clone();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const newPosition = startPosition
        .clone()
        .lerp(targetPosition, easedProgress);
      const newLookAt = startLookAt.clone().lerp(targetLookAt, easedProgress);

      camera.position.copy(newPosition);
      camera.lookAt(newLookAt);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    animate();
  });
};
