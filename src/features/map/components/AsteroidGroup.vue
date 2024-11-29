<template >
    <div class="asteroid"></div>
</template>

<script>
import * as THREE from 'three'

const SIZE = 0.08
const material = new THREE.MeshBasicMaterial({ color: "#8f102b", wireframe: true })

const shape = new THREE.Shape();

const x = 0;
const y = 0;

shape.moveTo(x - 2*SIZE, y - 2*SIZE);
shape.lineTo(x + 2*SIZE, y - 2*SIZE);
shape.lineTo(x, y + 2*SIZE);

const triGeometry = new THREE.ShapeGeometry(shape);

export default {
    name: 'AsteroidGroup',
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
        innerRadius: {
            type: Number,
            default: 1,
        },
        outerRadius: {
            type: Number,
            default: 2,
        },
        wireframeColor: {
            type: String,
            default: "#8f102b",
        },
        count: {
            type: Number,
            default: 1000
        },
        orbitSpeed: {
            type: Number,
            default: 1
        }
        
        
    },
    data() {
        return {
            mesh: null,
            dataPoints: [],
        }
    },
    mounted() {
        this.createAsteroid()
    },
    beforeDestroy() {
        if (this.mesh && this.$parent.scene) {
            this.$parent.scene.remove(this.mesh)
            this.mesh.geometry.dispose()
            this.mesh.material.dispose()
        }
    },
    methods: {
        createAsteroid() {
            this.mesh = new THREE.InstancedMesh(triGeometry, material, this.count)
            let dummy = new THREE.Object3D()
            const MIN_SIZE = 0.1
            const MAX_SIZE = 0.3

            for (let i = 0; i < this.count; i++) {
                const radius = Math.random() * (this.outerRadius - this.innerRadius) + this.innerRadius
                const angle = Math.random() * Math.PI * 2
                const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE
                const axis = new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1, 
                    Math.random() * 2 - 1
                ).normalize()                 
                this.dataPoints.push({radius, angle, size, axis})

                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                dummy.position.set(x, 0, y)
                dummy.scale.set(size, size, size)
                dummy.lookAt(axis)
                dummy.updateMatrix()
                this.mesh.setMatrixAt(i, dummy.matrix)
            }
            
            this.mesh.position.set(this.position.x, this.position.y, this.position.z)
            this.mesh.instanceMatrix.needsUpdate = true

            if (this.$parent.scene) {
                this.$parent.scene.add(this.mesh)
                console.log("Added to scene")
            }
        },
        updateRotation(deltaTime){
            //this.mesh.rotation.y += 0.0001 * deltaTime * this.rotateSpeed
            const dummy = new THREE.Object3D()
            for (let i = 0; i < this.count; i++) {
                let radius = this.dataPoints[i].radius
                let size = this.dataPoints[i].size

                let orbitspeed = 0.01/Math.pow(radius, 3/2) * this.orbitSpeed

                let angle = this.dataPoints[i].angle + orbitspeed * Date.now()
                
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                dummy.position.set(x, 0, y)
                dummy.scale.set(size, size, size)

                dummy.updateMatrix()
                this.mesh.setMatrixAt(i, dummy.matrix)

            }
            this.mesh.instanceMatrix.needsUpdate = true
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
                if (this.mesh) {
                    this.mesh.rotation.set(0,0,0)
                    this.mesh.rotateX(newRotation.x)
                    this.mesh.rotateY(newRotation.y)
                    this.mesh.rotateZ(newRotation.z)
                }
            },
            deep: true
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
.asteroid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
</style>