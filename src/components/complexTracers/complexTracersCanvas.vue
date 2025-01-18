<script setup>
import P5 from 'p5'
import { onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useUniveralStore } from '@/store/univeralStore'
const univeralStore = useUniveralStore()
const { playing, printToggleWatcher } = storeToRefs(univeralStore)

//IMPORT CLASSES ASSOCIATED WITH DRAWING
import { ConnectedWanderer } from './complexTracersClasses'

//IMPORT STORE ASSOCIATED WITH DRAWING
import { useComplexTracersStore } from '@/store/complexTracersStore'
import { Rectangle } from '@/classes/Geometry'
import { QuadTree } from '@/classes/QuadTree'
const complexTracersStore = useComplexTracersStore()
const { canvasWidth, canvasHeight, sketchName } =
  storeToRefs(complexTracersStore)

var vehicles = []
var linkRecords = []
var activeSketch = undefined

var sketch = (s) => {
  s.setup = () => {
    s.createCanvas(canvasWidth.value, canvasHeight.value)
    s.background(0)
    s.frameRate(30)
    console.log('complex tracers setup initialized')

    for (let i = 0; i < 100; i++) {
      let connectedWanderer = new ConnectedWanderer(s)
      vehicles.push(connectedWanderer)
    }
  }

  s.draw = () => {
    // console.log('drawing')

    if (s.frameCount % 50 == 0) {
      console.log(s.frameCount)
    }
    // console.log(vehicles.length)

    let quadTreeBounds = new Rectangle(s)
    let quadTree = new QuadTree(s, quadTreeBounds)
    vehicles.forEach((v) => {
      quadTree.insert(v)
    })
    vehicles.forEach((v) => {
      v.neighbors = quadTree.queryRange(v, 200)
    })
    vehicles.forEach((v) => {
      // console.log(v)
      // v.wander()
      v.flock(150, 50, 5)
      v.steerToWithinBounds()
      v.applyAggregateSteerForce()
    })
    vehicles.forEach((v) => {
      let connectionsLog = []
      v.draw(connectionsLog)
      linkRecords = [...linkRecords, ...connectionsLog]
    })

    //update elements

    // univeralStore.automatedPrint(
    //   s.frameCount,
    //   linkRecords,
    //   sketchName.value,
    //   true,
    //   true,
    // )
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

watch(printToggleWatcher, () => {
  univeralStore.print(vehicles, sketchName.value, true, true)
})

onUnmounted(() => {
  playing.value = true
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
