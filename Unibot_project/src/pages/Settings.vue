<template>
  <!-- SettingsPage — Image 5: Profile Settings -->
  <div class="flex-1 overflow-y-auto px-8 py-8">

    <!-- Page header -->
    <div class="mb-8">
      <h1 class="font-display text-3xl text-gray-900">Profile Settings</h1>
      <p class="text-sm text-gray-500 mt-1">Manage your personal information and security preferences.</p>
    </div>

    <!-- Top section: Avatar card + Account Status -->
    <div class="grid md:grid-cols-[1fr_240px] gap-4 mb-6">

      <!-- Avatar + name card -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex items-center gap-5">
        <!-- Avatar with edit button -->
        <div class="relative shrink-0">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center">
            <img v-if="authStore.avatar" :src="authStore.avatar" class="w-full h-full object-cover" />
            <span v-else class="text-2xl font-bold text-brand-600">{{ initials }}</span>
          </div>
          <button class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-500 text-white
                         flex items-center justify-center shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </button>
        </div>

        <div class="flex-1">
          <h2 class="font-display text-xl text-gray-900">{{ authStore.fullName }}</h2>
          <p class="text-sm text-gray-500 mb-2">Master's Student - Artificial Intelligence</p>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-medium bg-surface-100 text-gray-600 px-2.5 py-1 rounded-full">
              ID: {{ profile.studentId }}
            </span>
            <span class="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
              Premium Member
            </span>
          </div>
        </div>

        <button class="text-sm text-brand-500 font-semibold hover:text-brand-600 transition-colors self-start">
          Edit profile
        </button>
      </div>

      <!-- Account status card -->
      <div class="bg-brand-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"/>
        <p class="text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">Account Status</p>
        <p class="font-display text-2xl font-bold mb-4">Active</p>
        <p class="text-xs text-white/60 mb-0.5">Last sign in</p>
        <p class="text-sm font-semibold">Today, 09:42</p>
        <div class="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Personal Info + Security -->
    <div class="grid md:grid-cols-2 gap-4 mb-6">

      <!-- Personal Information -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-5">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <h3 class="font-semibold text-gray-900">Personal Information</h3>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1.5 font-medium">First Name</label>
              <input v-model="profile.firstName"
                class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm
                       text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1.5 font-medium">Last Name</label>
              <input v-model="profile.lastName"
                class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm
                       text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1.5 font-medium">Email Address</label>
            <input v-model="profile.email"
              type="email"
              class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm
                     text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1.5 font-medium">Phone Number</label>
            <input v-model="profile.phone"
              class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm
                     text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
            />
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-surface-100">
          <UButton variant="primary" :full="false" :loading="savingInfo" @click="saveInfo" class="px-6">
            Save Changes
          </UButton>
          <p v-if="saveSuccess" class="mt-2 text-xs text-green-600 font-medium">✓ Changes saved successfully</p>
          <p v-if="infoError" class="mt-2 text-xs text-red-500">{{ infoError }}</p>
        </div>
      </div>

      <!-- Security -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <h3 class="font-semibold text-gray-900">Security</h3>
        </div>
        <p class="text-xs text-gray-500 mb-5 leading-relaxed">
          Change your password regularly to maintain the security of your student account.
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1.5 font-medium">Current Password</label>
            <input v-model="security.current" type="password" placeholder="••••••••••••"
              class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm
                     outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1.5 font-medium">New Password</label>
            <input v-model="security.newPass" type="password" placeholder="Enter new password"
              class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm
                     outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
            />
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-surface-100">
          <UButton variant="outline" :full="false" :loading="savingPass" @click="changePassword" class="px-6">
            Change Password
          </UButton>
          <p v-if="passError" class="mt-2 text-xs text-red-500">{{ passError }}</p>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
      <div class="flex items-center gap-2 mb-5">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <h3 class="font-semibold text-gray-900">Notification Preferences</h3>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <NotifToggle
          v-for="pref in notifPrefs"
          :key="pref.key"
          :checked="pref.checked"
          :title="pref.title"
          :desc="pref.desc"
          @toggle="onNotifToggle(pref)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { firestoreService } from '@/services/firestoreService'
