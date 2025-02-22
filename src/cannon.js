import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

window.THREE = THREE

let SPE

async function loadSPE() {
  SPE = await import('@g.frame/shader-particle-engine')
}

await loadSPE()

export class Cannon {
  constructor() {
    this.balls = []
    this.referenceBallMesh = null
    this.cannonPivot = null
    this.cannon = null
    this.explosionGroup = null
    this.shockwaveGroup = null
    this.currentTimeout = null
  }

  create(scene) {
    const loader = new GLTFLoader()

    this.cannonPivot = new THREE.Object3D()
    this.cannon = new THREE.Group()

    loader.load('./models/barrel_of_red_bronze_cannon.glb', (gltf) => {
      const cannonMesh = gltf.scene
      this.cannon.add(cannonMesh)
    })

    this.cannonPivot.position.set(0, -3, 8)
    this.cannonPivot.add(this.cannon)

    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

    this.referenceBallMesh = new THREE.Mesh(ballGeometry, ballMaterial)

    this.referenceBallMesh.position.set(0, 0, -3)

    this.cannon.add(this.referenceBallMesh)

    this.referenceBallMesh.visible = false

    scene.add(this.cannonPivot)
  }

  updateRefereceBallPosition(scene, event) {
    let mousedirection = this.getShootDirection(event)

    this.cannon.rotation.y = -mousedirection.x
    this.cannonPivot.rotation.x = mousedirection.y

    // Update position reference ball
    const ballPosition = new THREE.Vector3(0, 0, -3.2)
    ballPosition.applyMatrix4(this.cannon.matrixWorld)

    this.referenceBallMesh.position.copy(ballPosition)

    if (this.explosionGroup) {
      scene.remove(this.explosionGroup.mesh)
    }
  }

  getShootDirection(event) {
    const { innerWidth, innerHeight } = window

    let mouseX = (event.clientX / innerWidth) * 2 - 1
    let mouseY = -(event.clientY / innerHeight) * 2 + 1.7

    let mouseVector = new THREE.Vector3(mouseX, mouseY, -1)

    let ray = new THREE.Ray(this.referenceBallMesh.position, mouseVector.normalize())

    return ray.direction
  }

  shot(scene, world, event) {
    const ballShape = new CANNON.Sphere(0.3)
    const ballBody = new CANNON.Body({ mass: 1 })

    ballBody.addShape(ballShape)

    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)

    ballMesh.castShadow = true
    ballMesh.receiveShadow = true

    ballBody.position.copy(this.referenceBallMesh.position)
    ballMesh.position.copy(this.referenceBallMesh.position)

    world.addBody(ballBody)

    scene.add(ballMesh)

    ballBody.velocity.set(0, 0, 0);

    const shootVelocity = 28
    const shootDirection = this.getShootDirection(event)

    ballBody.velocity.set(
      shootDirection.x * shootVelocity,
      shootDirection.y * shootVelocity,
      shootDirection.z * shootVelocity
    )

    this.balls.push({
      mesh: ballMesh,
      body: ballBody
    })

    this.resetExplosion(scene)

    const referenceBallSize = this.referenceBallMesh.scale.x * 10

    const position = {
      value: new THREE.Vector3(
        this.referenceBallMesh.position.x,
        this.referenceBallMesh.position.y,
        this.referenceBallMesh.position.z
      )
    };

    this.explosionGroup = new SPE.Group({
      texture: {
        value: THREE.ImageUtils.loadTexture('/particles/sprite-explosion2.png'),
        frames: new THREE.Vector2(5, 5),
        loop: 1
      },
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      scale: referenceBallSize
    });

    this.shockwaveGroup = new SPE.Group({
      texture: {
        value: THREE.ImageUtils.loadTexture('/particles/smokeparticle.png'),
      },
      depthTest: false,
      depthWrite: true,
      blending: THREE.NormalBlending,
    });

    const fireball = new SPE.Emitter({
      particleCount: 200,
      position,
      maxAge: { value: 0.8 },
      activeMultiplier: 70,
      velocity: {
        value: shootDirection.clone().multiplyScalar(20)
      },
      size: { value: [referenceBallSize * 0.5, referenceBallSize * 2] },
      color: {
        value: [
          new THREE.Color(1, 0.5, 0),
          new THREE.Color(0.9, 0.1, 0),
          new THREE.Color(0.6, 0.2, 0),
          new THREE.Color(0.2, 0, 0)
        ]
      },
      opacity: { value: [1, 0.8, 0.5, 0] },
      spread: new THREE.Vector3(3, 3, 3),
      acceleration: {
        value: new THREE.Vector3(0, -1, 0)
      },
      drag: { value: 0.99 },
      rotation: {
        value: new THREE.Vector3(0, Math.PI, 0)
      }
    });

    const flash = new SPE.Emitter({
      particleCount: 10,
      position: { spread: new THREE.Vector3(1, 1, 1), ...position },
      velocity: {
        value: shootDirection.clone().multiplyScalar(20)
      },
      size: { value: [referenceBallSize * 0.2, referenceBallSize] },
      maxAge: { value: 0.5 },
      opacity: { value: [1, 0.5, 0] }
    })

    const smoke = new SPE.Emitter({
      particleCount: 40,
      position: {
        ...position,
        spread: new THREE.Vector3(5, 3, 2)
      },
      maxAge: { value: 1.5 },
      activeMultiplier: 500,
      velocity: {
        value: shootDirection.clone().multiplyScalar(20)
      },
      size: { value: [10, 40] },
      color: {
        value: new THREE.Color(0.2, 0.2, 0.2)
      },
      opacity: { value: [0, 0.03, 0.01, 0] }
    });

    this.explosionGroup.addEmitter(fireball).addEmitter(flash)
    this.shockwaveGroup.addEmitter(smoke)

    scene.add(this.explosionGroup.mesh)
    scene.add(this.shockwaveGroup.mesh)

    this.currentTimeout = setTimeout(() => {
      this.resetExplosion(scene)
    }, 500)

  }

  resetExplosion(scene) {
    if (this.explosionGroup && this.shockwaveGroup) {
      scene.remove(this.explosionGroup.mesh)
      scene.remove(this.shockwaveGroup.mesh)

      this.explosionGroup = null
      this.shockwaveGroup = null
    }

    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
      this.currentTimeout = null
    }
  }

  animateExplosion() {
    if (this.explosionGroup && this.shockwaveGroup) {
      this.explosionGroup.tick()
      this.shockwaveGroup.tick()
    }
  }

  animateBalls() {
    if (!this.balls?.length) return

    for (const ball of this.balls) {
      ball.mesh.position.copy(ball.body.position)
      ball.mesh.quaternion.copy(ball.body.quaternion)
    }
  }
}
