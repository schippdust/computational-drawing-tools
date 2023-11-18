import { defineStore } from 'pinia'
export const useConnectionsStore = defineStore('connectionStore', {
  state: () => ({
    canvasWidth: 1200,
    canvasHeight: 1200,
    noiseTime: parseInt(Math.random() * 100000),
  }),
  actions: {
    setNewRandomTime() {
      this.noiseTime = parseInt(Math.random() * 100000)
    },
  },
})
