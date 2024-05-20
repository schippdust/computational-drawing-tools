import { defineStore } from 'pinia'
export const useComplexTracersStore = defineStore('complexTracersStore', {
  state: () => ({
    canvasWidth: 1500,
    canvasHeight: 2500,
    sketchName: 'complex tracers',
  }),
})
