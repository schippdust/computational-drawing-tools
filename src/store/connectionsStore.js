import { defineStore } from 'pinia'
export const useConnectionsStore = defineStore('connectionStore', {
  state: () => ({
    canvasWidth: 1200,
    canvasHeight: 2400,
    noiseTime: parseInt(Math.random() * 100000),
    playing: true,
    numberOfPoints: 5,
    pointSpacing: 10,
    vehicleDieOffRate: 0.02,
    connectionSearchDistance: 50,
    noiseScale: 0.001,
    noiseStrength: 10,
  }),
  actions: {
    setNewRandomTime() {
      this.noiseTime = parseInt(Math.random() * 100000)
    },
    togglePlaying() {
      this.playing = !this.playing
    },
    setNumberOfPoints(numberOfPoints) {
      this.numberOfPoints = parseInt(numberOfPoints)
    },
    setPointSpacing(pointSpacing) {
      this.pointSpacing = Number(pointSpacing)
    },
    setVehicleDieOffRate(vehicleDieOffRate) {
      this.vehicleDieOffRate = Number(vehicleDieOffRate)
    },
    setConnectionSearchDistance(connectionSearchDistance) {
      this.connectionSearchDistance = Number(connectionSearchDistance)
    },
    setNoiseScale(noiseScale) {
      this.noiseScale = Number(noiseScale)
    },
    setNoiseStrength(noiseStrength) {
      this.noiseStrength = Number(noiseStrength)
    },
  },
})
