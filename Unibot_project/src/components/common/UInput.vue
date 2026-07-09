<template>
  <div class="relative">
    <!-- Left icon slot -->
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <slot name="icon" />
    </span>

    <input
      v-bind="$attrs"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['auth-input', { 'error': !!error, 'pl-10': hasIcon, 'pl-4': !hasIcon }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />

    <!-- Right slot (e.g. eye toggle for password) -->
    <span class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
      <slot name="right" />
    </span>
  </div>

  <!-- Error message -->
  <p v-if="error" class="mt-1 text-xs text-red-500 flex items-center gap-1">
    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
    </svg>
    {{ error }}
  </p>
</template>

<script setup>
import { computed, useSlots } from 'vue'

defineProps({
  modelValue:  { type: String, default: '' },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error:       { type: String, default: '' },
})

defineEmits(['update:modelValue', 'blur'])

const slots   = useSlots()
const hasIcon = computed(() => !!slots.icon)
</script>