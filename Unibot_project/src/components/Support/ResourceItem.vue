<template>
  <div class="flex items-start gap-3 p-4 rounded-lg border border-surface-200 hover:border-surface-300 hover:bg-surface-50 transition-all cursor-pointer" @click="$emit('click', url)">
    <div class="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
      <svg class="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 2 0 000 2h2a1 1 0 100-2H9z"></path>
        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 110 4h.5a1 1 0 110 2H4a2 2 0 110-4h.5a1 1 0 100-2H6a2 2 0 01-2-2z" clip-rule="evenodd"></path>
      </svg>
    </div>
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-gray-900">{{ title }}</h4>
      <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ description }}</p>
    </div>
    <svg class="w-4 h-4 text-gray-400 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  icon: String,
  url: String,
})
defineEmits(['click'])
</script>
