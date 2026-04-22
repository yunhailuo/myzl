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
    {
      path: '/hanzi',
      name: 'hanzi',
      component: () => import('../views/HanziView.vue'),
    },
  ],
})

export default router
