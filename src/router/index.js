// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { defaultPageData } from '@/store/appStore'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/DefaultLayout.vue'),
    children: defaultPageData.map((d) => {
      return {
        path: d.path,
        name: d.title,
        component: () => import(`../views/${d.component}.vue`),
      }
    }),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
