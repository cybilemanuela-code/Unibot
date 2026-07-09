<template>
  <div class="flex flex-col h-full bg-surface-50">

    <header class="flex items-center justify-between px-6 py-4 bg-white border-b border-surface-200 shrink-0">
      <div class="flex items-center gap-3">
        <h1 class="font-display text-lg font-semibold text-gray-900">Academic Chat</h1>
        <span class="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full tracking-wide">ACTIVE SESSION</span>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-surface-50 border border-surface-200 px-3 py-1.5 rounded-full shadow-sm">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <select v-model="selectedLanguage" class="bg-transparent text-xs font-bold uppercase text-gray-600 outline-none cursor-pointer">
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </div>

        <button class="p-2 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-brand-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>

        <button class="p-2 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
        </button>
      </div>
    </header>

    <div ref="messagesEl" class="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
      <div class="flex items-center justify-center mb-6">
        <span class="text-xs text-gray-400 bg-surface-200 px-3 py-1 rounded-full uppercase">
          {{ selectedLanguage === 'fr' ? "Aujourd'hui" : 'Today' }}
        </span>
      </div>

      <ChatMessage v-for="msg in chatStore.messages" :key="msg.id" :message="msg" />
      <TypingIndicator v-if="chatStore.isTyping" />
      <div ref="bottomEl" />
    </div>

    <div class="px-6 py-3 flex items-center justify-center gap-3 flex-wrap shrink-0">
      <button
        v-for="chip in quickTopics"
        :key="chip.label"
        class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-200 hover:bg-brand-50 hover:text-brand-600 text-sm text-gray-600 font-medium transition-all duration-150"
        @click="sendQuick(chip.text)"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path :d="chip.icon"/>
        </svg>
        {{ chip.label }}
      </button>
    </div>

    <div class="px-6 py-4 bg-white border-t border-surface-200 shrink-0">
      <div class="flex items-end gap-3 bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
        <button class="text-gray-400 hover:text-brand-500 transition-colors shrink-0 mb-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
        </button>
        <textarea ref="textareaEl" v-model="inputText"
          :placeholder="selectedLanguage === 'fr' ? 'Posez une question à Unibot...' : 'Ask Unibot a question...'"
          rows="1" class="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none leading-relaxed max-h-32"
          @keydown.enter.exact.prevent="sendMessage" @input="autoResize" />
          <!-- Dans ta barre d'entrée -->
        <button 
          @mousedown="startRecording" 
          @mouseup="stopRecording"
          @touchstart.prevent="startRecording"
          @touchend.prevent="stopRecording"
          :class="isRecording ? 'bg-red-500 text-white scale-110' : 'text-gray-400 hover:text-orange-600'"
          class="p-3 rounded-full transition-all duration-200"
        >
          <Mic v-if="!isRecording" class="w-5 h-5" />
          <Square v-else class="w-5 h-5 animate-pulse" />
        </button>
        <button
          :class="['w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200', inputText.trim() && !chatStore.isTyping ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm' : 'bg-surface-200 text-gray-400 cursor-not-allowed']"
          :disabled="!inputText.trim() || chatStore.isTyping" @click="sendMessage">
          <svg v-if="chatStore.isTyping" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
        </button>
      </div>
      <p class="text-center text-xs text-gray-400 mt-2 font-medium">Unibot AI · Information based on IUC academic data</p>
    </div>
  </div>

  <div v-if="chatStore.showGuestLimitOverlay" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Question Limit Reached</h2>
      <p class="text-gray-600 mb-6">You've used all guest questions. Sign in to continue asking unlimited questions.</p>
      <div class="flex flex-col gap-3">
        <button @click="handleLoginClick" class="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg">Sign In</button>
        <button @click="handleSignupClick" class="w-full py-3 px-4 border-2 border-brand-200 text-brand-600 font-semibold rounded-lg">Create Account</button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Mic, Square } from 'lucide-vue-next'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { useGuestSession } from '@/composables/useGuestSession'
import { firestoreService } from '@/services/firestoreService'
import ChatMessage from '@/components/chatbot/ChatMessage.vue'
import TypingIndicator from '@/components/chatbot/TypingIndicator.vue'

const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()
const guestSession = useGuestSession()

const inputText = ref('')
const selectedLanguage = ref('fr')

const messagesEl = ref(null)
const bottomEl = ref(null)
const textareaEl = ref(null)

// =====================
// LOADING FIX (IMPORTANT)
// =====================
const isLoading = ref(false)

// =====================
// RECORDING STATE FIX
// =====================
const isRecording = ref(false)
let mediaRecorder = null
let audioChunks = []
let audioStream = null

