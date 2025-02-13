import { Projectile } from './projectile.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';

export class Cannon {
    constructor(scene) {
        this.scene = scene;
        this.cannon = null;
        this.angle = 0;
        this.position = new THREE.Vector3(0, 1, 5);
        this.init();
    }

    init() {
        const geometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
        this.cannon = new THREE.Mesh(geometry, material);
        this.cannon.position.copy(this.position);
        this.cannon.rotation.x = this.angle;
        this.scene.add(this.cannon);

        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.fire();
            }
        });
    }

    fire() {
        const projectile = new Projectile(this.cannon.position.clone(), this.angle);
        this.scene.add(projectile.mesh);
    }
}