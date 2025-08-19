import { createCamera } from './components/camera';
import { createCube } from './components/cube';
import { createLights } from './components/lights';
import { createTetrahedron } from './components/tetrahedron';
import { createScene } from './components/scene';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';

export class World {
  private camera;
  private scene;
  private renderer;
  private resizer: any;
  private container: React.RefObject<HTMLCanvasElement>;
  constructor(container: React.RefObject<HTMLCanvasElement>) {
    this.camera = createCamera();
    this.scene = createScene();
    this.container = container;
    this.renderer = createRenderer(this.container.current || undefined);

    const light = createLights();

    if (this.container.current) {
      this.resizer = new Resizer(
        this.container.current,
        this.camera,
        this.renderer
      );
      this.resizer.onResize = () => {
        this.render();
      };
    }

    // const cube = createCube();
    // this.scene.add(cube);
    const tetrahedron = createTetrahedron();
    this.scene.add(tetrahedron, light);
  }
  //for resizer
  dispose() {
    this.resizer?.dispose();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
