import React, { useReducer, useRef } from "react";
import immer from "immer";
import "./Editor.css";

const PIXEL_SIZE = 10;

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const paintMode = useRef<number | null>(null);
  const fps = detectFP(state.bitmap);
  return (
    <svg
      width={`${state.bitmap[0].length * PIXEL_SIZE}px`}
      height={`${state.bitmap.length * PIXEL_SIZE}px`}
    >
      <rect
        x={0}
        y={0}
        width={`${state.bitmap[0].length * PIXEL_SIZE}px`}
        height={`${state.bitmap.length * PIXEL_SIZE}px`}
        fill="gray"
        stroke="black"
      />
      {
        state.bitmap.flatMap((row, yi) =>
          row.map((bit, xi) => (
            <rect
              key={`${yi}-${xi}`}
              x={`${xi * PIXEL_SIZE}px`}
              y={`${yi * PIXEL_SIZE}px`}
              width={`${PIXEL_SIZE-1}px`}
              height={`${PIXEL_SIZE-1}px`}
              fill={bit ? "black" : "white"}
              onMouseDown={() => {
                paintMode.current = bit ^ 1;
                dispatch({
                  type: "Paint",
                  yi,
                  xi,
                  bit: bit ^ 1,
                });
              }}
              onMouseEnter={(e) => {
                if (isPressed(e.buttons) && paintMode.current != null) {
                  dispatch({
                    type: "Paint",
                    yi,
                    xi,
                    bit: paintMode.current,
                  });
                }
              }}
              onMouseUp={() => {
                paintMode.current = null;
              }}
            />
          ))
        )
      }
      {
        fps.map((fpCenter, fpi) => (
          <rect
            key={fpi}
            className={
              checkFP(state.bitmap, fpCenter)
                ? "indicator indicator-ok"
                : "indicator indicator-error"
            }
            y={`${(fpCenter.y - 3) * PIXEL_SIZE}px`}
            x={`${(fpCenter.x - 3) * PIXEL_SIZE}px`}
            height={`${7 * PIXEL_SIZE}px`}
            width={`${7 * PIXEL_SIZE}px`}
          />
        ))
      }
    </svg>
  );
};

function isPressed(buttons: number): boolean {
  return (buttons & 1) === 1;
}

type Action = FooAction | PaintAction;
type FooAction = {
  type: "Foo";
};
type PaintAction = {
  type: "Paint";
  yi: number;
  xi: number;
  bit: number;
};

type State = {
  readonly bitmap: Bitmap;
};

type Bitmap = readonly (readonly number[])[];

const initialState: State = {
  bitmap: new Array(60).fill(0).map(() => new Array(60).fill(0)),
}

function reducer(prevState: State, action: Action): State {
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

type FP = {
  readonly y: number;
  readonly x: number;
};

function detectFP(bitmap: Bitmap): readonly FP[] {
  return [
    { y: 7, x: 7 },
    { y: 21, x: 7 },
    { y: 7, x: 21 },
  ];
}

const DIST_TO_BIT = [1, 1, 0, 1, 0] as const;
function checkFP(bitmap: Bitmap, fp: FP): boolean {
  for (let dy = -3; dy <= 3; ++dy) {
    for (let dx = -3; dx <= 3; ++dx) {
      const dist = Math.max(Math.abs(dy), Math.abs(dx));
      const expectBit = DIST_TO_BIT[dist];
      if (bitmap[fp.y + dy][fp.x + dx] !== expectBit) return false;
    }
  }
  return true;
}
