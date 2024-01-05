export enum Direction {
  Right,
  Down,
  DiagonalForward,
  DiagonalBackward
}

export interface Position {
  x: number,
  y: number
}

export interface Combination {
  start: Position,
  end: Position,
  dir: Direction
}

export type Playground = ((boolean | undefined)[] | undefined)[]

export function findWinningCombination(playground: Playground, strike: number): Combination | null {
  function test(x: number, y: number, dir: Direction): Position[] | null {
    let piece = playground[y]?.[x];
    if (piece == null)
      return null;

    const combination = [];
    for (let i = 0; ; i++) {
      if (playground[y]?.[x] != piece) break;

      combination.push({ x, y });

      if (i == strike - 1) {
        return combination;
      }

      if (dir == Direction.Right) {
        x++;
      } else if (dir == Direction.Down) {
        y++;
      } else if (dir == Direction.DiagonalForward) {
        x++;
        y++;
      } else if (dir == Direction.DiagonalBackward) {
        x++;
        y--;
      }
    }

    return null;
  }

  for (let [y, row] of playground.entries()) {
    for (let x of row?.keys() ?? []) {
      for (let dir of [Direction.Right, Direction.Down, Direction.DiagonalForward, Direction.DiagonalBackward]) {
        const comb = test(x, y, dir);
        if (comb)
          return {
            start: comb[0],
            end: comb[comb.length - 1],
            dir
          };
      }
    }
  }

  return null;
}

export function countMoves(playground: Playground): number {
  return playground.reduce((acc, it) =>
    acc + (it?.reduce((acc, it) => it != undefined ? acc + 1 : acc, 0) ?? 0), 0);
}

export function isFull(playground: Playground, size: number): boolean {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (playground[y]?.[x] == undefined) return false;
    }
  }
  return true;
}

export function strikeSize(playgroundSize: number): number {
  if (playgroundSize < 5) return 3;
  if (playgroundSize < 8) return 5;
  return 6;
}
