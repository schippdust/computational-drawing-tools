<script setup>
import ConnectionsCanvas from '@/components/connections/ConnectionsCanvas'
import router from '@/router'
import { useConnectionsStore } from '@/store/connectionsStore'
import { saveImageAndCsv } from '@/store/storeUtils'
import { storeToRefs } from 'pinia'

const connectionsStore = useConnectionsStore()
const {
  playing,
  numberOfPoints,
  pointSpacing,
  vehicleDieOffRate,
  connectionSearchDistance,
  noiseScale,
  noiseStrength,
  drawPoints,
  drawRecord
} = storeToRefs(connectionsStore)


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
          @click="saveImageAndCsv('connections',drawRecord)"
        >
          <v-icon class="ma-0">mdi-floppy</v-icon>
        </v-btn>
      </v-col>

      <v-col md="1" class="py-0 text-center">
        <v-btn
          class="pa-0"
          fab
          :color="playing ? 'green' : 'orange'"
          dark
          title="Toggle Playing"
          @click="connectionsStore.togglePlaying"
        >
          <v-icon v-if="playing" class="ma-0">mdi-play</v-icon>
          <v-icon v-else class="ma-0">mdi-pause</v-icon>
        </v-btn>
      </v-col>

      <!-- Point Controls -->
      <v-col md="3" class="py-0 px-1">
        <v-menu
          background-color="white"
          :close-on-content-click="false"
          :open-on-hover="true"
          @update:model-value="playing = false"
        >
          <template v-slot:activator="{ props }">
            <v-btn block color="grey-darken-1" dark v-bind="props">
              Point Controls
            </v-btn>
          </template>

          <v-card class="px-2 pb-5 pt-9">
            <v-slider
              label="Number of Points"
              :min="1"
              :max="10"
              :model-value="numberOfPoints"
              thumb-label="always"
              step="1"
              @end="connectionsStore.setNumberOfPoints($event)"
            ></v-slider>

            <v-slider
              label="Point Spacing"
              :min="5"
              :max="100"
              step="5"
              :model-value="pointSpacing"
              thumb-label="always"
              @end="connectionsStore.setPointSpacing($event)"
            ></v-slider>

            <v-slider
              label="Random Die Rate"
              :min="0"
              :max="0.05"
              :model-value="vehicleDieOffRate"
              step="0.001"
              thumb-label="always"
              @end="connectionsStore.setVehicleDieOffRate($event)"
            ></v-slider>

            <v-switch
            label="Draw Points"
            color="green"
            :model-value="drawPoints"
            @update:model-value="connectionsStore.toggleDrawPoints()"
            >

            </v-switch>
          </v-card>
        </v-menu>
      </v-col>

      <!-- Connection Controls -->
      <v-col md="3" class="py-0 px-1">
        <v-menu
          background-color="white"
          :close-on-content-click="false"
          :open-on-hover="true"
          @update:model-value="playing = false"
        >
          <template v-slot:activator="{ props }">
            <v-btn block color="grey-darken-1" dark v-bind="props">
              Connection Controls
            </v-btn>
          </template>

          <v-card class="px-2 pb-5 pt-9">
            <v-slider
              label="Connection Distance"
              :min="10"
              :max="100"
              :model-value="connectionSearchDistance"
              thumb-label="always"
              step="5"
              @end="connectionsStore.setConnectionSearchDistance($event)"
            ></v-slider>
          </v-card>
        </v-menu>
      </v-col>

      <!-- Noise Controls -->
      <v-col md="3" class="py-0 px-1">
        <v-menu
          background-color="white"
          :close-on-content-click="false"
          :open-on-hover="true"
          @update:model-value="playing = false"
        >
          <template v-slot:activator="{ props }">
            <v-btn class="" block color="grey-darken-1" dark v-bind="props">
              Noise Controls
            </v-btn>
          </template>

          <v-card class="px-2 pb-5 pt-9">
            <v-slider
              label="Noise Scale"
              :min="0.001"
              :max="0.1"
              step="0.001"
              :model-value="noiseScale"
              thumb-label="always"
              @end="connectionsStore.setNoiseScale($event)"
            ></v-slider>

            <v-slider
              label="Noise Strength"
              :min="0"
              :max="20"
              :model-value="noiseStrength"
              thumb-label="always"
              @end="connectionsStore.setNoiseStrength($event)"
            ></v-slider>

            <v-btn
              class="py-0 px-3"
              fab
              color="black"
              dark
              title="Randomize Noise"
              @click="connectionsStore.setNewRandomTime()"
            >
              <!-- <v-icon class="ma-0">mdi-dice-3-outline</v-icon> -->
              Random Noise Time
            </v-btn>
          </v-card>
        </v-menu>
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
