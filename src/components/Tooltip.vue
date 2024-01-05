<template>
  <div class="relative" @click="show = !show">
    <slot></slot>
    <div :class="{'invisible': show == undefined, 'hide': show == false}"
         class="absolute top-full left-1/2 -translate-x-1/2">
      <slot name="tooltip"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";

const show = ref();
watchEffect(() => {
  if (show.value) {
    setTimeout(() => show.value = false, 500);
  }
});
</script>

<style lang="sass" scoped>
@keyframes hide
  from
    opacity: 1
  to
    opacity: 0
    visibility: hidden

.hide
  animation: hide 1s ease-out forwards
</style>
