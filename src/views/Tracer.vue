<script setup>
import router from '@/router'
import tracerCanvas from '@/components/tracer/TracerCanvas.vue'
import { useTracerStore } from '@/store/tracerStore.js'

import { storeToRefs } from 'pinia'

const tracerStore = useTracerStore()
const { playing, saveToggle, drawRecord } = storeToRefs(tracerStore)

function saveImagePressed() {
  // saveImageAndCsv('simple flow', drawRecord)
  saveToggle.value = !saveToggle.value
}
</script>

<template>
  <v-container>
    <v-row justify="start" class="pa-1 mt-n4">
      <v-col md="1" class="py-0 text-center">
        <v-btn class="pa-0" fab color="blue" dark title="Save Image" @click="">
          <v-icon class="ma-0" @click="saveImagePressed()">mdi-download</v-icon>
        </v-btn>
      </v-col>

      <v-divider vertical />

      <v-col md="1" class="py-0 text-center">
        <v-btn
          class="pa-0"
          fab
          :color="playing ? 'green' : 'orange'"
          dark
          title="Toggle Playing"
          @click="tracerStore.togglePlaying"
        >
          <v-icon v-if="playing" class="ma-0">mdi-play</v-icon>
          <v-icon v-else class="ma-0">mdi-pause</v-icon>
        </v-btn>
      </v-col>

      <v-spacer />

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
  <tracerCanvas />
</template>
