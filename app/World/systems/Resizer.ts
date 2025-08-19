export class Resizer {
  private container: HTMLElement;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor(
    container: HTMLElement,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;

    this.setSize();

    // Listen for window resize
    window.addEventListener('resize', this.setSize);
  }

  private setSize = () => {
    const { clientWidth, clientHeight } = this.container;

    // update camera aspect
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();

    // update renderer
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  };

  dispose() {
    // Clean up the event listener when unmounting
    window.removeEventListener('resize', this.setSize);
  }
}
