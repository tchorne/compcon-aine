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
                <div v-for="planet in pdescriptions">
                    <TerminalButton @click="() => planetSelected(planet.id)"
                        v-if="(planet.moon || false)==false || (planet.visibleUnder || []).includes(focusedPlanet) "
                        :small="planet.moon"
                        :text="planet.name"
                        />
                </div>
            </div>
            <div class="planet-description-mask">
                
                <div class="planet-description-content" :class="{ typing: isTyping }">
                    <h1 :class="{ typing: isTyping }">{{selectedPlanetInfo.name}}</h1>
                    <p><strong>{{selectedPlanetInfo.mass}}</strong></p>
                    <hr>
                    <br>
                    <p class="planet-description-description"><strong>{{selectedPlanetInfo.description}}</strong></p>
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
        order: 0,
        name: "Aine",
        mass: "0.6 M☉",
        description: "The Sun of this system. The red dwarf leaves a cool light on the system, filling the system with a sense of melancholy.",
    },
    2: {
        order: 1,
        name: "Lugos",
        mass: "0.2 M🜨",
        gravity: "0.4g",
        description: "A barren, tidally locked rock with no atmosphere, Lugos alternates between a scorched dayside and a frigid, lifeless nightside. Its pitted surface is a stark reminder of the system's earliest days."
    },
    8: {
        order: 2,
        name: "The Hudson-Lilah Belt",
        description: "A sprawling asteroid belt between Lugos and Sirona, it’s a chaotic yet vital region. The synchronized mirrors of the system's Concentrated Solar Power Network gleam among the rocks, harnessing Aine’s energy for the rest of the system."
    },    
    3: {
        order: 3,
        name: "Lilah",
        mass: "0.1 M🜨",
        gravity: "0.5g",
        moon: true,
        visibleUnder: ['8', '3'],
        description: "Known by its official name, Sucellus, this dwarf planet is a speck in the middle of the Hudson-Lilah Belt. Its name honors Lilah, one of the first twins born in the Aine system, alongside her brother Hudson, who lent his name to the surrounding asteroid belt."
    },
    4: {
        order: 4,
        name: "Sirona",
        mass: "2.3 M🜨",
        gravity: "0.4g",
        description: `The main terrestrial population center of the Aine system. The high gravitational pull requires biomechanical augmentations for anyone living there long term. Children under the age of 18 remain on the orbital colonies and perform intense physical training should they wish to live on Sirona permanently.

The asteroids that form Sirona's ring are rich with water and pure metals, making Sirona's rings the primary shipyard of the system. 

Sirona also happens to be the home of The Spire, the largest space elevator in the local star cluster, stretching all the way to the inner ring.`
    },
    5: {
        order: 5,
        name: "Bodua",
        mass: "0.5 M🜨",
        description: "A cold, remote world that feels more like an outpost than a planet. Its few research stations, nestled in deep craters to shield against the icy winds, are its only signs of activity."
    },
    6: {
        order: 6,
        name: "Nemetoma",
        mass: "24.4 M🜨",
        description: "The system's largest planet, Nemetoma, is a swirling giant of muted ochres and reds. Its many moons and floating colonies are homes to hundreds of millions of people, forming a vast, scattered web of interconnected communities."
    },
    9: {
        order: 7,
        name: "Belisama",
        mass: "0.15 M🜨",
        gravity: "0.45 g",
        moon: true,
        parent: 6,
        visibleUnder: ['6', '9', '10', '11', '12'],
        description: "Belisama’s rocky surface is riddled with jagged cliffs and sprawling craters, but its true mystery lies beneath. Its internal composition defies all known geologic models, leading scientists to theorize it might be the fragmented remnant of an ancient, alien megastructure. The moon’s enigmatic properties make it a hub for research and speculation, though mining efforts have yielded limited results."
    },
    10: {
        order: 8,
        name: "Senuna",
        mass: "0.22 M🜨",
        gravity: "0.55 g",
        moon: true,
        parent: 6,
        visibleUnder: ['6', '9', '10', '11', '12'],
        description: "Blanketed by dense, jungle-like forests, Senuna is a breathtaking example of successful terraforming. The moon’s vibrant ecosystem pulses with an almost otherworldly energy, and long-term residents often report vivid spiritual visions or even a sense of connection to the moon itself. Some dismiss this as the effects of unknown pollen or spores, but others believe Senuna holds deeper, perhaps even sentient, mysteries."
    },
    11: {
        order: 9,
        name: "Coventina",
        mass: "0.18 M🜨",
        gravity: "0.47 g",
        moon: true,
        parent: 6,
        visibleUnder: ['6', '9', '10', '11', '12'],
        description: "Almost entirely covered in liquid water, Coventina is a moon of ceaseless motion. Tidal forces from Nemetoma drive immense geothermal vents, creating an ever-changing seascape. Floating research stations and underwater habitats explore the moon’s vast depths, where unique aquatic ecosystems thrive in the mineral-rich waters."
    },
    12: {
        order: 10,
        name: "Icovelluana",
        mass: "0.25 M🜨",
        gravity: "0.62 g",
        moon: true,
        parent: 6,
        visibleUnder: ['6', '9', '10', '11', '12'],
        description: "A gleaming beacon in the void, Icovelluana’s surface is dominated by sprawling chrome cities that reflect Nemetoma’s ochre glow. The icy moon’s industrial hubs produce some of the system’s most advanced machinery, and its cutting-edge architecture is a testament to its inhabitants’ engineering prowess. Beneath its shimmering cities, vast ice reserves fuel its energy infrastructure."
    }, 
    7: {
        order: 11,
        name: "Toutatis",
        mass: "17.9 M🜨",
        description: "A gas giant encircled by an immense ring system, Toutatis is an awe-inspiring sight. Its rings, dense with ice and debris, make it a frequent target for mining and an object of fascination for astronomers."
    },
    13: {
        order: 12,
        name: "Litavis",
        mass: "0.12 M🜨",
        gravity: "0.41 g",
        moon: true,
        parent: 7,
        visibleUnder: ['7', '13', '14'],
        description: "Litavis’ surface is a maze of jagged, metallic ridges and dark chasms filled with glittering crystalline formations. Rich in rare minerals, this moon is a haven for mining operations, though its unstable terrain and frequent tectonic activity make extraction a dangerous endeavor. Despite its hazards, Litavis’ breathtaking crystal caverns are a major draw for thrill-seekers and off-world explorers alike."
    },
    14: {
        order: 13,
        name: "Dea Latis",
        mass: "0.08 M🜨",
        gravity: "0.35 g",
        moon: true,
        parent: 7,
        visibleUnder: ['7', '13', '14'],
        description: "Dea Latis is a volcanic moon cloaked in ash and fire, with rivers of molten rock carving glowing veins across its surface. Its volatile nature has deterred large-scale habitation, but its abundant geothermal energy and dense deposits of heavy metals make it a key industrial site. Automated foundries harness its intense heat to smelt ores."
    }

}

