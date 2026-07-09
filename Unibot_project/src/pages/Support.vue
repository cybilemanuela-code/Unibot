<template>
  <!-- SupportPage — Image 4: Help Center -->
  <div class="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full md:pl-6">

    <!-- Header badge -->
    <div class="inline-flex items-center px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold tracking-widest mb-4">
      ASSISTANCE AREA
    </div>

    <h1 class="font-display text-4xl text-gray-900 leading-tight mb-2">
      How can we<br /><span class="text-brand-500">help you?</span>
    </h1>
    <p class="text-gray-500 text-sm mb-10 max-w-lg">
      Find quick answers to your academic questions or chat directly with one of our pedagogical advisors.
    </p>

    <!-- Top row: Live Chat + Open a Ticket -->
    <div class="grid md:grid-cols-[1fr_300px] gap-4 mb-6">

      <!-- Live chat card -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
        </div>
        <h3 class="font-display text-xl text-gray-900 mb-1">Live Chat</h3>
        <p class="text-sm text-gray-500 mb-5 leading-relaxed">
          Chat in real-time with a member of our team for immediate resolution.
        </p>
        <div class="flex items-center gap-4">
          <button @click="startNewChat" class="btn-primary w-auto px-6 py-2.5 text-sm rounded-xl">
            Start a chat
          </button>
          <span class="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online (Wait &lt; 2 min)
          </span>
        </div>
      </div>

      <!-- Open a ticket card -->
      <div class="bg-amber-400 rounded-2xl p-6 shadow-sm">
        <h3 class="font-display text-xl text-gray-900 mb-1">Open a Ticket</h3>
        <p class="text-xs text-amber-900/70 mb-4 leading-relaxed">
          For complex or administrative requests requiring follow-up.
        </p>
        <input
          v-model="ticketSubject"
          type="text"
          placeholder="Subject of your request"
          class="w-full px-4 py-2.5 rounded-xl text-sm bg-white/90 border border-amber-300/50
                 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-600/20 mb-3"
        />
        <button
          class="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold transition-colors"
          @click="createTicket"
        >
          Create a ticket
        </button>
      </div>
    </div>

    <!-- FAQ section -->
    <div class="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm mb-6">
      <div class="grid md:grid-cols-[200px_1fr] gap-8">
        <div>
          <h3 class="font-display text-2xl text-gray-900 mb-2">FAQ</h3>
          <p class="text-sm text-gray-500 leading-relaxed mb-4">
            Answers to the most frequently asked questions by our students.
          </p>
          <!-- Placeholder image -->
          <div class="rounded-xl overflow-hidden h-40 bg-surface-100 flex items-center justify-center">
            <svg class="w-12 h-12 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <div class="space-y-3">
          <FaqItem
            v-for="faq in faqs"
            :key="faq.id"
            :question="faq.question"
            :answer="faq.answer"
            :open="openFaq === faq.id"
            @toggle="toggleFaq(faq.id)"
          />

          <button class="text-sm text-brand-500 font-semibold hover:text-brand-600 flex items-center gap-1 mt-2 transition-colors">
            See all questions (24)
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom row: Useful Resources + Emergency -->
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Resources -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
        <h3 class="font-semibold text-gray-900 mb-4">Useful Resources</h3>
        <div class="space-y-3">
          <ResourceItem
            icon="pdf"
            title="Student Guide"
            description="PDF Guide for IUC students"
            url="https://students.myiuc.com"
            @click="openResource"
          />
          <ResourceItem
            icon="video"
            title="Platform Tutorials"
            description="Video tutorials and guides"
            url="https://app.myiuc.com"
            @click="openResource"
          />
          <ResourceItem
            icon="cal"
            title="Academic Calendar"
            description="2025-2026 Academic Calendar"
            url="https://myiuc.com/static/docs/Calendrier 2025-2026.pdf"
            @click="openResource"
          />
        </div>
      </div>

      <!-- Emergency -->
      <div class="bg-red-50 rounded-2xl border border-red-100 p-6 flex gap-4 items-start">
        <div class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-1">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-red-700 mb-1">Need urgent help?</p>
          <p class="text-sm text-red-600 leading-relaxed">
            For critical situations requiring immediate intervention outside of chat hours,
            contact our 24/7 emergency line at <strong>+33 1 23 45 67 89</strong>.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating chat button -->
  <button class="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-600
                 flex items-center justify-center text-white shadow-lg transition-all">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
    </svg>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chatStore'
import { firestoreService } from '@/services/firestoreService'
import { useAuthStore } from '@/stores/authStore'
import FaqItem      from '@/components/Support/FaqItem.vue'
import ResourceItem from '@/components/Support/ResourceItem.vue'

const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()

const ticketSubject = ref('')
const openFaq       = ref(null)

const faqs = [
  { id: 1, question: 'How do I reset my student access?',             answer: 'Contact the IT helpdesk at support@university.edu or visit the student portal to reset your credentials.' },
  { id: 2, question: 'Can I change my course during the semester?',   answer: 'Yes, course changes are allowed during the first two weeks. Visit the registrar\'s office with your advisor\'s approval.' },
  { id: 3, question: 'Where can I find my achievement certificates?', answer: 'Achievement certificates are available in your student portal under Documents > Certificates.' },
  { id: 4, question: 'How to contact a specific tutor?',             answer: 'Find your tutor\'s contact through the faculty directory on the university website.' },
]

function toggleFaq(id) { openFaq.value = openFaq.value === id ? null : id }
function createTicket() {
  if (!ticketSubject.value.trim()) return
  console.log('TODO: submit ticket:', ticketSubject.value)
  ticketSubject.value = ''
}
async function startNewChat() {
  if (authStore.isLoggedIn && !authStore.isGuest) {
    const id = await firestoreService.createChat(authStore.uid)
    chatStore.setCurrentChatId(id)
    chatStore.resetToWelcome(authStore.fullName?.split(' ')[0], 'fr')
    await chatStore.loadChats(authStore.uid)
    router.push('/app/chat')
  } else {
    router.push('/login')
  }
}
function openResource(url) {
  window.open(url, '_blank')
}
</script>