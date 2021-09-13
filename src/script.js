import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {
    BoxBufferGeometry,
    Color,
    PCFSoftShadowMap
} from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

//Textures for the door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

//Textures for the walls
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

//Texture for the floor 
const floorColorTexture = textureLoader.load('/textures/grass/color.jpg')
const floorAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const floorNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const floorRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

//Make the grass size smaller
floorColorTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorAmbientOcclusionTexture.repeat.set(8, 8)
floorRoughnessTexture.repeat.set(8, 8)

//Make the grass repeat on every axes
floorColorTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
floorRoughnessTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
floorRoughnessTexture.wrapT = THREE.RepeatWrapping





/**
 * House
 */
const house = new THREE.Group()


scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture

    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = 2.5 / 2
house.add(walls)

//Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
        color: '#b35f45'
    })
)
roof.position.y = 2.5 + 1 / 2
roof.rotation.y = Math.PI / 4
house.add(roof)

//Door 
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture

    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 4 / 2 + 0.01
house.add(door)

//Bushes
const bushesGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#89c854'
})

const bush1 = new THREE.Mesh(bushesGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
house.add(bush1)

const bush2 = new THREE.Mesh(bushesGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
house.add(bush2)

const bush3 = new THREE.Mesh(bushesGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
house.add(bush3)

const bush4 = new THREE.Mesh(bushesGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
house.add(bush4)


//Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: '#b2b6b1'
})

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}




// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        aoMap: floorAmbientOcclusionTexture,
        normalMap: floorNormalTexture,
        roughnessMap: floorRoughnessTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

//Door light 
const doorLight1 = new THREE.PointLight('#ff7d46', 1.2, 7)
doorLight1.position.set(0, 2.2, 2.7)

const doorLight2 = new THREE.PointLight('#b9d5ff', 1, 7)
doorLight2.position.set(0, 2.2, 2.7)
house.add(doorLight1, doorLight2)

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#f3f3f3', 2, 3)
const ghost2 = new THREE.PointLight('#2f8a1b', 2, 3)
const ghost3 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = (Math.PI / 2) - 0.05
controls.maxDistance = 15
controls.minDistance = 3

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')


//Sounds effects
const listener = new THREE.AudioListener()
camera.add(listener)

//Creating the sound
const ghostSound = new THREE.Audio(listener)

const audioLoader = new THREE.AudioLoader
audioLoader.load(
    '/sounds/scary.mp3',
    (buffer) => {
        /**
         * Setting up personnal tweeks for the sound effect 
         */
        ghostSound.setBuffer(buffer);
        ghostSound.setLoop(true);
        ghostSound.setVolume(0.02); 
        ghostSound.play()
        /*  ghostSound.play();
         ghostSound.setRefDistance(5)
         ghostSound.setMaxDistance(10) */
    }
)
console.log(ghostSound.getDistanceModel);

//Linking the sound to a mesh 
ghost3.add(ghostSound)
ghost2.add(ghostSound)
ghost1.add(ghostSound)


/**
 * Shadows
 */
//For the lights
moonLight.castShadow = true
doorLight1.castShadow = true
doorLight2.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

//For the floor
floor.receiveShadow = true

//For the objects
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true



moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// ...

doorLight1.shadow.mapSize.width = 256
doorLight1.shadow.mapSize.height = 256
doorLight1.shadow.camera.far = 7

doorLight2.shadow.mapSize.width = 256
doorLight2.shadow.mapSize.height = 256
doorLight2.shadow.camera.far = 7

// ...

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

// ...

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

// ...

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap


//Event to pause the sound 
addEventListener('keypress', (evt) => {
    console.log(evt)
    if (evt.code === "KeyS") {
        ghostSound.pause()
    } else if(evt.code === "KeyP") {
        ghostSound.play()
    }
})

addEventListener('onload', () => {
    ghostSound.play()
})
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Update Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)
    ghost1.position.z = Math.sin(ghost1Angle) * 4

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.1)
    ghost2.position.z = Math.sin(ghost2Angle) * 5

    const ghost3Angle = elapsedTime * 3
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.y = Math.sin(elapsedTime * 1)
    ghost3.position.z = Math.sin(ghost3Angle) * 7


    // Update controls
    controls.update()
    //Update camera

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()