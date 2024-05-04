import { defineStore } from 'pinia'
import { createUUID } from './storeUtils'
export const useVehicleTestStore = defineStore('vehicleTestStore', {
  state: () => ({
    playing: true,
    saveToggle: false,
    drawRecord: 'id,geometry type\r\n',
    printIteration: localStorage.getItem('print iterations')
      ? JSON.parse(localStorage.getItem('print iterations'))
      : 0,
    maxIterations: 25,
  }),
  actions: {
    togglePlaying() {
      this.playing = !this.playing
    },
    resetDrawRecord() {
      this.drawRecord = 'id,geometry type\r\n'
    },
    addPointToDrawRecord(x, y) {
      let id = createUUID()
      let pointDefinition = `${id},point,${x},${y}\r\n`
      this.drawRecord = this.drawRecord + pointDefinition
    },
    addLineToDrawRecord(x1, y1, x2, y2) {
      let id = createUUID()
      let lineDefinition = `${id},line,${x1},${y1},${x2},${y2}\r\n`
      this.drawRecord = this.drawRecord + lineDefinition
    },
    addPolylineToDrawRecord(pVectorArray) {
      let id = createUUID()
      let i = 0
      for (let v of pVectorArray) {
        let definition = `${id},polyline control point,${i},${v.x},${v.y}\r\n`
        i += 1
        this.drawRecord = this.drawRecord + definition
      }
    },
  },
})
