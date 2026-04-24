import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页' },
    },
    {
      path: '/addition-subtraction',
      name: 'addition-subtraction',
      component: () => import('../views/AdditionSubtractionView.vue'),
      meta: { title: '加减法' },
    },
    {
      path: '/hanzi',
      name: 'hanzi',
      component: () => import('../views/HanziView.vue'),
      meta: { title: '汉字' },
    },
  ],
})

export default router
