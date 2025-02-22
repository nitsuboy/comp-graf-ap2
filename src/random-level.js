import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export class RandomLevel {
  create() {
    // const tableGroup = new THREE.Group()

    const zPosition = -30

    // const tableTopGeometry = new THREE.BoxGeometry(5, 0.3, 3)
    // const tableTopMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    // const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial)
    // tableTop.position.set(0, -1, zPosition)
    // tableGroup.add(tableTop)
    //
    // const tableTopShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.15, 1.5))
    // const tableTopBody = new CANNON.Body({
    //   mass: 0,
    //   shape: tableTopShape,
    //   position: new CANNON.Vec3(0, -1, zPosition)
    // })
    //
    // const tableLegGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 32)
    // const tableLegMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 })
    // const tableLeg = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
    // tableLeg.position.set(0, -2.5, zPosition)
    // tableGroup.add(tableLeg)
    //

    const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const positions = [
      [-1, 0.65, zPosition],
      [0, 0.65, zPosition],
      [1, 0.65, zPosition]
    ];

    const cubes = []

    positions.forEach(pos => {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(...pos)
      // tableGroup.add(cube)

      const cubeShape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 0.4))
      const cubeBody = new CANNON.Body({
        mass: 1,
        shape: cubeShape,
        position: new CANNON.Vec3(...pos)
      })

      cubes.push({
        mesh: cube,
        body: cubeBody
      })
    })

    return { cubes }
  }
}
