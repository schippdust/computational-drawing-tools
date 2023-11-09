<template>
  <v-container class="" elevation10>
    <v-row justify="start" class="pa-1 mt-0">
      <v-col md="1" class="py-0 text-center">
        <v-btn
          class="pa-0"
          fab
          color="black"
          dark
          title="Randomize Noise"
          @click=""
        >
          <v-icon class="ma-0">mdi-dice-3-outline</v-icon>
        </v-btn>
      </v-col>

      <v-divider vertical />

      <v-col md="2" class="py-0">
        <v-menu :close-on-content-click="false" :open-on-hover="true">
          <template v-slot:activator="{ props }">
            <v-btn block :color="'blue'" dark v-bind="props" v-on="on">
              Light Color
            </v-btn>
          </template>

          <v-color-picker
            elevation="10"
            hide-mode-switch
            mode="rgba"
            @input="setLightColor($event)"
          />
        </v-menu>
      </v-col>

      <v-col md="2" class="py-0">
        <v-menu :close-on-content-click="false" :open-on-hover="true">
          <template v-slot:activator="{ props }">
            <v-btn block :color="'blue-darken-4'" dark v-bind="props" v-on="on">
              Dark Color
            </v-btn>
          </template>

          <v-color-picker
            elevation="10"
            hide-mode-switch
            mode="rgba"
            @input="setDarkColor($event)"
          />
        </v-menu>
      </v-col>

      <v-divider vertical />

      <v-col md="3" class="mb-n5 py-1">
        <v-slider
          label="Brush Size"
          :min="10"
          :max="40"
          color="grey-darken-3"
          track-color="grey-lighten-1"
          @change="setBrushSize($event)"
        />
      </v-col>
    </v-row>
  </v-container>

  <FlowFieldCanvas />
</template>

<script setup>
let lightColorRgbObject = ''
import FlowFieldCanvas from '@/components/FlowFieldCanvas.vue'

function setLightColor(event) {
  console.log(event)
}

function setDarkColor(event) {
  console.log(event)
}

function setBrushSize(event) {
  console.log(event)
}

function setNewRandomTime(event) {
  console.log(event)
}

function decrementNoiseScale() {}

function incrementNoiseScale() {}

function rgbaToCss(rgbaArray) {
  return (
    'rgba(' +
    rgbaArray[0] +
    ', ' +
    rgbaArray[1] +
    ', ' +
    rgbaArray[2] +
    ', ' +
    rgbaArray[3] +
    ')'
  )
}

function rgbaToHex(rgbaArray) {
  let r = (+rgbaArray[0]).toString(16),
    g = (+rgbaArray[1]).toString(16),
    b = (+rgbaArray[2]).toString(16),
    a = Math.round(+rgbaArray[3] * 255).toString(16)

  if (r.length == 1) r = '0' + r
  if (g.length == 1) g = '0' + g
  if (b.length == 1) b = '0' + b
  if (a.length == 1) a = '0' + a
  console.log('#' + r + g + b + a)
  return '#' + r + g + b + a
}
console.log('initialized flow field component')
</script>
