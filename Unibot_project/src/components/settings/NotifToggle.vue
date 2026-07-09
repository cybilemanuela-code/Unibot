<template>
  <label class="flex items-center gap-3 cursor-pointer">
    <input type="checkbox" v-model="enabled" />

    <span>
      {{ label }}
    </span>
  </label>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  label: String
})

const enabled = ref(false)
</script>