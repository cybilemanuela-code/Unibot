<template>
  <div class="flex h-screen bg-surface-50 overflow-hidden">

    <aside :class="['flex flex-col w-56 bg-white border-r border-surface-200 shrink-0 z-20 transition-transform duration-300',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'fixed md:static inset-y-0 left-0']">

      <div class="px-5 py-5 border-b border-surface-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
          </div>
          <div>
            <p class="font-display font-semibold text-gray-900 leading-none">Unibot</p>
            <p class="text-xs text-gray-400 mt-0.5">Academic Assistant</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 flex flex-col overflow-hidden">
        <div class="nav-item" :class="{ active: !chatStore.currentChatId }" @click="startNewChat">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Chat
        </div>

        <div v-if="authStore.isLoggedIn && !authStore.isGuest && chatStore.chatList.length" class="mt-4 flex-1 flex flex-col overflow-hidden">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">Chat History</p>
          <div class="flex-1 overflow-y-auto space-y-0.5 -mr-2 pr-2">
            <div
              v-for="chat in visibleChats"
              :key="chat.id"
              :class="['nav-item text-sm truncate', chat.id === chatStore.currentChatId && 'active']"
              @click="openChat(chat)"
            >
              <svg class="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              {{ chat.title }}
            </div>
          </div>

          <button v-if="chatStore.chatList.length > 10" class="text-xs text-brand-600 font-semibold hover:text-brand-700 px-3 py-2 text-left" @click="chatStore.setShowViewMore(true)">
            View more...
          </button>
        </div>

        <div v-if="authStore.isLoggedIn && !authStore.isGuest && chatStore.chatList.length === 0" class="mt-4 px-3">
          <p class="text-xs text-gray-400">No chat history yet.</p>
        </div>
      </nav>

      <div class="px-3 py-4 border-t border-surface-100 space-y-1">
        <div class="flex gap-2">
          <RouterLink to="/app/settings"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-surface-100 hover:text-gray-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Settings
          </RouterLink>
          <RouterLink to="/app/support"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-surface-100 hover:text-gray-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Support
          </RouterLink>
        </div>
        <div class="nav-item text-red-400 hover:text-red-600 hover:bg-red-50" @click="logout">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </div>

        <RouterLink to="/app/settings" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-100 transition-colors mt-2 cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="authStore.avatar" :src="authStore.avatar" class="w-full h-full object-cover" />
            <span v-else class="text-sm font-bold text-brand-600">{{ initials }}</span>
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-gray-800 truncate">{{ authStore.fullName }}</p>
            <p class="text-xs text-gray-400 capitalize">{{ authStore.role }}</p>
          </div>
        </RouterLink>
      </div>
    </aside>

    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/30 z-10 md:hidden" @click="sidebarOpen = false"/>

    <main class="flex-1 overflow-hidden flex flex-col">
      <div class="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-surface-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center gap-2 text-brand-600 font-display font-semibold">Unibot</div>
        <div class="w-9" />
      </div>

      <RouterView class="flex-1 overflow-hidden" />
    </main>

    <div v-if="chatStore.showViewMore" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="chatStore.setShowViewMore(false)">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[70vh] flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h3 class="font-semibold text-gray-900">All Chats</h3>
          <button class="p-1 rounded-lg hover:bg-surface-100 text-gray-400" @click="chatStore.setShowViewMore(false)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          <div
            v-for="chat in chatStore.chatList"
            :key="chat.id"
            :class="['flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors', chat.id === chatStore.currentChatId ? 'bg-brand-50 text-brand-700' : 'hover:bg-surface-100 text-gray-700']"
            @click="openChat(chat); chatStore.setShowViewMore(false)"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
            <span class="text-sm truncate">{{ chat.title }}</span>
          </div>
          <p v-if="chatStore.chatList.length === 0" class="text-sm text-gray-400 text-center py-8">No chats yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import { firebaseAuthService } from '@/services/firebaseAuthService'
import { firestoreService } from '@/services/firestoreService'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const chatStore = useChatStore()
const sidebarOpen = ref(false)

const initials = computed(() => {
  const name = authStore.fullName
  return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'
})

const visibleChats = computed(() => chatStore.chatList.slice(0, 10))

onMounted(async () => {
  await authStore.waitForAuth()
  if (authStore.isLoggedIn && !authStore.isGuest) {
    await chatStore.loadChats(authStore.uid)
  }
})

watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn && !authStore.isGuest) {
    await chatStore.loadChats(authStore.uid)
  }
})

watch(() => route.path, async () => {
  await authStore.waitForAuth()
  if (authStore.isLoggedIn && !authStore.isGuest) {
    await chatStore.loadChats(authStore.uid)
  }
})

async function startNewChat() {
  sidebarOpen.value = false
  const id = await firestoreService.createChat(authStore.uid)
  chatStore.setCurrentChatId(id)
  chatStore.resetToWelcome(authStore.fullName?.split(' ')[0], 'fr')
  await chatStore.loadChats(authStore.uid)
  router.push('/app/chat')
}

async function openChat(chat) {
  sidebarOpen.value = false
  chatStore.setCurrentChatId(chat.id)
  await chatStore.loadMessages(chat.id)
  router.push('/app/chat')
}

async function logout() {
  try {
    await firebaseAuthService.logout()
  } finally {
    authStore.clearSession()
    router.push('/login')
  }
}
</script>
