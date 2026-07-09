<template>
  <!--
    LoginPage — Image 2
    Card-style layout centered on light grey background.
    Orange hero on left inside the card, form on right.
  -->
  <div class="min-h-screen bg-surface-100 flex items-center justify-center p-4">
<div class="w-full max-w-[833px] bg-white rounded-3xl shadow-card overflow-hidden grid md:grid-cols-[45%_55%] min-h-[650px] page-enter">

       <!-- ── LEFT: orange hero ──────────────────────────────── -->
       <HeroPanel :show-quote="true">
         <template #headline>Welcome</template>
         <template #sub>Access your university resources in an instant.</template>
         <template #features />
       </HeroPanel>

        <!-- ── RIGHT: Login form ──────────────────────────────── -->
        <div class="flex flex-col justify-center px-10 py-10">

          <h2 class="font-display text-3xl text-gray-900 mb-0.9">Welcome</h2>
          <p class="text-sm text-gray-500 mb-6.8">Access your university resources in an instant.</p>

          <!-- Error banner -->
          <div v-if="serverError"
            class="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ serverError }}
          </div>

          <form @submit.prevent="onSubmit" class="space-y-5" novalidate>

            <!-- Email -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <UInput
                v-model="fields.email"
                type="email"
                placeholder="name@gamail.com"
                :error="errors.email"
                @blur="validateField('email')"
              >
                <template #icon>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </template>
              </UInput>
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Password
                </label>
                <a href="#" class="text-xs text-brand-500 font-semibold hover:text-brand-600">Forgot?</a>
              </div>
              <UInput
                v-model="fields.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                :error="errors.password"
                @blur="validateField('password')"
              >
                <template #icon>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </template>
                <template #right>
                  <button type="button" @click="showPass = !showPass" tabindex="-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </template>
              </UInput>
            </div>

            <!-- Remember me -->
            <label class="flex items-center gap-1.5 cursor-pointer group">
              <div class="relative">
                <input v-model="fields.remember" type="checkbox" class="sr-only" />
                <div :class="['w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center',
                  fields.remember ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-white group-hover:border-gray-400']">
                  <svg v-if="fields.remember" class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <span class="text-xs text-gray-600">Remember me</span>
            </label>

            <!-- Sign In button -->
            <UButton type="submit" :loading="loading" size="lg" class="mt-2">Sign In</UButton>

            <!-- Guest -->
            <UButton type="button" variant="ghost" size="md" @click="continueAsGuest">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Continue as Guest
            </UButton>
          </form>

          <!-- Social -->
          <div class="mt-5.8">
            <SocialButtons label="OR SIGN IN WITH" @google="handleGoogle" @entUniv="handleEntUniv" />
          </div>

          <!-- Sign up link -->
          <p class="mt-6 text-center text-sm text-gray-500">
            Don't have an account?
            <RouterLink to="/register" class="text-brand-500 font-semibold hover:text-brand-600 ml-1">
              Sign Up
            </RouterLink>
          </p>

          <p class="mt-3 text-center text-xs text-gray-400">
            By signing in, you agree to our
            <a href="#" class="underline hover:text-brand-500">Terms of Service</a>
            and Privacy Policy.
          </p>
        </div>
    </div>

    <!-- Floating help button (bottom-right) -->
    <button class="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-surface-200 hover:bg-surface-300
                   flex items-center justify-center text-gray-500 shadow-card transition-all">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { firebaseAuthService } from '@/services/firebaseAuthService'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { redirectByRole } from '@/utils/roleRouting'
import { useForm }       from '@/composables/useForm'
import HeroPanel         from '@/components/auth/HeroPanel.vue'
import SocialButtons     from '@/components/auth/SocialButtons.vue'
import UInput            from '@/components/common/UInput.vue'
import UButton           from '@/components/common/Ubutton.vue'

const router    = useRouter()
const authStore = useAuthStore()
const showPass  = ref(false)

const { fields, errors, loading, serverError, validateField, handleSubmit } = useForm(
  { email: '', password: '', remember: false },
  {
    email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email.',
    password: (v) => v?.length >= 6 || 'Password must be at least 6 characters.',
  }
)

async function onSubmit() {
  if (!navigator.onLine) {
    serverError.value = 'You are offline. Connect to the internet to log in.'
    return
  }

  await handleSubmit(async (data) => {
    const res = await firebaseAuthService.login({
      email: data.email,
      password: data.password,
    })
    authStore.setSession(res.user, res.token)
    redirectByRole(res.user?.role, router)
  })
}

async function continueAsGuest() {
  if (!navigator.onLine) {
    serverError.value = 'You are offline. Connect to the internet to log in.'
    return
  }

  serverError.value = ''
  loading.value = true
  try {
    const res = await firebaseAuthService.loginAsGuest()
    authStore.setSession(res.user, res.token)
    redirectByRole(res.user?.role, router)
  } catch (err) {
    serverError.value = getFirebaseErrorMessage(err) || err.message
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  if (!navigator.onLine) {
    serverError.value = 'You are offline. Connect to the internet to log in.'
    return
  }

  serverError.value = ''
  loading.value = true
  try {
    const res = await firebaseAuthService.loginWithGoogle()
    authStore.setSession(res.user, res.token)
    redirectByRole(res.user?.role, router)
  } catch (err) {
    serverError.value = getFirebaseErrorMessage(err) || err.message
  } finally {
    loading.value = false
  }
}

function handleEntUniv() { console.log('TODO: ENT Univ SSO') }
</script>