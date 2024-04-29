<script setup>
import P5 from 'p5'
import { BaseVehicle } from '@/classes/BaseVehicle.js'
import {
  MovingTarget,
  Tracer,
} from '@/components/vehicleTests/VehicleTestsClasses.js'
import { ref, onMounted } from 'vue'

const canvasWidth = 1000
const canvasHeight = 1000

var movingTarget = undefined
var tracers = []

onMounted(() => {
  const sketch = (s) => {
    s.setup = () => {
      s.createCanvas(canvasWidth, canvasHeight)
      s.background(240)
      s.frameRate(30)
      console.log('setup complete', s)

      movingTarget = new MovingTarget(s, 20)
      movingTarget.wanderRadius = 80
      movingTarget.coefOfFrict = 0.3
      movingTarget.wanderForwardRatio = 0.7
      movingTarget.mass = 10
      movingTarget.maxWanderAdjustment = (2 * Math.PI) / 20
      movingTarget.randomizeLocation()
      console.log('moving target', movingTarget)

      for (let i = 0; i < 10; i++) {
        let tracer = new Tracer(s)
        tracer.maxVelocity = 30
        tracer.maxSteerForce = 3
        tracer.randomizeLocation()
        tracers.push(tracer)
      }
    }

    s.draw = () => {
      s.background(240)
      movingTarget.wander()
      movingTarget.draw()
      tracers.forEach((tracer) => {
        tracer.seak(movingTarget.position)
        tracer.draw()
      })
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
