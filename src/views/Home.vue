<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const { pages } = storeToRefs(appStore)
</script>

<template>
  <v-container>
    <v-row>
      <v-col
        ><p class="text-h4">Select a Computational Drawing Toolkit</p></v-col
      >
    </v-row>
    <v-row>
      <v-col v-for="page in pages" :key="page.title" :cols="4">
        <v-sheet color="blue" :height="350">
          <v-btn :to="page.path">{{ page.title }}</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
