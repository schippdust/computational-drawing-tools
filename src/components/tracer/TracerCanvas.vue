<script setup>
import P5 from 'p5'
import { onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { MovingTarget, Tracer } from '@/components/tracer/TracerClasses.js'
import { VehicleCollection } from '@/classes/VehicleCollection.js'
import { QuadTree } from '@/classes/QuadTree'

import { useUniveralStore } from '@/store/univeralStore'
const universalStore = useUniveralStore()
const { playing, printToggleWatcher } = storeToRefs(universalStore)
playing.value = true

import { useTracerStore } from '@/store/tracerStore'
import { Rectangle } from '@/classes/Geometry'
const tracerStore = useTracerStore()
const { canvasWidth, canvasHeight, constrainOrthogonally } =
  storeToRefs(tracerStore)

var movingTarget = undefined
let tracers = new VehicleCollection()
var activeSketch = undefined
var neighborDistance = 200
let numberOfTracers = 500
var sketch = (s) => {
  s.setup = () => {
    s.createCanvas(canvasWidth.value, canvasHeight.value)
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

    for (let i = 0; i < numberOfTracers; i++) {
      let tracer = new Tracer(s, 0, 0, constrainOrthogonally.value)
      tracer.maxVelocity = 30
      tracer.maxSteerForce = 3
      tracer.coefOfFrict = s.random(0.5, 0.8)
      tracer.polylinePoints.maxLength = 150
      tracer.desiredSeparation = 50
      tracer.randomizeLocation()
      tracers.push(tracer)
    }
  }

  s.draw = () => {
    if (s.frameCount % 50 == 0) {
      console.log(s.frameCount)
    }
    s.background(0)
    movingTarget.wander()
    movingTarget.steerToWithinBounds(
      movingTarget.boundsMin,
      movingTarget.boundsMax,
    )
    movingTarget.applyAggregateSteerForce()
    movingTarget.draw()

    let quadTreeBounds = new Rectangle(s)
    let quadTree = new QuadTree(s, quadTreeBounds)
    tracers.forEach((tracer) => {
      quadTree.insert(tracer)
    })
    tracers.forEach((tracer) => {
      tracer.neighbors = quadTree.queryRange(tracer, neighborDistance)
    })
    tracers.forEach((tracer) => {
      tracer.seakAtMaxVelocity(movingTarget.originPoint)
      tracer.flock(100, 0, 0)
      tracer.applyAggregateSteerForce()
      tracer.draw()
    })

    universalStore.automatedPrint(s.frameCount, tracers, 'tracers')
  }
}

onMounted(() => {
  activeSketch = new P5(sketch, 'canvas')
})

watch(playing, () => {
  if (playing.value) {
    activeSketch.loop()
  } else {
    activeSketch.noLoop()
  }
})

watch(constrainOrthogonally, () => {
  tracers.forEach((t) => {
    t.constrainOrthogonally = constrainOrthogonally.value
  })
})

watch(printToggleWatcher, () => {
  universalStore.print(tracers, 'tracers')
})

onUnmounted(() => {
  console.log('unmounting')
  activeSketch.remove()
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
