import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Cannon {
  create() {
    const loader = new GLTFLoader()

    const cannonPivot = new THREE.Object3D()
    const cannonGroup = new THREE.Group()

    loader.load('./models/barrel_of_red_bronze_cannon.glb', (gltf) => {
      const cannonMesh = gltf.scene
      //cannonMesh.scale.set(0.006, 0.006, 0.006)
      cannonGroup.add(cannonMesh)
    })
    cannonPivot.position.set(0, -3, 8)
    cannonPivot.add(cannonGroup)
    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const referenceBallMesh = new THREE.Mesh(ballGeometry, ballMaterial)

    referenceBallMesh.position.set(0, 0, -3)

    cannonGroup.add(referenceBallMesh)

    referenceBallMesh.visible = false

    return { cannonpivot: cannonPivot, cannon: cannonGroup, referenceBallMesh }
  }
}
