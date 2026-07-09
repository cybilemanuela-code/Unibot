<template>
  <!-- Bot message -->
  <div v-if="message.role === 'bot'" class="flex items-start gap-3 mb-5">
    <!-- Bot avatar -->
    <div class="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center shrink-0 mt-0.5">
      <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73A2 2 0 0110 4a2 2 0 012-2zM5 14v2a7 7 0 0014 0v-2H5zm7 8a9 9 0 01-9-9h18a9 9 0 01-9 9z"/>
      </svg>
    </div>

    <div class="flex flex-col gap-2 max-w-[78%]">
      <!-- Text bubble -->
      <div class="bubble-bot whitespace-pre-wrap">
  {{ message.text }}
</div>

      <!-- Status cards (financial aid, campus visit, etc.) -->
      <div v-if="message.cards" class="grid grid-cols-2 gap-3 mt-1">
        <div v-for="card in message.cards" :key="card.id"
          class="bg-white rounded-xl border border-surface-200 p-4 shadow-sm">
          <div class="flex items-start justify-between mb-3">
            <div class="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  :d="card.icon === 'finance'
                    ? 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                    : 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'"/>
              </svg>
            </div>
            <span :class="card.status === 'IN PROGRESS' ? 'badge-progress' : 'badge-confirmed'">
              {{ card.status }}
            </span>
          </div>
          <p class="text-xs text-gray-400 mb-0.5">{{ card.label }}</p>
          <p class="text-sm font-bold text-gray-800">{{ card.value }}</p>
        </div>
      </div>

      <p class="text-xs text-gray-400 ml-1">{{ message.time }}</p>
    </div>
  </div>

  <!-- User message -->
  <div v-else class="flex items-end justify-end gap-3 mb-5">
    <div class="flex flex-col items-end gap-1 max-w-[72%]">
      <div class="bubble-user whitespace-pre-wrap">
  {{ message.text }}
</div>
      <p class="text-xs text-gray-400 mr-1">{{ message.time }}</p>
    </div>

    <!-- User avatar -->
    <div class="w-8 h-8 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center shrink-0 mb-5">
      <img v-if="userAvatar" :src="userAvatar" class="w-full h-full object-cover" />
      <span v-else class="text-xs font-bold text-brand-600">{{ userInitials }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  message: { type: Object, required: true }
})

const auth = useAuthStore()
const userAvatar   = computed(() => auth.avatar)
const userInitials = computed(() => auth.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U')
</script>