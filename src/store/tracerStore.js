import { defineStore } from 'pinia'
export const useTracerStore = defineStore('tracerStore', {
  state: () => ({
    playing: true,
  }),
  actions: {
    togglePlaying() {
      this.playing = !this.playing
    },
  },
})
