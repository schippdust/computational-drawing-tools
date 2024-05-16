import { defineStore } from 'pinia'
export const useComplexTracersStore = defineStore('complexTracersStore', {
  state: () => ({
    canvasWidth: 500,
    canvasHeight: 500,
    sketchName: 'complex tracers',
  }),
})