import { firebaseAuthService } from '@/services/firebaseAuthService'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import UButton          from '@/components/common/Ubutton.vue'
import NotifToggle      from '@/components/settings/NotifToggle.vue'

const authStore = useAuthStore()

const initials = computed(() =>
  authStore.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
)

// ── Local profile state ────────────────────────────────────────
const profile = ref({
  firstName: '',
  lastName:  '',
  email:     '',
  phone:     '',
  studentId: '',
})

const security = ref({ current: '', newPass: '' })

const savingInfo = ref(false)
const saveSuccess = ref(false)
const savingPass  = ref(false)
const passError   = ref('')
const infoError   = ref('')

const notifPrefs = ref([
  { key: 'chat',     title: 'Chat Alerts',      desc: 'Receive a notification when there\'s a new reply from the chatbot.', checked: true },
  { key: 'academic', title: 'Academic Updates', desc: 'Information about new courses and available resources.',              checked: true },
  { key: 'partner',  title: 'Partner Offers',   desc: 'Receive occasional marketing communications.',                        checked: false },
])

onMounted(async () => {
  if (!authStore.uid) return
  const data = await firestoreService.getUserProfile(authStore.uid)
  profile.value = {
    firstName: data.firstName || '',
    lastName:  data.lastName  || '',
    email:     data.email     || authStore.user?.email || '',
    phone:     data.phone     || '',
    studentId: data.studentId || '',
  }
  if (data.notifPrefs) {
    notifPrefs.value.forEach((pref) => {
      if (pref.key in data.notifPrefs) pref.checked = data.notifPrefs[pref.key]
    })
  }
})

async function saveInfo() {
  if (!authStore.uid) return
  savingInfo.value  = true
  saveSuccess.value = false
  infoError.value   = ''
  try {
    const fullName = `${profile.value.firstName} ${profile.value.lastName}`.trim()
    await firebaseAuthService.updateDisplayName(fullName)
    const updated = await firestoreService.updateUserProfile(authStore.uid, {
      name:      fullName,
      firstName: profile.value.firstName,
      lastName:  profile.value.lastName,
      email:     profile.value.email,
      phone:     profile.value.phone,
      studentId: profile.value.studentId,
    })
    authStore.updateUser({
      name:      updated.name,
      firstName: updated.firstName,
      lastName:  updated.lastName,
      email:     updated.email,
      phone:     updated.phone,
      studentId: updated.studentId,
    })
    saveSuccess.value = true
    setTimeout(() => saveSuccess.value = false, 3000)
  } catch (err) {
    infoError.value = getFirebaseErrorMessage(err) || err.message
  } finally {
    savingInfo.value = false
  }
}

async function changePassword() {
  passError.value = ''
  if (authStore.isGuest) {
    passError.value = 'Guest accounts cannot change password. Create a full account first.'
    return
  }
  if (!security.value.current || !security.value.newPass) {
    passError.value = 'Please fill in both password fields.'; return
  }
  if (security.value.newPass.length < 8) {
    passError.value = 'New password must be at least 8 characters.'; return
  }
  savingPass.value = true
  try {
    await firebaseAuthService.changePassword(security.value.current, security.value.newPass)
    security.value.current = ''
    security.value.newPass   = ''
  } catch (err) {
    passError.value = getFirebaseErrorMessage(err) || err.message
  } finally {
    savingPass.value = false
  }
}

async function onNotifToggle(pref) {
  pref.checked = !pref.checked
  if (!authStore.uid) return
  const prefs = Object.fromEntries(notifPrefs.value.map((p) => [p.key, p.checked]))
  await firestoreService.saveNotificationPrefs(authStore.uid, prefs)
}
</script>