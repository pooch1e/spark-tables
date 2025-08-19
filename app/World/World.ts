import { HtmlProps } from 'next/dist/shared/lib/html-context.shared-runtime';
import { createCamera } from './components/camera';
import { createCube } from './components/cube';
import { createScene } from './components/scene';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';

export class World {
  #camera;
  #scene;
  #renderer;
  constructor(container: React.RefObject<HTMLCanvasElement>){
    this.#camera = createCamera();
    this.#scene = createScene();
    this.#renderer = createRenderer();
    this.container = container;

    const cube = createCube();
    this.#scene.add(cube);
  }

  render() {
    this.#renderer.render(this.#scene, this.#camera);
  }
}
