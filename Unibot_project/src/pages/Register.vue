<template>
  <!--
    RegisterPage — Image 1
    Card-style layout centered on light grey background.
    Orange hero on left inside the card, form on right.
  -->
  <div class="min-h-screen bg-surface-100 flex items-center justify-center p-4">
    <div class="w-full max-w-[833px] bg-white rounded-3xl shadow-card overflow-hidden grid md:grid-cols-[45%_55%] page-enter">

      <!-- ── LEFT: orange hero ──────────────────────────────── -->
      <HeroPanel :show-quote="true">
        <template #headline>Create your account</template>
        <template #sub>Enter your details to get started with your academic concierge.</template>
        <template #features />
      </HeroPanel>

<!-- ── RIGHT: Registration form ───────────────────────── -->
       <div class="flex flex-col justify-center px-10 py-10">

<h2 class="font-display text-3xl text-gray-900 mb-0.9">Create your account</h2>
         <p class="text-sm text-gray-500 mb-6.8">Enter your details to get started with your academic concierge.</p>

        <!-- Error banner -->
        <div v-if="serverError"
          class="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ serverError }}
        </div>

        <form @submit.prevent="onSubmit" class="space-y-5" novalidate>
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <UInput
              v-model="fields.name"
              placeholder="Manuela Dupont"
              :error="errors.name"
              @blur="validateField('name')"
            >
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </template>
            </UInput>
          </div>

          <!-- University Email -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              University Email Address
            </label>
            <UInput
              v-model="fields.email"
              type="email"
              placeholder="name@gmail.com"
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

          <!-- Password row -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
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
                      <path v-if="showPass" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </template>
              </UInput>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <UInput
                v-model="fields.confirmPassword"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                :error="errors.confirmPassword"
                @blur="validateField('confirmPassword')"
              >
                <template #icon>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </template>
              </UInput>
            </div>
          </div>

          <!-- Submit -->
          <UButton type="submit" :loading="loading" class="mt-2">
            Create Account
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </UButton>
        </form>

        <!-- Social login -->
        <div class="mt-6">
          <SocialButtons @google="handleGoogle" @entUniv="handleEntUniv" />
        </div>

        <!-- Sign in link -->
        <p class="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <RouterLink to="/login" class="text-brand-500 font-semibold hover:text-brand-600 ml-1">
            Sign In
          </RouterLink>
        </p>

        <p class="mt-3 text-center text-xs text-gray-400">
          By signing up, you agree to our
          <a href="#" class="underline hover:text-brand-500">Terms of Service</a>
          and Privacy Policy.
        </p>
      </div>
    </div>
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

const router   = useRouter()
const authStore = useAuthStore()
const showPass  = ref(false)

// ── Form schema & validators ───────────────────────────────────
const { fields, errors, loading, serverError, validateField, handleSubmit } = useForm(
  { name: '', email: '', password: '', confirmPassword: '', role: 'student' },
  {
    name:  (v) => v?.trim().length >= 2 || 'Full name must be at least 2 characters.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    password: (v) =>
      (v?.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v)) ||
      'Password must be 8+ chars, include a number and uppercase letter.',
    confirmPassword: (v, f) => v === f.password || 'Passwords do not match.',
  }
)

// ── Submit handler ─────────────────────────────────────────────
async function onSubmit() {
  await handleSubmit(async (data) => {
    const res = await firebaseAuthService.register({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    authStore.setSession(res.user, res.token)
    redirectByRole(res.user?.role, router)
  })
}

async function handleGoogle() {
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