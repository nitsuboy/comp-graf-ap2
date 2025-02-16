import * as THREE from 'three'

export class Light {
  create() {
    const ambientLight = new THREE.AmbientLight(0x666666)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    const distance = 20
    directionalLight.position.set(-distance, distance, distance)

    directionalLight.castShadow = true

    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048

    directionalLight.shadow.camera.left = -distance
    directionalLight.shadow.camera.right = distance
    directionalLight.shadow.camera.top = distance
    directionalLight.shadow.camera.bottom = -distance

    directionalLight.shadow.camera.far = 3 * distance
    directionalLight.shadow.camera.near = distance

    return { ambientLight, directionalLight }
  }
}