// =====================
// QUICK TOPICS
// =====================
const quickTopics = [
  { lang: 'en', label: 'Admissions', text: 'Tell me about admission requirements.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { lang: 'en', label: 'Financial Aid', text: 'What is the status of my financial aid?', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { lang: 'en', label: 'Scholarships', text: 'Tell me about scholarships.', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
]

// =====================
// AUTO SCROLL
// =====================
watch(() => chatStore.messages.length, async () => {
  await nextTick()
  bottomEl.value?.scrollIntoView({ behavior: 'smooth' })
})

// =====================
// AUTO RESIZE
// =====================
function autoResize() {
  const el = textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

// =====================
// TIME
// =====================
function now() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// =====================
// SEND MESSAGE
// =====================
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || chatStore.isTyping) return

  if (authStore.isGuest && guestSession.isLimited()) {
    chatStore.setShowGuestLimitOverlay(true)
    return
  }

  if (authStore.isGuest) {
    guestSession.incrementQuestionCount()
  }

  inputText.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'

  if (!chatStore.currentChatId && authStore.isLoggedIn && !authStore.isGuest) {
    const title = text.length > 55 ? text.slice(0, 55) + '...' : text
    const chatId = await firestoreService.createChat(authStore.uid, title)
    chatStore.setCurrentChatId(chatId)
    await chatStore.loadChats(authStore.uid)
  } else if (chatStore.currentChatId && authStore.isLoggedIn && !authStore.isGuest) {
    const chat = chatStore.chatList.find(c => c.id === chatStore.currentChatId)
    if (chat && chat.title === 'New Chat') {
      const title = text.length > 55 ? text.slice(0, 55) + '...' : text
      firestoreService.updateChatTitle(chatStore.currentChatId, title).catch(console.error)
    }
  }

  const userMsg = {
    id: Date.now(),
    role: 'user',
    text,
    time: now()
  }

  chatStore.addMessage(userMsg)
  chatStore.setTyping(true)

  if (chatStore.currentChatId && authStore.isLoggedIn && !authStore.isGuest) {
    firestoreService.addMessageToChat(chatStore.currentChatId, userMsg).catch(console.error)
  }

  await nextTick()
  bottomEl.value?.scrollIntoView({ behavior: 'smooth' })

  try {
    const res = await axios.post('http://localhost:8000/chat', {
      user_id: authStore.uid || 'guest_user',
      question: text,
      language: selectedLanguage.value
    }, { timeout: 120000 })

    const botMsg = {
      id: Date.now() + 1,
      role: 'bot',
      text: res.data.answer,
      time: now(),
      source: res.data.source
    }

    chatStore.addMessage(botMsg)

    if (chatStore.currentChatId && authStore.isLoggedIn && !authStore.isGuest) {
      firestoreService.addMessageToChat(chatStore.currentChatId, {
        role: botMsg.role,
        text: botMsg.text,
        time: botMsg.time,
      }).catch(console.error)
    }

  } catch (err) {
    const errMsg = {
      id: Date.now(),
      role: 'bot',
      text: 'Error connecting to server.',
      time: now()
    }
    chatStore.addMessage(errMsg)
  } finally {
    chatStore.setTyping(false)
  }
}

// =====================
// 🎤 START RECORDING (FIXED)
// =====================
const startRecording = async () => {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorder = new MediaRecorder(audioStream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        await sendVoiceNote(audioBlob)
      } catch (err) {
        console.error("Voice send error:", err)
      } finally {
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop())
          audioStream = null
        }
        mediaRecorder = null
        audioChunks = []
      }
    }

    mediaRecorder.start()
    isRecording.value = true

  } catch (err) {
    console.error("Micro access denied:", err)
    isRecording.value = false
    mediaRecorder = null
    audioStream = null
  }
}

// =====================
// 🎤 STOP RECORDING (FIXED)
// =====================
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

// =====================
// 🎤 SEND VOICE NOTE (FIXED)
// =====================
const sendVoiceNote = async (blob) => {
  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append('file', blob, 'recording.webm')

    const res = await axios.post(
      'http://localhost:8000/transcribe',
      formData,
      { timeout: 60000 }
    )

    const text = res.data.text

    if (text) {
      inputText.value = text
      await sendMessage()
    }

  } catch (err) {
    console.error("Voice error:", err)
  } finally {
    isLoading.value = false
  }
}

// =====================
// QUICK SEND
// =====================
function sendQuick(text) {
  inputText.value = text
  sendMessage()
}

// =====================
// AUTH NAV
// =====================
function handleLoginClick() {
  chatStore.setShowGuestLimitOverlay(false)
  router.push('/login')
}

function handleSignupClick() {
  chatStore.setShowGuestLimitOverlay(false)
  router.push('/register')
}
</script> 