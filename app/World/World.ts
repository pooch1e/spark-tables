import { createCamera } from './components/camera';

import { createLights } from './components/lights';
import { createTetrahedron } from './components/tetrahedron';
import { createScene } from './components/scene';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';

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

    // const cube = createCube();
    // this.scene.add(cube);
    const tetrahedron = createTetrahedron();
    this.loop.updatables.push(tetrahedron, this.camera);
    this.scene.add(tetrahedron, directionalLight, ambientLight);
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
