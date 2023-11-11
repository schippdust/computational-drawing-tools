<script setup>
let lightColorRgbObject = ''
import FlowFieldCanvas from '@/components/flowField/FlowFieldCanvas.vue'
import { useFlowFieldStore } from '@/store/flowFieldStore'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { saveAs } from 'file-saver'
import { getNowAsString } from '@/store/storeUtils'

const flowFieldStore = useFlowFieldStore()
const {
  darkColor,
  lightColor,
  perlinScaleStep,
  perlinScaleBaseline,
  perlinScaleFactor,
  time,
  brushSize,
  minBrushSize,
  maxBrushSize,
} = storeToRefs(flowFieldStore)

function setLightColor(event) {
  console.log('set light color', event)
  flowFieldStore.setLightColor(event)
}

function setDarkColor(event) {
  console.log('set dark color', event)
  flowFieldStore.setDarkColor(event)
}

function setBrushSize(event) {
  console.log('set brush size', event)
  flowFieldStore.setBrushSize(event)
}

function setNewRandomTime() {
  console.log('set new random time')
  flowFieldStore.setNewRandomTime()
}

function saveImage() {
  console.log('saving image')
  let classQueryResults = document.getElementsByClassName('p5Canvas')
  if (classQueryResults.length > 1) {
    console.log(
      'multiple matching classes were found, saving only the first one',
    )
  } else if (classQueryResults.length <= 0) {
    console.log("no matching classes were found, something isn't right")
    return
  }
  let canvas = classQueryResults[0]
  console.log('canvas element identified', canvas)
  canvas.toBlob(function (blob) {
    saveAs(blob, getNowAsString() + ' - flow field.png')
  })
}
</script>

<template>
  <v-container class="mx-0 px-0 border" fluid>
    <v-row justify="start" class="pa-1 mt-n4">
      <v-col md="1" class="py-0 text-center">
        <v-btn
          class="pa-0"
          fab
          color="blue"
          dark
          title="Save Image"
          @click="saveImage"
        >
          <v-icon class="ma-0">mdi-floppy</v-icon>
        </v-btn>
      </v-col>

      <v-divider vertical />

      <v-col md="1" class="py-0 text-center">
        <v-btn
          class="pa-0"
          fab
          color="black"
          dark
          title="Randomize Noise"
          @click="setNewRandomTime()"
        >
          <v-icon class="ma-0">mdi-dice-3-outline</v-icon>
        </v-btn>
      </v-col>

      <v-divider vertical />

      <v-col md="2" class="py-0">
        <v-menu :close-on-content-click="false" :open-on-hover="true">
          <template v-slot:activator="{ props }">
            <v-btn block :color="lightColor" dark v-bind="props">
              Light Color
            </v-btn>
          </template>

          <v-color-picker
            elevation="10"
            hide-mode-switch
            mode="rgba"
            :model-value="lightColor"
            @update:model-value="setLightColor($event)"
          />
        </v-menu>
      </v-col>

      <v-col md="2" class="py-0">
        <v-menu :close-on-content-click="false" :open-on-hover="true">
          <template v-slot:activator="{ props }">
            <v-btn block :color="darkColor" dark v-bind="props">
              Dark Color
            </v-btn>
          </template>

          <v-color-picker
            elevation="10"
            hide-mode-switch
            mode="rgba"
            :model-value="darkColor"
            @update:model-value="setDarkColor($event)"
          />
        </v-menu>
      </v-col>

      <v-divider vertical />

      <v-col md="3" class="mb-n5 py-1">
        <v-slider
          label="Brush Size"
          :min="minBrushSize"
          :max="maxBrushSize"
          :model-value="brushSize"
          color="grey-darken-3"
          track-color="grey-lighten-1"
          @end="setBrushSize($event)"
        />
      </v-col>

      <v-spacer></v-spacer>

      <v-col md="1" class="py-0 text-center">
        <v-btn
          class="pa-0"
          fab
          color="red"
          dark
          title="Close Canvas"
          @click="router.push('/')"
        >
          X
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <FlowFieldCanvas />
</template>