for (const [key, value] of Object.entries(planetDescriptions)){
    value.id = key
}

let planetDescriptionsArray = []
for (const [key, value] of Object.entries(planetDescriptions)){
    planetDescriptionsArray.push(value)
}

planetDescriptionsArray.sort((a, b) => a.order - b.order)


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
    },
    //#region Moons
    { // Belisama
        ...defaultPlanet,
        id: 9,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.26,
        orbits: 6,
        orbitRadius: 3,
        rotateSpeed: 3,
        resolution: 4,
    },
    { // Senuna
        ...defaultPlanet,
        id: 10,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.3,
        orbits: 6,
        orbitRadius: 4,
        rotateSpeed: 3,
        resolution: 4,
    },
    { // Coventina
        ...defaultPlanet,
        id: 11,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.3,
        orbits: 6,
        orbitRadius: 6,
        rotateSpeed: 3,
        resolution: 4,
    },
    { // Icovelluana
        ...defaultPlanet,
        id: 12,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.2,
        orbits: 6,
        orbitRadius: 6.5,
        rotateSpeed: 3,
        resolution: 4,
    },
    { // Litavis
        ...defaultPlanet,
        id: 13,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.3,
        orbits: 7,
        orbitRadius: 4.5,
        rotateSpeed: 3,
        resolution: 4,
        orbitSpeed: 0.0003

    },
    { // Dea Latis
        ...defaultPlanet,
        id: 14,
        position: { x: 0, y: 0, z: 0 },
        radius: 0.32,
        orbits: 7,
        orbitRadius: 7,
        rotateSpeed: 3,
        resolution: 4,
        orbitSpeed: 0.0002
    },
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
console.log(idsToPlanets)
idsToPlanets[8] = idsToPlanets[1];

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
    pdescriptions: planetDescriptionsArray,
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
        let myPlanets = Array.from(this.planets)
        myPlanets.sort((a, b) => a.orbits || 0 - b.orbits || 0);
        
        for (let i = 0; i < myPlanets.length; i++) {
            let planet = myPlanets[i]
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
        console.log(id)
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

        if (this.focusedPlanet == 1 || this.focusedPlanet == 8){ // Aine or Belt
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
font-size: 32px;
font-family: 'Dune Rise';
margin-bottom: 10px;
max-inline-size: 50vh;
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
white-space: pre-wrap;

}


.planet-description-description{

text-wrap: wrap;
max-inline-size: 40vh;
font-family: 'Consolas';
white-space: pre-wrap;
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
