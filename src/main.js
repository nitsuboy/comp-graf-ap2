import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';
import { Cannon } from './cannon.js';
import { ParticleSystem } from './particles.js';
import { Target } from './target.js';
import { applyGravity, checkCollision } from './physics.js';

let scene, camera, renderer, cannon, particleSystem, targets = [];
const projectiles = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    cannon = new Cannon(scene);
    cannon.init();

    particleSystem = new ParticleSystem();
    particleSystem.init(new THREE.Vector3(0, 1, 5)); // Passe uma posição válida

    createTargets();

    camera.position.z = 5;

    window.addEventListener('keydown', handleKeyDown);
    animate();
}

function createTargets() {
    for (let i = 0; i < 5; i++) {
        const target = new Target(scene);
        targets.push(target);
    }
}

function handleKeyDown(event) {
    if (event.code === 'Space') {
        const projectile = cannon.fire();
        if (projectile) {
            projectiles.push(projectile);
            scene.add(projectile.mesh);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateProjectiles();
    particleSystem.update();
    particleSystem.render(scene);
    renderer.render(scene, camera);
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.update();
        applyGravity(projectile);

        for (const target of targets) {
            if (target.checkHit(projectile)) {
                particleSystem.explode(projectile.position);
                scene.remove(projectile.mesh);
                projectiles.splice(i, 1);
                break;
            }
        }

        if (projectile.position.y < -5) {
            scene.remove(projectile.mesh);
            projectiles.splice(i, 1);
        }
    }
}

init();