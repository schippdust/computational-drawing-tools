<script setup>
import P5 from 'p5'
import { useFlowFieldStore } from '@/store/flowFieldStore'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import {
  PerlinPathCollection,
  PerlinPath,
  ColorGrid,
} from './PerlinDrawingClasses.js'

const flowFieldStore = useFlowFieldStore()
const {
  //state
  darkColor,
  lightColor,
  perlinScaleStep,
  perlinScaleBaseline,
  perlinScaleFactor,
  time,
  brushSize,
  isDrawing,
  canvasWidth,
  canvasHeight,

  //getters
  lightColorRgbObject,
  darkColorRgbObject,
} = storeToRefs(flowFieldStore)

let sketchData = {
  colorGrid: undefined,
  perlinPaths: undefined,
  playing: false,
}
let aproxCellSize = 140
let drawCount = 1

onMounted(() => {
  const sketch = (s) => {
    s.setup = () => {
      s.createCanvas(canvasWidth.value, canvasHeight.value)
      s.background(255)
      s.noLoop()
      s.frameRate(50)
      sketchData.playing = false
      console.log('setup run', s)
      sketchData.colorGrid = new ColorGrid(s, aproxCellSize)
      sketchData.perlinPaths = new PerlinPathCollection(s, sketchData.colorGrid)
    }

    s.draw = () => {
      sketchData.colorGrid.addUpdateColors(
        lightColorRgbObject.value,
        darkColorRgbObject.value,
      )
      sketchData.perlinPaths.update(time.value)
      if (sketchData.perlinPaths.paths.length <= 2000) {
        for (let i = 0; i < drawCount; i++) {
          sketchData.perlinPaths.addPath(
            s.random(s.mouseX - brushSize.value, s.mouseX + brushSize.value),
            s.random(s.mouseY - brushSize.value, s.mouseY + brushSize.value),
            perlinScaleFactor.value,
          )
        }
      }
    }

    s.keyPressed = () => {
      if (s.keyCode === s.ENTER && sketchData.playing) {
        s.noLoop()
        sketchData.playing = false
      } else if (s.keyCode === s.ENTER && !sketchData.playing) {
        s.loop()
        sketchData.playing = true
      }
    }
  }

  new P5(sketch, 'canvas')
})

onBeforeUnmount(() => {
  let elements = document.getElementsByClassName('p5Canvas')
  console.log('p5 canvas elements', elements)
  // elements.foreach((el) => el.remove())
})
</script>

<template>
  <v-container class="pa-0 ma-0" fluid style="overflow-x: auto !important">
    <v-row class="pa-0 ma-0">
      <v-col class="pa-0 ma-0">
        <div id="canvas" class=""></div>
      </v-col>
    </v-row>
  </v-container>
</template>
