<template>
    <div class="map-container">
        <canvas ref="mapCanvas">
        <Planet v-for="planet in planets" 
            :key="planet.id"
            :position="planet.position"
            :radius="planet.radius"
            :rotateSpeed="planet.rotateSpeed"
            :resolution="planet.resolution"
            ref="planet"/>
        <AsteroidGroup v-for="object in beltObjects" 
            :key="object.id"
            :position="object.position"
            :innerRadius="object.innerRadius"
            :outerRadius="object.outerRadius"
            :count="object.count"
            :orbitSpeed="object.orbitSpeed"
            ref="beltobj"/>
        </canvas>
        <div class="map-overlay">
            <div class="map-overlay-content">
                <div v-for="planet in planets">
                    <TerminalButton @click="() => planetSelected(planet.id)"
                        :text="planet.description.name"
                    
                        />
                </div>
            </div>
            <div class="planet-description-mask">
                
                <div class="planet-description-content" :class="{ typing: isTyping }">
                    <h1 :class="{ typing: isTyping }">{{selectedPlanetInfo.name}}</h1>
                    <p><strong>{{selectedPlanetInfo.mass}}</strong></p>
                    <hr>
                    <br>
                    <p><strong>{{selectedPlanetInfo.description}}</strong></p>
                    <br>
                    <hr>
                    
                </div>
                
            </div>
        </div>
    </div>
</template>

  
<script>
import * as THREE from 'three'
import Planet from './Planet.vue'
import AsteroidGroup from './AsteroidGroup.vue'
import TerminalButton from './TerminalButton.vue';

const defaultPlanet = {
  position: { x: 0, y: 0, z: 0 },
  radius: 1,
  orbits: null,
  orbitRadius: 0,
  orbitSpeed: null,
  rotateSpeed: 0.01,
  rotation: { x: 0, y: 0, z: 0 },
}

