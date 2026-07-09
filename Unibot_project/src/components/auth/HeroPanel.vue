<template>
  <!-- Orange hero panel — left side of auth pages -->
  <div class="hero-panel hidden md:flex flex-col justify-between p-10 text-white relative">

    <!-- Logo -->
    <UnibotLogo
      icon-class="w-9 h-9 bg-white/20 text-white p-1.5 rounded-xl"
      text-class="text-xl text-white"
    />

    <!-- Centered content -->
    <div class="flex flex-col gap-6">
      <!-- AI sparkle icon -->
      <div class="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5
               4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5
               4.5 0 00-3.09 3.09z"/>
        </svg>
      </div>

      <div>
        <h1 class="font-display text-4xl leading-tight mb-4">
          <slot name="headline">Elevate Your<br />Academic Journey.</slot>
        </h1>
        <p class="text-white/75 text-base leading-relaxed max-w-xs">
          <slot name="sub">
            Join thousands of students using Unibot to curate their university experience,
            track deadlines, and unlock campus resources.
          </slot>
        </p>
      </div>

      <!-- Feature pills -->
      <div class="flex flex-col gap-3 mt-2">
        <slot name="features">
          <FeaturePill icon="check">Official University Integration</FeaturePill>
          <FeaturePill icon="clock">Real-time Deadline Alerts</FeaturePill>
        </slot>
      </div>
    </div>

    <!-- Bottom quote (login variant) -->
    <div v-if="showQuote" class="space-y-3">
      <p class="text-white/90 text-base italic leading-relaxed">
        "Academic excellence at your fingertips, simplified by intelligence."
      </p>
      <!-- Slide dots -->
      <div class="flex gap-2">
        <span class="w-6 h-1 rounded-full bg-white opacity-100"></span>
        <span class="w-3 h-1 rounded-full bg-white opacity-40"></span>
        <span class="w-3 h-1 rounded-full bg-white opacity-40"></span>
      </div>
    </div>
    <div v-else class="h-1" />

    <!-- Decorative overlay image -->
    <div class="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-none" />
  </div>
</template>

<script setup>
import UnibotLogo from '@/components/common/UnibotLogo.vue'
import FeaturePill from './FeaturePill.vue'

defineProps({
  showQuote: { type: Boolean, default: false },
})
</script>