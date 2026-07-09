import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { firebaseAuthService } from '@/services/firebaseAuthService'
import { firestoreService } from '@/services/firestoreService'

export const useAuthStore = defineStore('auth', () => {
  const user      = ref(null)
  const token     = ref(null)
  const authReady = ref(false)

  let resolveReady
  const authReadyPromise = new Promise((resolve) => { resolveReady = resolve })

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const fullName   = computed(() => user.value?.name || '')
  const role       = computed(() => user.value?.role || 'student')
  const avatar     = computed(() => user.value?.avatar || null)
  const uid        = computed(() => user.value?.uid || null)
  const isGuest    = computed(() => !!user.value?.isGuest)

  function setSession(userData, authToken) {
    user.value  = userData
    token.value = authToken
  }

  function clearSession() {
    user.value  = null
    token.value = null
  }

  function updateUser(updates) {
    user.value = { ...user.value, ...updates }
  }

  async function waitForAuth() {
    if (authReady.value) return
    await authReadyPromise
  }

  function initAuthListener() {
    onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          const profile = await firestoreService.getUserProfile(fbUser.uid)
          const authToken = await fbUser.getIdToken()
          setSession(firebaseAuthService.mapAuthUser(fbUser, profile), authToken)
        } else {
          clearSession()
        }
      } catch {
        clearSession()
      } finally {
        if (!authReady.value) {
          authReady.value = true
          resolveReady()
        }
      }
    })
  }

  return {
    user, token, authReady, isLoggedIn, fullName, role, avatar, uid, isGuest,
    setSession, clearSession, updateUser, waitForAuth, initAuthListener,
  }
})
