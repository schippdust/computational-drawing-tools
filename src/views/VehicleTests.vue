<script setup>
import router from '@/router'
import VehicleTestCanvas from '@/components/vehicleTests/VehicleTestsCanvas.vue'
</script>
<template>
  <v-container>
    <v-row justify="start" class="pa-1 mt-n4">
      <v-divider vertical />
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
  <vehicleTestCanvas />
</template>
