import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Cannon {
  create() {
    const loader = new GLTFLoader()

    const cannonGroup = new THREE.Group()

    loader.load('./models/barrel_of_red_bronze_cannon.glb', (gltf) => {
      const cannonMesh = gltf.scene
      cannonMesh.scale.set(0.006, 0.006, 0.006)
      cannonMesh.position.set(0, 0, 0)

      cannonGroup.add(cannonMesh)

      cannonGroup.rotateX(0)
      cannonGroup.rotateY(300)
      cannonGroup.rotateZ(-0.2)

      cannonGroup.position.set(0, -4, 0)
    })

    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const referenceBallMesh = new THREE.Mesh(ballGeometry, ballMaterial)

    referenceBallMesh.position.set(-3, 0, 0.07)

    cannonGroup.add(referenceBallMesh)

    referenceBallMesh.visible = false

    return { cannon: cannonGroup, referenceBallMesh }
  }
}
