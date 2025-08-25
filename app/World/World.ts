import { createCamera } from './components/camera';

import { createLights } from './components/lights';

import { createScene } from './components/scene';
import { createAxesHelper } from './components/helpers/axesHelper';
import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';
import { ModelLoader } from './systems/GLTFloader';
import { createMaterial } from './components/material';

export class World {
  private camera;
  private scene;
  private renderer;
  private resizer: any;
  private loop: Loop;
  private container: React.RefObject<HTMLCanvasElement>;
  constructor(container: React.RefObject<HTMLCanvasElement>) {
    this.camera = createCamera();
    this.scene = createScene();
    this.container = container;
    this.renderer = createRenderer(this.container.current || undefined);

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
  }

  async init() {
    const loader = new ModelLoader();
    const data = await loader.load('/models/4_sided_dice.glb');
    const dice = loader.setupModel(data);
    const material = createMaterial();

    this.scene.add(dice);
    dice.position.set(-10, -10, -10);
    
    dice.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
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
}
