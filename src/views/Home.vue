<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/appStore'
const appStore = useAppStore()
const { pages } = storeToRefs(appStore)
const computationalDrawingPages = []

import { useUniveralStore } from '@/store/univeralStore'
const univeralStore = useUniveralStore()

onMounted(() => {
  univeralStore.resetPrintIteration()
})

const nonHomePages = computed(() => {
  return pages.value.filter((p) => p.title != 'Home')
})

localStorage.clear()
</script>

<template>
  <v-container>
    <v-row>
      <v-col
        ><p class="text-h4">Select a Computational Drawing Toolkit</p></v-col
      >
    </v-row>
    <v-row>
      <v-col v-for="page in nonHomePages" :key="page.title" :cols="4">
        <v-sheet color="blue" :height="350">
          <v-btn :to="page.path">{{ page.title }}</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
@/store/appStore
