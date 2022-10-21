import React, { useReducer, useRef } from "react";
import immer from "immer";

const PIXEL_SIZE = 30;

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const paintMode = useRef<number | null>(null);
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
  readonly bitmap: readonly (readonly number[])[];
};

const initialState: State = {
  bitmap: new Array(20).fill(0).map(() => new Array(20).fill(0)),
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
