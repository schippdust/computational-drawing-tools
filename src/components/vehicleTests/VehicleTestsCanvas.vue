<script setup>
import P5 from 'p5'
import { useRouter } from 'vue-router'
const router = useRouter()
import { saveImageAndCsv } from '@/store/storeUtils'
import {
  MovingTarget,
  Tracer,
} from '@/components/vehicleTests/VehicleTestsClasses.js'
import { watch, onMounted } from 'vue'

import { useVehicleTestStore } from '@/store/vehicleTestStore'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount } from 'vue'
const vehicleTestStore = useVehicleTestStore()
const { saveToggle, drawRecord, playing, printIteration, maxIterations } =
  storeToRefs(vehicleTestStore)

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

      for (let i = 0; i < 150; i++) {
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
      if (
        (s.frameCount % 250 == 0 &&
          s.frameCount > 850 &&
          s.frameCount < 2600) ||
        s.frameCount == 850
      ) {
        printCanvas()
      }
      if (s.frameCount % 50 == 0) {
        console.log(s.frameCount)
      }
      if (playing.value && s.frameCount < 2600) {
        s.background(0)
        movingTarget.wander()
        movingTarget.draw()
        tracers.forEach((tracer) => {
          tracer.seak(movingTarget.basePoint)
          tracer.draw()
        })
      }
      if (s.frameCount == 2600) {
        printIteration.value += 1
        if (printIteration.value < maxIterations.value) {
          router.go()
        } else {
          console.log('navigating')
          router.push({ name: 'Home' })
        }
      }
    }
  }

  new P5(sketch, 'canvas')
})
function printCanvas() {
  vehicleTestStore.resetDrawRecord()
  for (let tracer of tracers) {
    vehicleTestStore.addPolylineToDrawRecord(tracer.polylinePoints.items)
  }

  saveImageAndCsv('simple flow', drawRecord.value)
}
watch(saveToggle, () => {
  printCanvas()
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
