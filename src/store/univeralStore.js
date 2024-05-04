import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()
import { saveP5CanvasAsImage, saveCsvData } from './storeUtils'

export const useUniveralStore = defineStore('univeralStore', {
  state: () => ({
    saveToggle: false, //toggled to trigger watchers.  Not the most elegant but it works
    drawRecord: 'id,geometry type\r\n',
    printIteration: localStorage.getItem('print iterations')
      ? JSON.parse(localStorage.getItem('print iterations'))
      : 0,
    maxIterations: 25,
    automatedPrintingEnabled: false,
    frameStepForPrinting: 250,
    minFrameForPrinting: 850,
    maxFrameToStopPrinting: 2600,
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
    saveDrawingRecord(fileName, savePng = true, saveCsv = true) {
      if (savePng) {
        saveP5CanvasAsImage(fileName)
      }
      if (saveCsv) {
        saveCsvData(fileName, this.drawRecord)
      }
    },
    automatedPrint(
      frame,
      vehicles,
      fileName = 'sketch',
      savePng = true,
      saveCsv = true,
    ) {
      if (this.automatedPrint) {
        if (
          frame % this.frameStepForPrinting == 0 &&
          frame >= this.minFrameForPrinting &&
          frame < this.maxFrameToStopPrinting
        ) {
          this.resetDrawRecord()
          for (let vehicle of vehicles) {
            this.addVehicleToCsvRecord(vehilce)
          }
          this.saveDrawingRecord(fileName, savePng, saveCsv)
        }
        if (frame >= this.maxFrameToStopPrinting) {
          this.printIteration += 1
          if (this.printIteration < maxIterations) {
            router.go()
          } else {
            console.log('navigating')
            router.push({ name: 'Home' })
          }
        }
      }
    },
  },
})
