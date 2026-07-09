<template>
  <div class="flex items-start gap-3 mb-4">
    <div class="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center shrink-0">
      <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73A2 2 0 0110 4a2 2 0 012-2z"/>
      </svg>
    </div>
    <div class="bubble-bot py-3.5 px-4 flex items-center gap-1.5">
      <span v-for="i in 3" :key="i"
        class="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
        :style="{ animationDelay: `${(i-1) * 0.15}s` }" />
    </div>
  </div>
</template>