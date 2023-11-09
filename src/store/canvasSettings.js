import { defineStore } from 'pinia'

export const useCanvasSettingsStore = defineStore('canvasSettings', {
  state: () => ({
    width: 17,
    height: 11,
    dpi: 100,
  }),
  getters: {
    pixelWidth: (state) => {
      return state.width * state.dpi
    },
    pixelHeight: (state) => {
      return state.height * state.dpi
    },
    canvasDims: (state) => {
      return {
        width: state.width * state.dpi,
        height: state.height * state.dpi,
      }
    },
  },
})
