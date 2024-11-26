<template >
    <div class="planet"></div>
</template>

<script>
import * as THREE from 'three'

const RESOLUTION = 8

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
            default: "#ffffff",
        },
        
    },
    data() {
        return {
            mesh: null
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
            const geometry = new THREE.SphereGeometry(this.radius, RESOLUTION, RESOLUTION)
            const material = new THREE.MeshBasicMaterial({ color: this.wireframeColor, wireframe: true })
            this.mesh = new THREE.Mesh(geometry, material)
            this.mesh.position.set(this.position.x, this.position.y, this.position.z)
            if (this.$parent.scene) {
                this.$parent.scene.add(this.mesh)
                console.log("Added to scene")
            }
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