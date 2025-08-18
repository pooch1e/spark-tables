import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
DRACOLoader.setDecoderPath('../../../assets/draco/draco_decoder.js');

export class ThreeService {
  constructor() {
    const loader = new DRACOLoader();
  }

  loadDraco() {
    // Load a Draco geometry
    this.loader.load(
      // resource URL
      'model.drc',
      // called when the resource is loaded
      function (geometry) {
        const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      },
      // called as loading progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened');
      }
    );
  }
}
