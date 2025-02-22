import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Scenario {
  planPosition = -5

  async create(scene, world, renderer) {
    const textureLoader = new THREE.TextureLoader()

    const texture = textureLoader.load('/textures/FS002_Day.png', () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
      rt.fromEquirectangularTexture(renderer, texture)
      scene.background = rt.texture
    })

    const groundMaterial = new CANNON.Material()

    const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      material: groundMaterial
    })

    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    groundBody.position.set(0, this.planPosition, 0)

    const groundGeometry = new THREE.PlaneGeometry(1500, 1500, 100, 100)
    const groundMeshMaterial = new THREE.MeshStandardMaterial({ color: '#4D6F39', side: THREE.DoubleSide })

    const groundMesh = new THREE.Mesh(groundGeometry, groundMeshMaterial)
    groundMesh.receiveShadow = true

    groundMesh.rotation.x = -Math.PI / 2

    groundMesh.position.set(0, this.planPosition, 0)

    world.addBody(groundBody)
    scene.add(groundMesh)

    await this.loadModels(scene, world)
  }

  async loadModels(scene, world) {
    const gltfLoader = new GLTFLoader()

    await this.loadTrees(scene, world, gltfLoader)

    await this.loadRocks(scene, world, gltfLoader)

    await this.loadFens(scene, world, gltfLoader)

    await this.loadHouses(scene, world, gltfLoader)
  }

  async loadModel(path, gltfLoader) {
    return new Promise((resolve, _) => {
      gltfLoader.load(path, (gltfModel) => {
        resolve(gltfModel)
      })
    })
  }

  async loadTrees(scene, _, gltfLoader) {
    const gltfModel = await this.loadModel('models/tree/scene.gltf', gltfLoader)

    gltfModel.scene.traverse(function(node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })

    gltfModel.scene.children[0].scale.set(5, 7, 7)

    let treeRight

    for (let i = 600; i >= -600; i -= 300) {
      if (i == 0) {
        i = 100
      }
      treeRight = gltfModel.scene.children[0].clone()

      treeRight.position.z += i
      treeRight.position.x = 50
      treeRight.position.y = -8

      scene.add(treeRight)
    }

    let treeLeft

    for (let i = 600; i >= -600; i -= 300) {
      if (i == 0) {
        i = 100;
      }

      treeLeft = gltfModel.scene.children[0].clone()
      treeLeft.position.z += i
      treeLeft.position.x += -140
      treeLeft.position.y = -8
      scene.add(treeLeft)
    }
  }

  async loadRocks(scene, world, gltfLoader) {
    const gltfModel = await this.loadModel('models/rock/scene.gltf', gltfLoader)

    gltfModel.scene.scale.set(6, 6, 6)
    gltfModel.scene.position.y = 2

    for (let i = 0; i < 60; i++) {
      const subTree = gltfModel.scene.clone()

      subTree.position.x = (Math.random() - 0.5) * 80
      subTree.position.z = (Math.random() - 0.5) * -750
      subTree.position.y = -5

      scene.add(subTree)

      const bbox = new THREE.Box3().setFromObject(subTree)
      const size = bbox.getSize(new THREE.Vector3())

      size.x -= 1
      size.y -= 1
      size.z -= 1

      const shape = new CANNON.Box(new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5))
      const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        position: new CANNON.Vec3(subTree.position.x + 0.2, subTree.position.y, subTree.position.z + 1),
      })

      world.addBody(body)
    }
  }

  async loadFens(scene, _, gltfLoader) {
    const gltfModel = await this.loadModel('models/fens/scene.gltf', gltfLoader)
    gltfModel.scene.scale.set(15, 15, 15)
    gltfModel.scene.position.set(-25, -5, 40)
    gltfModel.scene.rotation.y = Math.PI * 0.5

    gltfModel.scene.traverse(function(node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    });

    let fens

    for (let i = -18; i < 18; i++) {
      fens = gltfModel.scene.clone()
      fens.position.z = fens.position.z * i
      fens.position.y = -3
      scene.add(fens)
    }

    gltfModel.scene.position.set(225, 4, 40)
    gltfModel.scene.rotation.y = Math.PI * 0.5

    let fens2

    for (let i = -18; i < 18; i++) {
      fens2 = gltfModel.scene.clone()
      fens2.position.z = fens2.position.z * i
      fens2.position.y = -3
      scene.add(fens2)
    }

    gltfModel.scene.rotation.y = Math.PI
    gltfModel.scene.position.set(24.6, 5, -800)

    let fens3

    for (let i = -5; i < 5; i++) {
      fens3 = gltfModel.scene.clone()
      fens3.position.x += i * 25
      fens3.position.y = -3
      scene.add(fens3)
    }
  }

  async loadHouses(scene, _, gltfLoader) {
    const gltfModel = await this.loadModel('models/house/scene.gltf', gltfLoader)
    gltfModel.scene.traverse(function(node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })

    gltfModel.scene.children[0].scale.set(10, 10, 10)
    gltfModel.scene.children[0].position.set(100, 0, 0)
    gltfModel.scene.children[0].rotation.z = -Math.PI / 2

    let hosueOne

    for (let i = 0; i >= -660; i -= 330) {
      hosueOne = gltfModel.scene.children[0].clone()
      hosueOne.position.z += i
      hosueOne.position.y = -5
      scene.add(hosueOne)
    }

    gltfModel.scene.children[0].position.set(-100, 0, 0)
    gltfModel.scene.children[0].rotation.z = Math.PI / 2

    let hosueTwo

    for (let i = 0; i >= -660; i -= 330) {
      hosueTwo = gltfModel.scene.children[0].clone()
      hosueTwo.position.z += i
      hosueTwo.position.y = -5
      scene.add(hosueTwo)
    }
  }
}
