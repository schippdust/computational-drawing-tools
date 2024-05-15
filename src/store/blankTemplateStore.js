import { defineStore } from 'pinia'
export const useBlankTemplateStore = defineStore('blankTemplateStore', {
  state: () => ({
    canvasWidth: 500,
    canvasHeight: 500,
  }),
})
