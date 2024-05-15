<script setup>
import P5 from 'p5'
import { onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useUniveralStore } from '@/store/univeralStore'
const univeralStore = useUniveralStore()
const { playing, printToggleWatcher } = storeToRefs(univeralStore)
playing.value = true

//IMPORT CLASSES ASSOCIATED WITH DRAWING
import {} from './blankTemplateClasses'

//IMPORT STORE ASSOCIATED WITH DRAWING
import { useBlankTemplateStore } from '@/store/blankTemplateStore'
const blankTemplateStore = useBlankTemplateStore()
const { canvasWidth, canvasHeight, sketchName } =
  storeToRefs(blankTemplateStore)

let vehicles = []
var activeSketch = undefined

var sketch = (s) => {
  s.setup = () => {
    s.createCanvas(canvasWidth.value, canvasHeight.value)
    s.background(0)
    s.frameRate(30)
    console.log('setup initialized')
  }

  s.draw = () => {
    if (s.frameCount % 50 == 0) {
      console.log(s.frameCount)
    }

    //update elements

    univeralStore.automatedPrint(
      s.frameCount,
      vehicles,
      sketchName.value,
      true,
      false,
    )
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
  univeralStore.print(vehicles, sketchName.value, true, false)
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
