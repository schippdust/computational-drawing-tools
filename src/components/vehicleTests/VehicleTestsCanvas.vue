<script setup>
import P5 from 'p5'
import { onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

import {
  MovingTarget,
  Tracer,
} from '@/components/vehicleTests/VehicleTestsClasses.js'

import { useUniveralStore } from '@/store/univeralStore'
const universalStore = useUniveralStore()

import { useVehicleTestStore } from '@/store/vehicleTestStore'

const vehicleTestStore = useVehicleTestStore()
const { playing } = storeToRefs(vehicleTestStore)

const canvasWidth = 1500
const canvasHeight = 1500

var movingTarget = undefined
let tracers = []
onBeforeUnmount(() => {})
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

      for (let i = 0; i < 50; i++) {
        let tracer = new Tracer(s)
        tracer.maxVelocity = 30
        tracer.maxSteerForce = 3
        tracer.coefOfFrict = s.random(0.5, 0.8)
        tracer.polylinePoints.maxLength = 750
        tracer.randomizeLocation()
        tracers.push(tracer)
      }
    }

    s.draw = () => {
      if (s.frameCount % 50 == 0) {
        console.log(s.frameCount)
      }
      if (playing.value) {
        s.background(0)
        movingTarget.wander()
        movingTarget.draw()
        tracers.forEach((tracer) => {
          tracer.seak(movingTarget.basePoint)
          tracer.draw()
        })

        universalStore.automatedPrint(s.frameCount, tracers, 'tracers')
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
        <div id="canvas" />
      </v-col>
    </v-row>
  </v-container>
</template>
