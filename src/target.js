import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';

export class Target {
    constructor(scene) {
        this.scene = scene;
        this.targets = [];
        this.createTargets();
    }

    createTargets() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        for (let i = 0; i < 5; i++) {
            const target = new THREE.Mesh(geometry, material);
            target.position.set(Math.random() * 10 - 5, Math.random() * 5 + 1, Math.random() * -10);
            this.scene.add(target);
            this.targets.push(target);
        }
    }

    checkHit(projectile) {
        for (let i = this.targets.length - 1; i >= 0; i--) {
            const target = this.targets[i];
            const distance = target.position.distanceTo(projectile.position);
            if (distance < 1) {
                this.destroyTarget(i);
                return true;
            }
        }
        return false;
    }

    destroyTarget(index) {
        const target = this.targets[index];
        this.scene.remove(target);
        this.targets.splice(index, 1);
    }
}