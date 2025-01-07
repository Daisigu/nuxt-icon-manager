<template>
  <svg
    v-if="name"
    role="img"
    class="icon"
  >
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
import type { IconNames } from '#icons'

interface Props {
  name: IconNames
}
defineProps<Props>()
</script>
