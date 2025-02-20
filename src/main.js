import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { Cannon } from './cannon'
import { Light } from './light'
import { RandomLevel } from './random-level'

const balls = []
const { innerWidth, innerHeight } = window;

// Camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, 1000)
camera.position.set(0, 0, 20)

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x000000, 500, 1000)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(scene.fog.color)

renderer.outputEncoding = THREE.sRGBEncoding

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.body.appendChild(renderer.domElement)

// Lights
const { ambientLight, directionalLight } = new Light().create()
scene.add(ambientLight)
scene.add(directionalLight)

// World
const world = new CANNON.World()
world.gravity.set(0, -9.81, 0)

// Level random
const { table, cubes } = new RandomLevel().create()

scene.add(table.mesh)
world.addBody(table.body)

for (const cube of cubes) {
  world.addBody(cube.body)
}

//Cannon object
const { cannonpivot, cannon, referenceBallMesh } = new Cannon().create()
scene.add(cannonpivot)

function getShootDirection(event) {
  let mouseX = (event.clientX / innerWidth) * 2 - 1
  let mouseY = -(event.clientY / innerHeight) * 2 + 1.7

  let mouseVector = new THREE.Vector3(mouseX, mouseY, -1)

  let ray = new THREE.Ray(referenceBallMesh.position, mouseVector.normalize())

  return ray.direction
}

// Event listeners
window.addEventListener("mousemove", (event) => {
  
  let mousedirection = getShootDirection(event)

  cannon.rotation.y = -mousedirection.x 
  cannonpivot.rotation.x =  mousedirection.y

  // Update position reference ball
  let ballPosition = new THREE.Vector3(0, 0, -3)
  ballPosition.applyMatrix4(cannon.matrixWorld)

  referenceBallMesh.position.copy(ballPosition)
})

window.addEventListener('click', (event) => {
  const ballShape = new CANNON.Sphere(0.3)
  const ballBody = new CANNON.Body({ mass: 1 })
  ballBody.addShape(ballShape)

  const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32)
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)

  ballMesh.castShadow = true
  ballMesh.receiveShadow = true

  ballBody.position.copy(referenceBallMesh.position)
  ballMesh.position.copy(referenceBallMesh.position)

  world.addBody(ballBody)
  scene.add(ballMesh)

  ballBody.velocity.set(0, 0, 0);

  const shootVelocity = 28
  const shootDirection = getShootDirection(event)

  ballBody.velocity.set(
    shootDirection.x * shootVelocity,
    shootDirection.y * shootVelocity,
    shootDirection.z * shootVelocity
  )

  balls.push({
    mesh: ballMesh,
    body: ballBody
  })
})

// Animate
function animate() {
  world.fixedStep()

  for (const ball of balls) {
    ball.mesh.position.copy(ball.body.position)
    ball.mesh.quaternion.copy(ball.body.quaternion)
  }

  table.mesh.position.copy(table.body.position)
  table.mesh.quaternion.copy(table.body.quaternion)

  for (const cube of cubes) {
    cube.mesh.position.copy(cube.body.position)
    cube.mesh.quaternion.copy(cube.body.quaternion)
  }

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
