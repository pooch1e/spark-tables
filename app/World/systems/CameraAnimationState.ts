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
  private velocityThreshold = 0.1; 
  private stillTime = 0; 
  private requiredStillDuration = 100; 
  private lastPosition = new THREE.Vector3();
  private hasAnimated = false; 

  // Callback functions
  public onAnimationStart?: () => void;
  public onAnimationComplete?: () => void;

  constructor(camera: THREE.Camera, diceBody: CANNON.Body) {
    this.camera = camera;
    this.diceBody = diceBody;
    this.lastPosition.copy(diceBody.position);
  }

  
  update(deltaTime: number) {
    const currentTime = Date.now();

    // Check if dice is moving
    const velocity = this.diceBody.velocity.length();
    const angularVelocity = this.diceBody.angularVelocity.length();
    const totalVelocity = velocity + angularVelocity;

    // Track how long dice has been still
    if (totalVelocity < this.velocityThreshold) {
      this.stillTime += deltaTime * 1000; 
    } else {
      this.stillTime = 0;
      this.hasAnimated = false; 
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

    const currentLookAt = dicePosition.clone(); 

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
      duration: 2000, 
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

  
  reset() {
    this.animationState = null;
    this.stillTime = 0;
    this.hasAnimated = false;
  }

  
  triggerAnimation() {
    if (!this.animationState && !this.hasAnimated) {
      this.startCameraAnimation();
    }
  }
}
