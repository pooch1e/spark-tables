import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class ThreeService {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.Camera;
  renderer: THREE.WebGLRenderer;
  dracoLoader: DRACOLoader;
  gltfLoader: GLTFLoader;
  material: THREE.MeshBasicMaterial;

  constructor() {
    //inits
    this.scene = this.addScene();
    this.camera = this.addCamera();

    this.material = this.addMaterial();

    //init draco loader
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('../../../assets/draco');

    //init GLTF loader
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    //create renderer
    this.renderer = this.addRenderer();
    this.renderer.setSize(innerWidth, innerHeight);
  }

  // Method to load standalone DRACO geometry files (.drc)
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

  // setup
  addScene() {
    const scene = new THREE.Scene();
    return scene;
  }

  addCamera() {
    const perspectiveCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ); //might be canvas height
    return perspectiveCamera;
  }

  addRenderer() {
    const renderer = new THREE.WebGLRenderer();
    return renderer;
  }

  addMaterial() {
    const material = new THREE.MeshBasicMaterial();
    return material;
  }
}
