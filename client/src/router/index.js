import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Admin from '../pages/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
  {
    path: '/success',
    name: 'OrderSuccess',
    component: () => import('../pages/OrderSuccess.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard to protect Admin route
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('adminToken')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
