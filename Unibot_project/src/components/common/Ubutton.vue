<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClass, variantClass, sizeClass]"
    v-bind="$attrs"
  >
    <!-- Spinner shown when loading -->
    <svg v-if="loading" class="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type:     { type: String, default: 'button' },
  variant:  { type: String, default: 'primary' },  // primary | ghost | outline | danger
  size:     { type: String, default: 'md' },        // sm | md | lg
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  full:     { type: Boolean, default: true },
})

const baseClass = computed(() =>
  `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200
   disabled:opacity-60 disabled:cursor-not-allowed ${props.full ? 'w-full' : ''}`
)

const variantClass = computed(() => ({
  primary: 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm hover:shadow-md',
  ghost:   'bg-white border border-surface-200 hover:bg-surface-50 text-gray-700 shadow-input',
  outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
  danger:  'bg-red-500 hover:bg-red-600 text-white',
  dark:    'bg-amber-700 hover:bg-amber-800 text-white',
}[props.variant]))

const sizeClass = computed(() => ({
  sm: 'text-xs px-3 py-2',
  md: 'text-sm px-4 py-3.5',
  lg: 'text-base px-6 py-4',
}[props.size]))
</script>