import immer from "immer";

export type Action = FooAction | PaintAction;
export type FooAction = {
  type: "Foo";
};
export type PaintAction = {
  type: "Paint";
  yi: number;
  xi: number;
  bit: number;
};

export type State = {
  readonly bitmap: Bitmap;
};

export type Bitmap = readonly (readonly number[])[];

export const initialState: State = {
  bitmap: new Array(60).fill(0).map(() => new Array(60).fill(0)),
}

export function reducer(prevState: State, action: Action): State {
  return immer<State>(prevState, (draft) => {
    switch (action.type) {
      case "Foo":
        break;
      case "Paint":
        draft.bitmap[action.yi][action.xi] = action.bit;
        break;
      default:
        throw new Error(`Invalid action type: ${(action as { type: "$invalid" }).type}`)
    }
  });
}

export type FP = {
  readonly y: number;
  readonly x: number;
};

export function detectFP(bitmap: Bitmap): readonly FP[] {
  return [
    { y: 7, x: 7 },
    { y: 21, x: 7 },
    { y: 7, x: 21 },
  ];
}

const DIST_TO_BIT = [1, 1, 0, 1, 0] as const;
export function checkFP(bitmap: Bitmap, fp: FP, extend: boolean): boolean {
  const limit = extend ? 4 : 3;
  for (let dy = -limit; dy <= limit; ++dy) {
    for (let dx = -limit; dx <= limit; ++dx) {
      const dist = Math.max(Math.abs(dy), Math.abs(dx));
      const expectBit = DIST_TO_BIT[dist];
      if (bitmap[fp.y + dy][fp.x + dx] !== expectBit) return false;
    }
  }
  return true;
}
