<template>
  <div :class="{'pointer-events-none': !state.local.myTurn}"
       :style="{gridTemplateColumns: gridTemplate, gridTemplateRows: gridTemplate}"
       class="grid select-none">
    <div v-for="{x, y, piece} in playgroundDef"
         :class="[plSize <= 6 ? 'w-12 h-12 text-3xl' : plSize <= 9 ? 'w-10 h-10 text-2xl' : 'w-8 h-8 text-xl',
                  x == 0 ? 'border-l' : '', y == 0 ? 'border-t' : '',
                  piece != undefined ? 'pointer-events-none' : '']"
         :style="{gridColumnStart: x + 1, gridRowStart: y + 1}"
         class="border-r border-b border-black flex justify-center items-center cursor-pointer"
         @click="clickCell(x,y)">
      {{ piece == true ? "X" : piece == false ? "O" : "" }}
    </div>

    <template v-if="winningComb">
      <div :style="winCombArea" class="flex items-center justify-center pointer-events-none">
        <div :class="{
               'w-[141.5%] h-1': winningComb.dir == Direction.DiagonalForward ||
                                 winningComb.dir == Direction.DiagonalBackward,
               'rotate-45': winningComb.dir == Direction.DiagonalForward,
               'rotate-135': winningComb.dir == Direction.DiagonalBackward,
               'flex-col w-1 h-full': winningComb.dir == Direction.Down,
               'w-full h-1': winningComb.dir == Direction.Right
             }"
             class="flex-shrink-0 flex items-stretch">
          <div :class="state.isWinner ? 'bg-green-500' : 'bg-red-500'" class="rounded-xl cross-animation"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, type StyleValue, toRef, toRefs } from "vue";
import connection, { MessageType } from "../lib/connection";
import { Direction } from "../lib/playground";
import { state } from "../lib/state";

const { playgroundSize: plSize } = toRefs(state.shared);
const { playground } = toRefs(state.local);
const winningComb = toRef(state, "winningCombination");
const gridTemplate = computed(() => `repeat(${plSize.value}, 1fr)`);

const playgroundDef = computed<{ x: number, y: number, piece: boolean | undefined }[]>(() => [].concat(
    ...Array.from({ length: plSize.value }, (_, y) =>
        Array.from({ length: plSize.value }, (_, x) =>
            ({ x, y, piece: playground.value[y]?.[x] })
        )
    )
));

const winCombArea = computed((): StyleValue => {
  const value = winningComb.value;
  if (!value) return {};

  return {
    gridColumnStart: value.start.x + 1,
    gridRowStart: value.start.y + 1,
    gridColumnEnd: value.end.x + 2,
    gridRowEnd: value.end.y + 2
  };
});

function clickCell(x: number, y: number) {
  state.local.playing = true;
  state.local.myTurn = false;

  playground.value[y] = playground.value[y] ?? [];
  playground.value[y]![x] = state.shared.piece;
  connection.send({
    type: MessageType.Move,
    pos: { x, y }
  });
}

connection.on("message", msg => {
  if (msg.type == MessageType.Move) {
    playground.value[msg.pos.y] = playground.value[msg.pos.y] ?? [];
    playground.value[msg.pos.y]![msg.pos.x] = !state.shared.piece;
    state.local.myTurn = true;
  }
});
</script>

<style lang="sass" scoped>
@keyframes strikethrough
  from
    flex-grow: 0
  to
    flex-grow: 1

.cross-animation
  animation: strikethrough ease-out .5s forwards
</style>
