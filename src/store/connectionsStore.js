import { defineStore } from 'pinia'
export const useConnectionsStore = defineStore('connectionStore', {
  state: () => ({
    canvasWidth: 1200,
    canvasHeight: 1200,
  }),
  actions: {},
})
