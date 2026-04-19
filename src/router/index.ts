import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/addition-subtraction',
      name: 'addition-subtraction',
      component: () => import('../views/AdditionSubtractionView.vue'),
    },
  ],
})

export default router
