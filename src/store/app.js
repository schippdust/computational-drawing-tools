// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    pages: [
      {
        title: 'Flow Field',
        description:
          'Drop specs of digital medium onto the canvas and watch them be carried by an invisible flow field',
        path: 'flow-field',
      },
      {
        title: 'Connections',
        description:
          'Draw trajectories that equally spaced points will be carried along, influenced by a flow field and random die-off events.  These points will search for neighbors as they move and draw connections where identified.',
        path: 'connections',
      },
      {
        title: 'Vehicle Tests',
        description:
          'A development focused sketch for testing various vehicle behaviors',
        path: 'vehicle-tests',
      },
    ],
  }),
})
