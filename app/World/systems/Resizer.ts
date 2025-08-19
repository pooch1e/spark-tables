export class Resizer {
  private container: HTMLElement;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private resizeHandler: () => void;

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
    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      this.setSize(this.container, this.camera, this.renderer);
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {}

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
    window.removeEventListener('resize', this.resizeHandler);
  }
}
