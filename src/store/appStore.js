// Utilities
import { defineStore } from 'pinia'

export const defaultPageData = [
  {
    title: 'Home',
    path: '',
    component: 'Home',
    description:
      'The home page where users can select which of the prebuilt computational drawing tools they want to interact with.',
  },
  {
    title: 'Flow Field',
    path: 'flow-field',
    component: 'FlowField',
    description:
      'Drop specs of digital medium onto the canvas and watch them be carried by an invisible flow field',
  },
  {
    title: 'Connections',
    path: 'connections',
    component: 'Connections',
    description:
      'Draw trajectories that equally spaced points will be carried along, influenced by a flow field and random die-off events.  These points will search for neighbors as they move and draw connections where identified.',
  },
  {
    title: 'Tracers',
    path: 'tracer',
    component: 'Tracer',
    description:
      'A set of lines that chase a target around the screen, creating "tracers" that slowly converge on one another over time.',
  },
  {
    title: 'Blank',
    path: 'blank',
    component: 'Blank',
    description:
      'A blank canvas that can be used as a template for creating new computational drawings.',
  },
  {
    title: 'Complex Tracers',
    path: 'complex-tracers',
    component: 'ComplexTracers',
    description: '',
  },
  {
    title: 'Connections Experiments',
    path:'connections-two',
    component: 'ConnectionsExperiments',
    description:'trying to make something cool',
  }
]

export const useAppStore = defineStore('app', {
  state: () => ({
    pages: defaultPageData,
  }),
})
