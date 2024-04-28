import { defineStore } from 'pinia'
export const useConnectionsStore = defineStore('connectionStore', {
  state: () => ({
    canvasWidth: 2400,
    canvasHeight: 1200,
    noiseTime: parseInt(Math.random() * 100000),
    playing: true,
    drawPoints: true,
    numberOfPoints: 5,
    pointSpacing: 50,
    vehicleDieOffRate: 0.02,
    connectionSearchDistance: 50,
    noiseScale: 0.001,
    noiseStrength: 10,
    drawPoints: true,
    drawRecord: 'geometry type,x1,y1,x2,y2\r\n',
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
    toggleDrawPoints() {
      this.drawPoints = !this.drawPoints
    },
    addPointToDrawRecord(x, y) {
      let pointDefinition = `point,${x},${y},,\r\n`
      this.drawRecord = this.drawRecord + pointDefinition
    },
    addLineToDrawRecord(x1, y1, x2, y2) {
      let lineDefinition = `line,${x1},${y1},${x2},${y2}\r\n`
      this.drawRecord = this.drawRecord + lineDefinition
    },
  },
})
