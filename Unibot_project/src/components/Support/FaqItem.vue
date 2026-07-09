<template>
  <div
    class="border border-surface-200 rounded-xl overflow-hidden cursor-pointer
           hover:border-surface-300 transition-colors"
    @click="$emit('toggle')"
  >
    <div class="flex items-center justify-between px-5 py-4">
      <span class="text-sm font-medium text-gray-800 pr-4">{{ question }}</span>
      <svg :class="['w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200', open && 'rotate-180']"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
    <Transition name="faq">
      <div v-if="open" class="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-surface-100">
        <div class="pt-3">{{ answer }}</div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
defineProps({ question: String, answer: String, open: Boolean })
defineEmits(['toggle'])
</script>

<style scoped>
.faq-enter-active, .faq-leave-active { transition: all 0.2s ease; }
.faq-enter-from, .faq-leave-to { opacity: 0; transform: translateY(-4px); }
</style>