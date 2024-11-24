<template>
    <div class="map-container">
      <canvas ref="mapCanvas"></canvas>
      <Planet v-for="planet in planets" 
             :key="planet.id"
             :position="planet.position"
             :radius="planet.radius" />
    </div>
</template>
  
<script>
import * as THREE from 'three'
import Planet from './Planet.vue'

export default {
name: 'Map',
components: {
    Planet
},
data() {
    return {
    scene: null,
    camera: null,
    renderer: null,
    testCube: null,
    planets: [
        {
        id: 1,
        position: { x: 0, y: 0, z: 0 },
        radius: 2,
        orbits: null
        },
        {
        id: 2,
        position: { x: 0, y: 0, z: 0 },
        radius: 1,
        orbits: 1,
        orbitRadius: 5,
        orbitSpeed: 0.01
        }
        // Add more planets as needed
    ]
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
            1000 // Far clipping plane
        )
        this.camera.position.z = 5
        
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
        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera)
    },
    calculateOrbits() {
        let planets = this.planets
        planets.sort((a, b) => a.orbits || 0 - b.orbits || 0);
        let ids_to_planets = {}
        debugger;
        planets.forEach((planet) => {
            ids_to_planets[planet.id] = planet
        });


        for (let i = 0; i < planets.length; i++) {
            let planet = planets[i]
            if (planet.orbits !== null) {
                let parent = ids_to_planets[planet.orbitParent]
                planet.position.x = parent.position.x + planet.orbitRadius * Math.cos(planet.orbitSpeed * Date.now())
                planet.position.y = parent.position.y + planet.orbitRadius * Math.sin(planet.orbitSpeed * Date.now())
            }
        }
    },
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
}
</script>
  
<style scoped>
.map-container {
width: 100%;
height: 100vh;
overflow: hidden;
}

canvas {
display: block;
}
</style>
