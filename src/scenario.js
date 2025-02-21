import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Scenario {
  planPosition = -5

  create() {
    const groundMaterial = new CANNON.Material()

    const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      material: groundMaterial
    })

    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    groundBody.position.set(0, this.planPosition, 0)

    // floor
    const groundGeometry = new THREE.PlaneGeometry(1500, 1500, 100, 100)
    const groundMeshMaterial = new THREE.MeshStandardMaterial({ color: "#4D6F39", side: THREE.DoubleSide })

    const groundMesh = new THREE.Mesh(groundGeometry, groundMeshMaterial)
    groundMesh.receiveShadow = true

    groundMesh.rotation.x = -Math.PI / 2

    groundMesh.position.set(0, this.planPosition, 0)

    return { groundBody, groundMesh }
  }

  loadModels(scene) {
    const gltfLoader = new GLTFLoader()

    gltfLoader.load("models/tree/scene.gltf", (gltfModel) => {
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
        treeRight.position.x = 60
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
        treeLeft.position.x += -190
        treeLeft.position.y = -8
        scene.add(treeLeft)
      }
    })

    gltfLoader.load("models/rock/scene.gltf", (gltfModel) => {
      gltfModel.scene.scale.set(6, 6, 6)
      gltfModel.scene.position.y = 2

      for (let i = 0; i < 50; i++) {
        const subTree = gltfModel.scene.clone()
        subTree.position.x = (Math.random() - 0.5) * 500
        subTree.position.z = (Math.random() - 0.5) * 500
        subTree.position.y = -5
        scene.add(subTree)
      }
    })

    // gltfLoader.load("models/plants/scene.gltf", (gltfModel) => {
    //   gltfModel.scene.scale.set(0.5, 0.5, 0.5)
    //
    //   const plants = gltfModel.scene.clone()
    //
    //   plants.position.x = 0
    //   plants.position.z = 10
    //   plants.rotation.y = -5
    //
    //   scene.add(plants)
    // })

    gltfLoader.load("models/fens/scene.gltf", (gltfModel) => {
      gltfModel.scene.scale.set(15, 15, 15)
      gltfModel.scene.position.set(-120, -5, 40)
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
        fens.position.y = -1
        scene.add(fens)
      }

      gltfModel.scene.position.set(270, 4, 40)
      gltfModel.scene.rotation.y = Math.PI * 0.5

      let fens2

      for (let i = -17; i < 17; i++) {
        fens2 = gltfModel.scene.clone();
        fens2.position.z = fens2.position.z * i
        fens2.position.y = -1
        scene.add(fens2);
      }

      gltfModel.scene.rotation.y = Math.PI;
      gltfModel.scene.position.set(24.6, 5, -800)

      let fens3

      for (let i = -8; i < 7; i++) {
        fens3 = gltfModel.scene.clone();
        fens3.position.x += i * 25;
        fens3.position.y = -3
        scene.add(fens3);
      }
    })

    gltfLoader.load("models/house/scene.gltf", (gltfModel) => {
      gltfModel.scene.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true
          node.receiveShadow = true
        }
      })

      gltfModel.scene.children[0].scale.set(10, 10, 10)
      gltfModel.scene.children[0].position.set(140, 0, 0)
      gltfModel.scene.children[0].rotation.z = -Math.PI / 2

      let hosueOne;

      for (let i = 330; i >= -660; i -= 330) {
        hosueOne = gltfModel.scene.children[0].clone();
        hosueOne.position.z += i;
        hosueOne.position.y = -5;
        scene.add(hosueOne);
      }

      gltfModel.scene.children[0].position.set(-140, 0, 0);
      gltfModel.scene.children[0].rotation.z = Math.PI / 2;

      let hosueTwo;

      for (let i = 330; i >= -660; i -= 330) {
        hosueTwo = gltfModel.scene.children[0].clone();
        hosueTwo.position.z += i;
        hosueTwo.position.y = -5;
        scene.add(hosueTwo);
      }
    })

    gltfLoader.load("models/box/scene.gltf", (gltfModel) => {
      gltfModel.scene.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true
          node.receiveShadow = true
        }
      })

      gltfModel.scene.children[0].scale.set(10, 10, 10)
      gltfModel.scene.children[0].position.set(140, 11, 0)

      let boxRight;

      for (let i = 330; i > -660; i -= 330) {
        if (i === 0) {
          i = -100
        }
        boxRight = gltfModel.scene.children[0].clone();
        boxRight.position.z += i
        boxRight.position.y = 5
        scene.add(boxRight)
      }

      gltfModel.scene.children[0].position.set(-140, 11, 0)

      let boxLeft

      for (let i = 330; i > -660; i -= 330) {
        if (i === 0) {
          i = -100
        }
        boxLeft = gltfModel.scene.children[0].clone()
        boxLeft.position.z += i
        boxLeft.position.y = 5
        scene.add(boxLeft);
      }
    })
  }
}
