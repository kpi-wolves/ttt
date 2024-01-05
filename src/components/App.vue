<template>
  <div class="flex w-screen h-screen justify-start items-start">
    <div class="grid gap-10 border border-amber-500 m-10 p-10 pt-4">
      <Connection class="grid-cols-1 col-span-2 grid-rows-1"/>
      <History class="col-start-1 row-start-2"/>
      <div class="col-start-2 row-start-2 flex flex-col items-start">
        <PlaygroundSettings class=""/>
        <Playground class="mt-4 self-center"/>
        <button :class="{'invisible': !(connection.connected && !connection.slave && state.winner != null)}"
                class="m-4 mb-0 self-end bg-blue-500 rounded-lg px-2 py-1 text-gray-200"
                @click="rematch">
          Rematch
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import connection, { MessageType } from "../lib/connection";
import Connection from "./Connection.vue";
import History from "./History.vue";
import Playground from "./Playground.vue";
import PlaygroundSettings from "./PlaygroundSettings.vue";
import { state } from "../lib/state";

function rematch() {
  state.resetLocal();
  connection.send({ type: MessageType.Rematch });
}
</script>

<style lang="sass" scoped>
.cells > *
  @apply w-10 h-10 flex items-center justify-center
</style>
