<template>
  <div class="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-2.5 w-fit">
    <!-- Check icon -->
    <div class="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path v-if="icon === 'check'" fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"/>
        <path v-else fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"/>
      </svg>
    </div>
    <span class="text-sm text-white/90 font-medium"><slot /></span>
  </div>
</template>

<script setup>
defineProps({ icon: { type: String, default: 'check' } })
</script>