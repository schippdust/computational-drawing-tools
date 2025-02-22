import { defineStore } from 'pinia'
import { hexToRgb } from './storeUtils'
export const useFlowFieldStore = defineStore('flowFieldStore', {
  state: () => ({
    lightColor: '#D5D5D5',
    darkColor: '#3D3D3D',

    perlinScaleStep: 0.007,
    perlinScaleBaseline: 0.0003,
    perlinScaleFactor: 0.001,
    time: Math.random() * 100000,

    brushSize: 45,
    minBrushSize: 5,
    maxBrushSize: 500,
    isDrawings: false,
    canvasWidth: 9000,
    canvasHeight: 4400,
  }),

  getters: {
    lightColorRgbObject() {
      return hexToRgb(this.lightColor)
    },
    darkColorRgbObject() {
      return hexToRgb(this.darkColor)
    },
  },

  actions: {
    setLightColor(hex) {
      // console.log('setting light color', hex)
      this.lightColor = hex
    },
    setDarkColor(hex) {
      // console.log('setting dark color', hex)
      this.darkColor = hex
    },
    setPerlinScaleFactor(n) {
      // console.log('setting dark color', n)
      this.perlinScaleFactor = n
    },
    setNewRandomTime() {
      let time = Math.random() * 100000
      // console.log('setting new random time',time)
      this.time = time
    },
    setBrushSize(brushSize) {
      // console.log('setting brush size',brushSize)
      this.brushSize = brushSize
    },
  },
})
