<template>
  <div :class="canChangeSettings ? ['cursor-pointer'] : ['pointer-events-none']"
       class="flex border border-blue-700 select-none">
    <div class="w-6 grid gap-y-2">
      <div :class="piece ? ['bg-purple-600'] : ['bg-amber-500']"
           class="flex justify-center items-center"
           @click="piece = true">
        X
      </div>
      <div :class="!piece ? ['bg-purple-600'] : ['bg-amber-500']"
           class="flex justify-center items-center"
           @click="piece = false">
        O
      </div>
    </div>
    <div class="ml-4 grow grid grid-cols-4 gap-2">
      <div v-for="size in sizes" :class="[state.shared.playgroundSize == size ? 'bg-purple-600' : 'bg-sky-500']"
           class="w-14 flex justify-center items-center"
           @click="state.shared.playgroundSize = size">
        {{ size }}x{{ size }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRef } from "vue";
import connection from "../lib/connection";
import { state } from "../lib/state";

const sizes = computed(() => new Array(8).fill(0).map((_, idx) => idx + 3));
const canChangeSettings = computed(() => !connection.slave && !state.local.playing);

const piece = toRef(state.shared, "piece");
</script>

<style scoped>

</style>
