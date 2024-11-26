<template>
    <div class="map-container">
        <canvas ref="mapCanvas">
        <Planet v-for="planet in planets" 
            :key="planet.id"
            :position="planet.position"
            :radius="planet.radius" />
        </canvas>
        <div class="map-overlay">
            <div class="map-overlay-content">
                <div v-for="planet in planets">
                    <TerminalButton @click="() => planetSelected(planet.id)"
                        :text="planet.description.name"
                    
                        />
                </div>
            </div>
        </div>
    </div>
</template>

  
<script>
import * as THREE from 'three'
import Planet from './Planet.vue'
import TerminalButton from './TerminalButton.vue';

const defaultPlanet = {
  position: { x: 0, y: 0, z: 0 },
  radius: 1,
  orbits: null,
  orbitRadius: 0,
  orbitSpeed: null,
  rotateSpeed: 0.01,
  rotation: { x: 0, y: 0, z: 0 }
}

const planetDescriptions = {
    1: {
        name: "Aine",
        mass: "0.6 sol",
        description: "The Sun of this system",
    },
    2: {
        name: "Lugos",
        mass: "0.2 M🜨",
        description: "Tidally locked and without any atmosphere, Lugus is probably the least hospitable planet in this system."
    },
    3: {
        name: "Sucellus",
    },
    4: {
        name: "Sirona",
    },
    5: {
        name: "Bodua",
    },
    6: {
        name: "Belisama",
    },
    7: {
        name: "Toutatis",
    },
    8: {
        name: "The Hudson-Lilah Belt",
    },
    9: {
        name: "",
    },
}

const planetData = [
    { // Aine (Sun)
        ...defaultPlanet,
        id: 1,
        position: { x: 0, y: 0, z: 0 },
        radius: 5,
        orbits: null,
        rotateSpeed: 3,
    },
    //#region Terrestrials
    { // Lugus
        ...defaultPlanet,
        id: 2,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.35,
        orbits: 1,
        orbitRadius: 7,
        rotateSpeed: 3,
    },
    { // Sucellus
        ...defaultPlanet,
        id: 3,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.25,
        orbits: 1,
        orbitRadius: 15,
        rotateSpeed: 3,
    },
    { // Sirona
        ...defaultPlanet,
        id: 4,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.7,
        orbits: 1,
        orbitRadius: 25,
        rotateSpeed: 3,
    },
    { // Bodua
        ...defaultPlanet,
        id: 5,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.5,
        orbits: 1,
        orbitRadius: 34,
        rotateSpeed: 3,
    },
    //#endregion
    //#region Gas Giants
    { // Nemetoma
        ...defaultPlanet,
        id: 6,
        position: { x: 0, y: 0, z: 0 },
        radius: 1.5,
        orbits: 1,
        orbitRadius: 42,
        rotateSpeed: 3,
    },
    { // Toutatis
        ...defaultPlanet,
        id: 7,
        position: { x: 0, y: 0, z: 0 },
        radius: 1.9,
        orbits: 1,
        orbitRadius: 55,
        rotateSpeed: 3,
    }
    //#endregion

]

planetData.forEach(data => {
    data.description = planetDescriptions[data.id]
});

export default {
name: "PlanetMap",
components: {
    Planet: Planet,
    TerminalButton
},
data() {
    return {
    scene: null,
    camera: null,
    renderer: null,
    testCube: null,
    planets: planetData,
    }
},
mounted() {
    this.initScene()
    //this.addTestCube()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)
},
beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize)
},
methods: {
    initScene() {
        // Create scene
        this.scene = new THREE.Scene()
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            10000 // Far clipping plane
        )
        this.camera.position.z = 40
        this.camera.position.y = 65
        this.camera.lookAt(0, 0, 0)
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.$refs.mapCanvas,
            antialias: true
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        
        // Add some basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(1, 1, 1)
        this.scene.add(ambientLight)
        this.scene.add(directionalLight)
    },
    addTestCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
        this.testCube = new THREE.Mesh(geometry, material)
        this.scene.add(this.testCube)
    },
    animate() {
        this.calculateOrbits()
        this.updatePlanets()
        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera)
    },
    calculateOrbits() {
        let planets = this.planets
        planets.sort((a, b) => a.orbits || 0 - b.orbits || 0);
        let ids_to_planets = {}
        planets.forEach((planet) => {
            ids_to_planets[planet.id] = planet
        });


        for (let i = 0; i < planets.length; i++) {
            let planet = planets[i]
            if (planet && planet.orbits != null) {
                let parent = ids_to_planets[planet.orbits]
                if (planet.orbitSpeed == null) {
                    planet.orbitSpeed = 0.01/Math.pow(planet.orbitRadius, 3/2)
                }
                planet.position.x = parent.position.x + planet.orbitRadius * Math.cos(planet.orbitSpeed * Date.now())
                planet.position.z = parent.position.z + planet.orbitRadius * Math.sin(planet.orbitSpeed * Date.now())
            }
        }
    },
    updatePlanets() {
        this.planets.forEach((planet) => {
            this.$set(planet.rotation, 'y', planet.rotation.y + planet.rotateSpeed)
            // console.log(planet.rotation.y)
            // TODO rotate
        });
    },
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    planetSelected(id) {
        console.log("Selected Planet", id)
    }
}
}
</script>
  
<style scoped>
.map-container {
width: 100%;
height: 100vh;
overflow: hidden;
position: relative;
border-radius: 2vh;
}

canvas {
display: block;
}

.map-overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}

.map-overlay-content {
color: white;
padding: 10px;

}

.map-overlay h1 {
color: rgb(0, 228, 0);
font-size: 24px;
font-family: 'Dune Rise';
margin-bottom: 10px;
}

.map-overlay-content {
font-size: 16px;
bottom: 0;
left: 0;
position: absolute;
}
</style>
