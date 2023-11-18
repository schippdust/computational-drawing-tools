<script setup>
import ConnectionsCanvas from '@/components/connections/ConnectionsCanvas'
import router from '@/router'

import { saveP5CanvasAsImage } from '@/store/storeUtils'
</script>
<template>
  <v-container class="mx-0 px-0" elevation10>
    <v-row justify="start" class="pa-1 mt-n4">
      <v-col md="1" class="py-0 text-center">
        <v-btn
          class="pa-0"
          fab
          color="blue"
          dark
          title="Save Image"
          @click="saveP5CanvasAsImage('connections')"
        >
          <v-icon class="ma-0">mdi-floppy</v-icon>
        </v-btn>
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
  <ConnectionsCanvas></ConnectionsCanvas>
</template>
