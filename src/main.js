import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { Cannon } from './cannon'
import { Light } from './light'
import { RandomLevel } from './random-level'
import { Scenario } from './scenario'
import { Score } from './score'

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000)
camera.position.set(0, 0, 20)

// Scene
const scene = new THREE.Scene()
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

// Scenario
const scenario = new Scenario()
scenario.create(scene, world, renderer)

// Level random
const randomLevel = new RandomLevel()
randomLevel.create(scene, world)

// Score
const scoreManager = new Score()

function checkKnockedOverCubes() {
  randomLevel.cubes.forEach(cube => {
    if (cube.body.position.y < scoreManager.threshold && !cube.knockedOver) {
      cube.knockedOver = true
      scoreManager.addPoints()
    }
  })
}

//Cannon object
const cannon = new Cannon()
cannon.create(scene)

// Event listeners
window.addEventListener('mousemove', (event) => {
  cannon.updateRefereceBallPosition(scene, event)
})

window.addEventListener('click', (event) => {
  cannon.shot(scene, world, event)
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Animate
function animate() {
  world.fixedStep()

  randomLevel.animateLevel()

  cannon.animateBalls()

  cannon.animateExplosion()

  checkKnockedOverCubes()

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
