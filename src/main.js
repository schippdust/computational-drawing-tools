/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp, watch } from 'vue'
import { createPinia, storeToRefs } from 'pinia'
// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
// const pinia = createPinia()
// app.use(pinia)

registerPlugins(app)

app.mount('#app')

import { useVehicleTestStore } from './store/vehicleTestStore'
const vehicleTestStore = useVehicleTestStore()
const { printIteration } = storeToRefs(vehicleTestStore)
watch(printIteration, (state) => {
  console.log('updating local storage')
  localStorage.setItem('print iterations', printIteration.value)
})
