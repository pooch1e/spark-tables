import { GLTFLoader } from 'three/examples/jsm/Addons.js';
export const gltfLoader = async (path: string) => {
  const loader = new GLTFLoader();
  const loadedData = await loader.loadAsync(path);

  const loadingSuccess = async (model) => {
    await loader.loadAsync(model) // my model
  }
};
