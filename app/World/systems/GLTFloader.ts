import { GLTFLoader } from 'three/examples/jsm/Addons.js';
export class ModelLoader {
  private loader: GLTFLoader;
  constructor() {
    this.loader = new GLTFLoader();
  }

  async load(path: string) {
    try {
      const gltf = await this.loader.loadAsync(path);
      console.log(gltf, 'dice roll data');
      return gltf;
    } catch (error) {
      console.error(`Error loading model from ${path}:`, error);
      throw error;
    }
  }

  setupModel(data) {
    const model = data.scene.children[0];
    console.log(model, 'model data')
    return model
  }
}