const planetDescriptions = {
    1: {
        name: "Aine",
        mass: "0.6 M☉",
        description: "The Sun of this system. The red dwarf leaves a cool light on the system, filling the system with a sense of melancholy.",
    },
    2: {
        name: "Lugos",
        mass: "0.2 M🜨",
        description: "Tidally locked and without any atmosphere, Lugus is probably the least hospitable planet in this system."
    },
    3: {
        name: "Sucellus",
        mass: "0.1 M🜨",
        description: "Located in the middle of the Hudson-Lilah Belt, this small dwarf planet acts as a critical resource node for the systems power grid."
    },
    4: {
        name: "Sirona",
        mass: "2.3 M🜨",
        description: "Sirona is a rocky planet with a rocky core and a hot, dense atmosphere. It is the most habitable planet in this system."
    },
    5: {
        name: "Bodua",
        mass: "0.5 M🜨",
        description: "Cold and small. This planet has little of value to note other than a couple research stations with populations in the triple digits."
    },
    6: {
        name: "Nemetoma",
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

const BLANK_PLANET_DESCRIPTION = {
    name: "",
    mass: "",
    description: ""
}


const planetData = [
    { // Aine (Sun)
        ...defaultPlanet,
        id: 1,
        position: { x: 0, y: 0, z: 0 },
        radius: 5,
        orbits: null,
        rotateSpeed: 0.2,
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
        resolution: 2,
    },
    { // Sucellus
        ...defaultPlanet,
        id: 3,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.25,
        orbits: 1,
        orbitRadius: 15,
        rotateSpeed: 3,
        resolution: 4,
    },
    { // Sirona
        ...defaultPlanet,
        id: 4,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.7,
        orbits: 1,
        orbitRadius: 25,
        rotateSpeed: 3,
        resolution: 4,
    },
    { // Bodua
        ...defaultPlanet,
        id: 5,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.5,
        orbits: 1,
        orbitRadius: 34,
        rotateSpeed: 3,
        resolution: 4,
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

const beltData = [
    { // Hudson-Lilah Belt
        id: 100,
        position: { x: 0, y: 0, z: 0 },
        innerRadius: 12,
        outerRadius: 18,
        orbits: 1,
        count: 500,
    },
    { // Tuotatis belt
        id: 101,
        position: { x: 0, y: 0, z: 0 },
        innerRadius: 4,
        outerRadius: 6,
        orbits: 7,
        orbitSpeed: 0.2,
        count: 100,
    },
    { // Sirona belt
        id: 102,
        position: { x: 0, y: 0, z: 0 },
        innerRadius: 1.3,
        outerRadius: 1.9,
        orbits: 4,
        orbitSpeed: -0.07,
        count: 200,
    },


]


planetData.forEach(data => {
    data.description = planetDescriptions[data.id]
});

let idsToPlanets = {}
planetData.forEach((planet) => {
    idsToPlanets[planet.id] = planet
});

let idsToBelts = {}
beltData.forEach((belt) => {
    idsToBelts[belt.id] = belt
});



export default {
name: "PlanetMap",
components: {
    Planet,
    TerminalButton,
    AsteroidGroup,
},
data() {
return {
    scene: null,
    camera: null,
    renderer: null,
    testCube: null,
    planets: planetData,
    beltObjects: beltData,
    focusedPlanet: 1,
    cameraDistance: 40,
    lookpos: new THREE.Vector3(0,0,0),
    targetPosition: new THREE.Vector3(0,0,0),
    lastTime: Date.now(),
    selectedPlanetInfo: BLANK_PLANET_DESCRIPTION,
    isTyping: true
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

        // Create a plane for the background
        
        const shape = new THREE.Shape();

        const x = 0;
        const y = 0;
        const s = 4
        shape.moveTo(x - s, y - s);
        shape.lineTo(x + s, y - s);
        shape.lineTo(x + s, y + s);
        shape.lineTo(x - s, y + s);

        const quadGeometry = new THREE.ShapeGeometry(shape);
        
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcfcfcf, wireframe:true })

        const plane = new THREE.InstancedMesh(quadGeometry, planeMaterial, 100*100)
        const dummy = new THREE.Object3D();
        dummy.rotateX(-Math.PI/2)
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                dummy.position.set((i-50)*s*2, 0, (j-50)*s*2)
                
                dummy.updateMatrix();
                plane.setMatrixAt(i*100 + j, dummy.matrix);
            }
        }
        plane.instanceMatrix.needsUpdate = true

        plane.position.set(0, -5, 0)
        this.scene.add(plane)

        this.renderer.setClearColor(0xf4f4f4, 1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate() {
        const deltaTime = Date.now() - this.lastTime
        this.lastTime = Date.now()
        this.calculateOrbits()
        this.updatePlanets(deltaTime)
        this.positionCamera(deltaTime)
        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera)
    },
    calculateOrbits() {
        let planets = this.planets
        planets.sort((a, b) => a.orbits || 0 - b.orbits || 0);
        
        for (let i = 0; i < planets.length; i++) {
            let planet = planets[i]
            if (planet && planet.orbits != null) {
                let parent = idsToPlanets[planet.orbits]
                if (planet.orbitSpeed == null) {
                    planet.orbitSpeed = 0.01/Math.pow(planet.orbitRadius, 3/2)
                }
                planet.position.x = parent.position.x + planet.orbitRadius * Math.cos(planet.orbitSpeed * Date.now())
                planet.position.z = parent.position.z + planet.orbitRadius * Math.sin(planet.orbitSpeed * Date.now())
            }
        }

        this.beltObjects.forEach((belt) => {
            belt.position.x = idsToPlanets[belt.orbits].position.x
            belt.position.z = idsToPlanets[belt.orbits].position.z
        });
    },
    updatePlanets(deltaTime) {
        this.$refs.beltobj.forEach((obj) => {
            obj.updateRotation(deltaTime)
        });

        this.$refs.planet.forEach((planet) => {
            planet.updateRotation(deltaTime)
        });
    },
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    planetSelected(id) {
        // console.log("Selected Planet", id)
        if (this.focusedPlanet == id) {
            return
        }
        this.focusedPlanet = id
        this.selectedPlanetInfo = BLANK_PLANET_DESCRIPTION
        this.isTyping = false
        setTimeout(() => {
            this.selectedPlanetInfo = planetDescriptions[id]
            this.isTyping = true
        }, 500);
    },
    positionCamera(deltaTime){
        let facingNormal = new THREE.Vector3(0, 65, 40)
        facingNormal = facingNormal.normalize()

        function lerp(x, y, offset) {
            return x + (y - x) * offset
        }
        
        const LERPSPEED = 0.005
        const lerpAmount = LERPSPEED * deltaTime;
        //const lerpAmount = 1;

        if (this.focusedPlanet == 1){ // Aine
            this.cameraDistance = lerp(this.cameraDistance, 60, lerpAmount)
        } else {
            this.cameraDistance = lerp(this.cameraDistance, 20, lerpAmount)
        }

        let planet = idsToPlanets[this.focusedPlanet]

        let planetPos = new THREE.Vector3(planet.position.x, planet.position.y, planet.position.z)
        this.targetPosition = this.targetPosition.lerp(planetPos, lerpAmount) 
        //console.log(planetPos)
        this.lookpos = this.lookpos.lerp(planetPos, lerpAmount)




        let cameraPosition = new THREE.Vector3().addVectors(this.targetPosition, facingNormal.multiplyScalar(this.cameraDistance))
        this.camera.position.x = cameraPosition.x
        this.camera.position.y = cameraPosition.y
        this.camera.position.z = cameraPosition.z
        
        this.camera.lookAt(this.lookpos.x, this.lookpos.y, this.lookpos.z)
    }
},

watch: {

},
}
</script>
  
<style scoped>
.map-container {
width: 100%;
height: 100%;
overflow: hidden;
position: relative;
border-radius: 2vh;
outline: solid 2px #8f102b;
}

canvas {
display: block;
background-color: white;
}

.map-overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}

.map-overlay h1 {
font-size: 72px;
font-family: 'Dune Rise';
margin-bottom: 10px;
}

.map-overlay-content {
font-size: 16px;
bottom: 0;
left: 0;
position: absolute;
margin: 15;
padding: 2vh;

}

.planet-description-back { 
    position: absolute;
    top: 0;
    left: 0;
    width: max-content;
    height: 100%;
    /* background-color: #f4f4f480; */
    background-color: #fffffff4;
    /* filter: blur(40px); */
}

.planet-description-mask {
position: absolute;
right: 20vh;
top: 15%;
width: fit-content;
height: 100%;

}
.planet-description-content {
font-size: 16px;

position: relative;
color: #8f102b;
font-family: 'Dune Rise';
white-space: nowrap;
overflow: hidden;
justify-content: center;
margin: 0 auto;
backdrop-filter: blur(2px);
background-color: #f4f4f445;
padding: 10px;


}

.planet-description-content :hover {
    background-color: rgba(0, 0, 0, 0.1);
}


.planet-description-content p{

text-wrap: wrap;
max-inline-size: 40vh;

}

.planet-description-content hr{
color: #8f102b;
background-color: #8f102b;
border: none;
height: 2px
}

.typing {
    animation: typing 0.5s ease-out;
}

@keyframes typing {
    from {
        width: 0;

    }
    to {
        width: 100%;

    }
}

</style>
