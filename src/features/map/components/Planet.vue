<template >
    <div class="planet"></div>
</template>

<script>
import * as THREE from 'three'

const RESOLUTION = 8
const material = new THREE.MeshBasicMaterial({ color: "#8f102b", wireframe: true })

const shape = new THREE.Shape();

const x = 0;
const y = 0;

shape.moveTo(x - 2, y - 2);
shape.lineTo(x + 2, y - 2);
shape.lineTo(x, y + 2);

const triGeometry = new THREE.ShapeGeometry(shape);

export default {
    name: 'Planet',
    props: {
        position: {
            type: Object,
            default: () => ({ x: 0, y: 0, z: 0 }),
            validator(value) {
                return Object.keys(value).every(key => typeof value[key] === 'number')
            }
        },
        rotation: {
            type: Object,
            default: () => ({ x: 0, y: 0, z: 0 }),
            validator(value) {
                return Object.keys(value).every(key => typeof value[key] === 'number')
            }
        },
        radius: {
            type: Number,
            default: 1,
        },
        wireframeColor: {
            type: String,
            default: "#8f102b",
        },
        rotateSpeed: {
            type: Number,
            default: 1,
        },
        resolution: {
            type: Number,
            default: RESOLUTION
        },
        
        
    },
    data() {
        return {
            mesh: null,
        }
    },
    mounted() {
        console.log("Planet mounted")
        this.createPlanet()
    },
    beforeDestroy() {
        if (this.mesh && this.$parent.scene) {
            this.$parent.scene.remove(this.mesh)
            this.mesh.geometry.dispose()
            this.mesh.material.dispose()
        }
    },
    methods: {
        createPlanet() {
            const geometry = new THREE.SphereGeometry(this.radius, this.resolution, this.resolution)
            this.mesh = new THREE.Mesh(geometry, material)
            this.mesh.position.set(this.position.x, this.position.y, this.position.z)
            if (this.$parent.scene) {
                this.$parent.scene.add(this.mesh)
                console.log("Added to scene")
            }

            // create the orbital lines
            let points = [];
            let angle = 0
            for(let i = 0; i < 16; i++){
                angle = 2 * Math.PI * i / 16
                points.push( new THREE.Vector3( Math.cos(angle) * this.radius, 0, Math.sin(angle) * this.radius ) );
            }
            points.push( points[0] );

        },
        updateRotation(deltaTime){
            this.mesh.rotation.y += 0.0001 * deltaTime * this.rotateSpeed
        }
    },
    watch: {
        position: {
            handler(newPosition) {
                if (this.mesh) {
                    this.mesh.position.set(newPosition.x, newPosition.y, newPosition.z)
                }
            },
            deep: true
        },
        rotation: {
            handler(newRotation) {
                console.log("Rotation changed")
                if (this.mesh) {
                    console.log("Rotation changed")
                    this.mesh.rotation.set(0,0,0)
                    this.mesh.rotateX(newRotation.x)
                    this.mesh.rotateY(newRotation.y)
                    this.mesh.rotateZ(newRotation.z)
                }
            },
            deep: true
        },
        radius: {
            handler(newRadius) {
                if (this.mesh) {
                    this.mesh.geometry.dispose()
                    this.mesh.geometry = new THREE.SphereGeometry(newRadius, RESOLUTION, RESOLUTION)
                }
            }
        },
        '$parent.scene': {
            handler(newScene) {
                if (this.mesh && newScene) {
                    newScene.add(this.mesh)
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.planet {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
</style>