import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()
import { saveP5CanvasAsImage, saveCsvData } from './storeUtils'

if (localStorage.getItem('print iterations') == 'null') {
  localStorage.setItem('print iterations', 0)
}

export const useUniveralStore = defineStore('univeralStore', {
  state: () => ({
    playing: true,
    saveToggle: false, //toggled to trigger watchers.  Not the most elegant but it works
    csvRecord: 'id,geometry type\r\n',
    printIteration: localStorage.getItem('print iterations')
      ? JSON.parse(localStorage.getItem('print iterations'))
      : 0,
    maxIterations: 25,
    automatedPrintingEnabled: true,
    frameStepForPrinting: 250,
    minFrameForPrinting: 100,
    maxFrameToStopPrinting: 2600,
    printToggleWatcher: false,
  }),
  actions: {
    resetPrintIteration() {
      this.printIteration = 0
      localStorage.setItem('print iterations', 0)
    },
    resetCsvRecord() {
      this.csvRecord = 'id,geometry type\r\n'
    },
    addVehiclesToCsvRecord(vehicles) {
      for (let vehicle of vehicles) {
        this.csvRecord += vehicle.csvRecord
      }
    },
    saveDrawingRecord(fileName, savePng = true, saveCsv = true) {
      if (savePng) {
        saveP5CanvasAsImage(fileName)
      }
      if (saveCsv) {
        saveCsvData(fileName, this.csvRecord)
      }
    },
    automatedPrint(
      frame,
      vehicles,
      fileName = 'sketch',
      savePng = true,
      saveCsv = true,
    ) {
      if (this.automatedPrintingEnabled) {
        if (
          frame % this.frameStepForPrinting == 0 &&
          frame >= this.minFrameForPrinting &&
          frame < this.maxFrameToStopPrinting
        ) {
          this.print(vehicles, fileName, savePng, saveCsv)
        }
        if (frame >= this.maxFrameToStopPrinting) {
          this.printIteration += 1
          localStorage.setItem('print iterations', this.printIteration)
          if (this.printIteration < this.maxIterations) {
            router.go()
          } else {
            console.log('navigating')
            router.push({ name: 'Home' })
          }
        }
      }
    },
    print(vehicles, fileName = 'sketch', savePng = true, saveCsv = true) {
      if (saveCsv) {
        this.resetCsvRecord()
        this.addVehiclesToCsvRecord(vehicles)
      }
      this.saveDrawingRecord(fileName, savePng, saveCsv)
    },
  },
})
