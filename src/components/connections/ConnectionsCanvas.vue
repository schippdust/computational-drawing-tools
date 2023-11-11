<script setup>
import P5 from 'p5'
import { useConnectionsStore } from '@/store/connectionsStore'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const connectionsStore = useConnectionsStore()
const { canvasWidth, canvasHeight } = storeToRefs(connectionsStore)

let sketchData = {
  playingt: false,
}
let drawCount = 1

onMounted(() => {
  const sketch = (s) => {
    s.setup = () => {
      s.createCanvas(canvasWidth.value, canvasHeight.value)
      s.background(255)
      // s.noLoop()
      s.frameRate(50)
      sketchData.playing = true
      console.log('setup run', s)
    }

    s.draw = () => {}
  }

  new P5(sketch, 'canvas')
})
</script>
<template></template>
