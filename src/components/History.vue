<template>
  <div :class="{'pointer-events-none': connection.connected}"
       class="w-56 border border-fuchsia-600 grid grid-flow-row auto-rows-min gap-y-2 p-2">
    <div v-for="match of matches"
         :class="[match.isWinner ? 'bg-green-500' : match.isTie ? 'bg-yellow-500' : 'bg-red-500']"
         class="flex flex-col rounded px-1 py-0.5 cursor-pointer"
         @click="selectMatch(match)">
      <div class="col-span-3" v-text="match.opponent"></div>
      <div class="flex">
        <div>{{ match.shared.piece ? "X" : "O" }}</div>
        <div class="ml-2 w-12">{{ Math.ceil(match.duration) }}s</div>
        <div class="ml-2 whitespace-nowrap">{{ match.moveCount }} moves</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick } from "vue";
import connection from "../lib/connection";
import { type Combination, countMoves, findWinningCombination, strikeSize } from "../lib/playground";
import { type LocalState, type Match, state } from "../lib/state";

interface ExtendedMatch extends Match {
  comb: Combination | null;
  isWinner: boolean,
  isTie: boolean,
  moveCount: number
}

const matches = computed(() => state.persistent.matches.map((m): ExtendedMatch => {
  const comb = findWinningCombination(m.playground, strikeSize(m.shared.playgroundSize));
  return {
    ...m,
    comb: comb,
    isWinner: (comb && m.playground[comb.start.y]![comb.start.x] == m.shared.piece) ?? false,
    isTie: comb == null,
    moveCount: countMoves(m.playground)
  };
}));

async function selectMatch(m: ExtendedMatch) {
  state.local.playground = [];
  Object.assign(state.shared, m.shared);
  await nextTick();

  Object.assign(state.local, {
    playground: m.playground
  } satisfies Partial<LocalState>);
}
</script>

<style lang="sass" scoped>

</style>
