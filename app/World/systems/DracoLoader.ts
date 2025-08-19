import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';

export class DracoLoader {
  dracoLoader: DRACOLoader;
  gltfLoader: GLTFLoader;
  constructor() {
    //init draco loader
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('../../../assets/draco');

    //init GLTF loader
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }
  //standard draco files
  loadDracoGeometry(url, onLoad, onProgress, onError) {
    this.dracoLoader.load(
      url,
      (geometry) => {
        // Create material and mesh
        const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
        const mesh = new THREE.Mesh(geometry, material);

        // Add to scene
        this.scene.add(mesh);

        // Call custom onLoad callback if provided
        if (onLoad) onLoad(mesh, geometry);
      },
      onProgress ||
        ((xhr) => {
          if (xhr.lengthComputable) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          }
        }),
      onError ||
        ((error) => {
          console.error('Error loading DRACO geometry:', error);
        })
    );
  }

  // Method to load GLTF/GLB files with DRACO compression -- mostly use this
  loadDracoGLTF(url, onLoad, onProgress, onError) {
    this.gltfLoader.load(
      url,
      (gltf) => {
        // Add the loaded model to the scene
        this.scene.add(gltf.scene);

        // Call custom onLoad callback if provided
        if (onLoad) onLoad(gltf);
      },
      onProgress ||
        ((xhr) => {
          if (xhr.lengthComputable) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          }
        }),
      onError ||
        ((error) => {
          console.error('Error loading DRACO GLTF:', error);
        })
    );
  }
}
