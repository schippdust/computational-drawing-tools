import { defineStore } from 'pinia'
export const useTracerStore = defineStore('tracerStore', {
  state: () => ({
    canvasWidth: 1500,
    canvasHeight: 1500,
  }),
})
