<script setup>
import P5 from 'p5'
import { useConnectionsStore } from '@/store/connectionsStore'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { LinearVehicleCollection } from './ConnectionsClasses'

const connectionsStore = useConnectionsStore()
const { canvasWidth, canvasHeight, noiseTime, playing } =
  storeToRefs(connectionsStore)
let pressed = false
onMounted(() => {
  const sketch = (s) => {
    s.linearVehicles = undefined
    s.startPpoint = undefined
    s.endPoint = undefined

    s.setup = () => {
      s.createCanvas(canvasWidth.value, canvasHeight.value)
      s.background(255)
      // s.noLoop()
      s.frameRate(30)
      s.linearVehicles = new LinearVehicleCollection(
        canvasWidth.value,
        canvasHeight.value,
        noiseTime.value,
        s,
      )
      console.log('setup run', s)
    }

    s.draw = () => {
      if (playing.value) {
        s.linearVehicles.update(noiseTime.value)
      }
    }

    s.mousePressed = () => {
      if (playing.value && s.mouseX >= 0 && s.mouseY >= 0) {
        s.startPoint = s.createVector(s.mouseX, s.mouseY)
        pressed = true
      }
    }

    s.mouseReleased = () => {
      if (playing.value && pressed) {
        s.endPoint = s.createVector(s.mouseX, s.mouseY)
        s.stroke(50)
        let guideVector = P5.Vector.sub(s.endPoint, s.startPoint)
        let perpVector = s
          .createVector(guideVector.x, guideVector.y)
          .normalize()
          .rotate(s.HALF_PI)
        for (let i = -3; i < 4; i++) {
          let distMultiplier = 49 * i
          let moveVector = P5.Vector.mult(perpVector, distMultiplier)
          let adjustedStart = P5.Vector.add(s.startPoint, moveVector)
          s.linearVehicles.addLinearVehicle(adjustedStart, guideVector)
        }
        pressed = false
      }
    }
  }

  new P5(sketch, 'canvas')
})
</script>
<template>
  <v-container class="pa-0 ma-0" fluid style="overflow-x: auto !important">
    <v-row class="pa-0 ma-0">
      <v-col class="pa-0 ma-0">
        <div id="canvas"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.p5Canvas {
  border: 1px black solid;
}
</style>
