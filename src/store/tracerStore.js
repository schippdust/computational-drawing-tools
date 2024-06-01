import { defineStore } from 'pinia'
export const useTracerStore = defineStore('tracerStore', {
  state: () => ({
    canvasWidth: 3200,
    canvasHeight: 3200,
    constrainOrthogonally: false,
  }),
})
