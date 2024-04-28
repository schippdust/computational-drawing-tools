<script setup>
import P5 from 'p5'
import { BaseVehicle } from '@/classes/BaseVehicle.js'
import { MovingTarget } from '@/components/vehicleTests/VehicleTestsClasses.js'
import { ref, onMounted } from 'vue'

const canvasWidth = 1000
const canvasHeight = 1000

var movingTarget = undefined

onMounted(() => {
  const sketch = (s) => {
    s.setup = () => {
      s.createCanvas(canvasWidth, canvasHeight)
      s.background(240)
      s.frameRate(30)
      console.log('setup complete', s)

      movingTarget = new MovingTarget(s, 20)
      movingTarget.wanderRadius = 50
      movingTarget.coefOfFrict = 0.5
      movingTarget.wanderForwardRatio = 0.2
      movingTarget.mass = 15
      movingTarget.maxWanderAdjustment = (2 * Math.PI) / 5
      movingTarget.randomizeLocation()
      console.log('moving target', movingTarget)
    }

    s.draw = () => {
      s.background(240)
      movingTarget.wander()
      movingTarget.draw()
    }
  }

  new P5(sketch, 'canvas')
})
</script>

<template>
  <v-container class="pa-0 ma-0" fluid style="overflow-x: auto !important">
    <v-row class="pa-0 ma-0">
      <v-col class="pa-0 ma-0">
        <div id="canvas" />
      </v-col>
    </v-row>
  </v-container>
</template>
