import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export class RandomLevel {
  constructor() {
    this.cubes = []
    this.table = null
  }

  create(scene, world) {
    const zPosition = -30

    const tableTopGeometry = new THREE.BoxGeometry(5, 0.3, 3)
    const tableTopMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    const tableMesh = new THREE.Mesh(tableTopGeometry, tableTopMaterial)
    tableMesh.position.set(0, -2, zPosition)

    scene.add(tableMesh)

    const tableTopShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.15, 1.5))
    const tableTopBody = new CANNON.Body({
      mass: 0,
      shape: tableTopShape,
      position: new CANNON.Vec3(0, -2, zPosition)
    })

    world.addBody(tableTopBody)

    const tableLegGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32)
    const tableLegMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 })

    const tableLeg = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
    tableLeg.position.set(0, -3.4, zPosition)

    scene.add(tableLeg)

    const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

    const positions = [
      [-1, 0.65, zPosition],
      [0, 0.65, zPosition],
      [1, 0.65, zPosition]
    ]

    positions.forEach(pos => {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

      cube.position.set(...pos)

      scene.add(cube)

      const cubeShape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 0.4))
      const cubeBody = new CANNON.Body({
        mass: 1,
        shape: cubeShape,
        position: new CANNON.Vec3(...pos)
      })

      world.addBody(cubeBody)

      this.cubes.push({
        mesh: cube,
        body: cubeBody
      })
    })

    this.table = {
      mesh: tableMesh,
      body: tableTopBody
    }
  }

  animateLevel() {
    this.table.mesh.position.copy(this.table.body.position)
    this.table.mesh.quaternion.copy(this.table.body.quaternion)

    for (const cube of this.cubes) {
      cube.mesh.position.copy(cube.body.position)
      cube.mesh.quaternion.copy(cube.body.quaternion)
    }
  }
}
