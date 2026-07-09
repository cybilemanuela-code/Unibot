import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getAdminAppUrl, isAdminRole } from '@/utils/roleRouting'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',         redirect: '/login' },
    { path: '/register', component: () => import('@/pages/Register.vue'), meta: { guest: true } },
    { path: '/login',    component: () => import('@/pages/Login.vue'),    meta: { guest: true } },
    { path: '/chat',     component: () => import('@/layouts/appLayout.vue'), meta: { requiresAuth: true }, children: [
      { path: '', component: () => import('@/pages/Chatbot.vue') }
    ]},
    {
      path: '/app',
      component: () => import('@/layouts/appLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '',        redirect: '/app/chat' },
        { path: 'chat',    component: () => import('@/pages/Chatbot.vue') },
        { path: 'support', component: () => import('@/pages/Support.vue') },
        { path: 'settings',component: () => import('@/pages/Settings.vue') },
      ]
    }
  ]
})

// Navigation guards — wait for Firebase to restore session on refresh
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.waitForAuth()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'

  if (auth.isLoggedIn && !auth.isGuest && isAdminRole(auth.role)) {
    window.location.href = getAdminAppUrl()
    return false
  }

  if (to.meta.guest && auth.isLoggedIn && !auth.isGuest) return '/app/chat'
})

export default router