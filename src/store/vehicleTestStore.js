import { defineStore } from 'pinia'
export const useVehicleTestStore = defineStore('vehicleTestStore', {
  state: () => ({
    playing: true,
  }),
  actions: {
    togglePlaying() {
      this.playing = !this.playing
    },
  },
})
