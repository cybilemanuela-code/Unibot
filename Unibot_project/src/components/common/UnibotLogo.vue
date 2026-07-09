<template>
  <div class="flex items-center gap-2">
    <!-- Graduation cap icon -->
    <div :class="['rounded-xl flex items-center justify-center', iconClass]">
      <svg :class="svgClass" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
      </svg>
    </div>
    <span :class="['font-display font-semibold tracking-tight', textClass]">Unibot</span>
  </div>
</template>

<script setup>
defineProps({
  variant:   { type: String, default: 'dark' }, // dark | light
  iconClass: { type: String, default: 'w-8 h-8 bg-brand-500/90 text-white p-1.5' },
  svgClass:  { type: String, default: 'w-5 h-5' },
  textClass: { type: String, default: 'text-xl text-gray-900' },
})
</script>