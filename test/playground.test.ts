import { expect, test } from "@jest/globals";
import { Direction, findWinningCombination, isFull, Playground } from "../src/lib/playground";

function createPlayground(playground: string): Playground {
  return playground.trim().split("\n").map(l =>
    l.trim().split("|").map(p => ({
      "X": true,
      "O": false
    }[p] ?? undefined)));
}

test("createPlayground creates correct playgrounds", () => {
  expect(createPlayground(`
  X|X|X
  O| | 
   |O|X
  `)).toEqual([
    [ true, true, true ],
    [ false, undefined, undefined ],
    [ undefined, false, true ]
  ]);
});

test("isFull is false for a partially full field", () => {
  expect(isFull(createPlayground(`
  X|X|X
  O| |O
  X|O|X
  `), 3)).toBe(false);
});

test("isFull is true for a full field", () => {
  expect(isFull(createPlayground(`
  X|X|X
  O|X|O
  X|O|X
  `), 3)).toBe(true);
});

test("horizontal winning combination", () => {
  expect(findWinningCombination(createPlayground(`
  X|X|X
   | | 
   | | 
  `), 3)).toStrictEqual({
    start: { y: 0, x: 0 },
    end: { y: 0, x: 2 },
    dir: Direction.Right
  });
});

test("vertical winning combination", () => {
  expect(findWinningCombination(createPlayground(`
   |X| 
   |X| 
   |X| 
  `), 3)).toStrictEqual({
    start: { y: 0, x: 1 },
    end: { y: 2, x: 1 },
    dir: Direction.Down
  });
});

test("diagonal-forwards winning combination", () => {
  expect(findWinningCombination(createPlayground(`
  X| | 
   |X| 
   | |X
  `), 3)).toStrictEqual({
    start: { y: 0, x: 0 },
    end: { y: 2, x: 2 },
    dir: Direction.DiagonalForward
  });
});

test("diagonal-backwards winning combination", () => {
  expect(findWinningCombination(createPlayground(`
   | |X 
   |X| 
  X| | 
  `), 3)).toStrictEqual({
    start: { y: 2, x: 0 },
    end: { y: 0, x: 2 },
    dir: Direction.DiagonalBackward
  });
});
