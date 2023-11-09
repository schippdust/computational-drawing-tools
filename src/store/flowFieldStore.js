import { defineStore } from 'pinia'

export const useFlowFieldStore = defineStore('flowFieldStore', {
  state: () => ({
    darkColor: [20, 20, 20, 1],
    lightColor: [200, 200, 200, 1],
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
    lightColorRgbObject(){
      let c = this.lightColor
      return {r:c[0],g:c[1],b:c[2],a:c[3]}
    },
    lightColorRgbObject(){
      let c = this.lightColor
      return {r:c[0],g:c[1],b:c[2],a:c[3]}
    }
  },

  actions: {
    setLightColor(rgba) {
      console.log('setting light color',rgba)
    },
    setDarkColor(rgba) {
      console.log('setting dark color',rgba)
    },
    setPerlinScaleFactor(n) {
      console.log('setting dark color',n)
    },
    setNewRandomTime(){
      this.time = Math.random() * 100000
    }
  },
})
