<script setup>
import router from '@/router'
import complexTracersCanvas from '@/components/complexTracers/complexTracersCanvas.vue'
import { storeToRefs } from 'pinia'

import { useUniveralStore } from '@/store/univeralStore'
const univeralStore = useUniveralStore()
const { playing, printToggleWatcher } = storeToRefs(univeralStore)

function saveImagePressed() {
  printToggleWatcher.value = !printToggleWatcher.value
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
          @click="playing = !playing"
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
  <complexTracersCanvas />
</template>
