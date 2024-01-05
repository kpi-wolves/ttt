import { reactive, toRef, watch } from "vue";
import connection, { MessageType } from "./connection";
import type { Playground } from "./playground";
import { findWinningCombination, isFull, strikeSize } from "./playground";

export const TIE = "TIE";
const PERSISTENT_DATA_KEY = "persistent_data";

export interface LocalState {
  playing: boolean;
  myTurn: boolean;
  playground: Playground;
  beginTime: Date;
}

export interface SharedState {
  playgroundSize: number,
  piece: boolean,
}

export interface Match {
  shared: SharedState,
  playground: Playground,
  opponent: string,
  duration: number
}

export interface PersistentState {
  matches: Match[];
}

class State {
  local: LocalState = {
    playing: false,
    myTurn: false,
    playground: [],
    beginTime: new Date()
  };
  shared: SharedState = {
    playgroundSize: 5,
    piece: true
  };
  persistent: PersistentState = {
    matches: []
  };

  get winningCombination() {
    return findWinningCombination(this.local.playground, strikeSize(this.shared.playgroundSize));
  }

  get winner(): boolean | typeof TIE | null {
    const comb = this.winningCombination;
    if (comb) return this.local.playground[comb.start.y]?.[comb.start.x]!;
    if (isFull(this.local.playground, this.shared.playgroundSize)) return TIE;
    return null;
  }

  get isWinner() {
    return this.winner == this.shared.piece;
  }

  resetLocal() {
    Object.assign(this.local, {
      playing: false,
      myTurn: connection.connected && this.shared.piece,
      playground: [],
      beginTime: new Date()
    } satisfies LocalState);
  }
}

export const state: State = reactive(new State());

{
  const data = localStorage.getItem(PERSISTENT_DATA_KEY);
  if (data != null) {
    try {
      Object.assign(state.persistent, JSON.parse(data));
    } catch (e) {
    }
  }
}

connection.on("message", msg => {
  switch (msg.type) {
    case MessageType.State:
      msg.state.piece = !msg.state.piece;
      Object.assign(state.shared, msg.state);
      break;
    case MessageType.Rematch:
      state.resetLocal();
      break;
  }
});

// Reset local state on connection state change, send initial settings
connection.on("connected", () => {
  state.resetLocal();

  if (!connection.slave) {
    connection.send({ type: MessageType.State, state: state.shared });
  }
});

// Send shared state
watch(state.shared, sharedState => {
  if (!connection.slave) {
    connection.send({ type: MessageType.State, state: sharedState });
  }
  state.resetLocal();
});

// Disallow further moves after winning combination is found
watch(toRef(state, "winner"), winner => {
  if (connection.connected && winner != null) {
    state.local.myTurn = false;
    const matches = state.persistent.matches;
    const m = {
      shared: state.shared,
      playground: state.local.playground,
      opponent: connection.remoteId!,
      duration: (new Date().getTime() - state.local.beginTime.getTime()) / 1000
    };
    matches.push(JSON.parse(JSON.stringify(m)));
    if (matches.length > 6) {
      matches.shift();
    }
  }
});

watch(state.persistent, persistentState => {
  localStorage.setItem(PERSISTENT_DATA_KEY, JSON.stringify(persistentState));
});
