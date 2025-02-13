import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 1000;
        this.gravity = new THREE.Vector3(0, -0.1, 0);
    }

    init(position = new THREE.Vector3(0, 0, 0)) {
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = new THREE.Vector3(position.x, position.y, position.z);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            this.particles.push(particle);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.add(particle.velocity);
            particle.add(this.gravity);

            if (particle.y < 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(scene) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particles.length * 3);

        for (let i = 0; i < this.particles.length; i++) {
            positions[i * 3] = this.particles[i].x;
            positions[i * 3 + 1] = this.particles[i].y;
            positions[i * 3 + 2] = this.particles[i].z;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);
    }
}