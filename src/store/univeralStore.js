import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { saveImageAndCsv } from './storeUtils'

export const universalStore = defineStore('univeralStore', {
  state: () => ({
    saveToggle: false, //toggled to trigger watchers.  Not the most elegant but it works
    drawRecord: 'id,geometry type\r\n',
    printIteration: localStorage.getItem('print iterations')
      ? JSON.parse(localStorage.getItem('print iterations'))
      : 0,
    maxIterations: 25,
  }),
  actions: {
    resetPrintIteration() {
      this.printIteration = 0
    },
    resetDrawRecord() {
      this.drawRecord = 'id,geometry type\r\n'
    },
    addVehicleToCsvRecord(vehicles) {
      for (vehicle of vehicles) {
        this.drawRecord += vehicle.csvRecord
      }
    },
    saveRecords(fileName) {
      saveImageAndCsv(fileName, this.drawRecord)
    },
  },
})
