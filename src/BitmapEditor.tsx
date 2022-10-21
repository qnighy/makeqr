import React, { useRef } from "react";
import { Action, checkFP, detectFP, State } from "./state";
import "./BitmapEditor.css";

const PIXEL_SIZE = 10;

export type BitmapEditorProps = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export const BitmapEditor: React.FC<BitmapEditorProps> = (props) => {
  const { state, dispatch } = props;
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
        fps.map((fpCenter, fpi) =>
          checkFP(state.bitmap, fpCenter, true)
          ? (
            <rect
              key={fpi}
              className="indicator indicator-ok"
              y={`${(fpCenter.y - 3) * PIXEL_SIZE}px`}
              x={`${(fpCenter.x - 3) * PIXEL_SIZE}px`}
              height={`${7 * PIXEL_SIZE}px`}
              width={`${7 * PIXEL_SIZE}px`}
            />
          )
          : checkFP(state.bitmap, fpCenter, false)
          ? (
            <path
              key={fpi}
              className="indicator indicator-error"
              d={[
                `M ${(fpCenter.x - 4) * PIXEL_SIZE} ${(fpCenter.y - 4) * PIXEL_SIZE}`,
                `L ${(fpCenter.x - 4) * PIXEL_SIZE} ${(fpCenter.y + 5) * PIXEL_SIZE}`,
                `L ${(fpCenter.x + 5) * PIXEL_SIZE} ${(fpCenter.y + 5) * PIXEL_SIZE}`,
                `L ${(fpCenter.x + 5) * PIXEL_SIZE} ${(fpCenter.y - 4) * PIXEL_SIZE}`,
                "Z",
                `M ${(fpCenter.x - 3) * PIXEL_SIZE} ${(fpCenter.y - 3) * PIXEL_SIZE}`,
                `L ${(fpCenter.x + 4) * PIXEL_SIZE} ${(fpCenter.y - 3) * PIXEL_SIZE}`,
                `L ${(fpCenter.x + 4) * PIXEL_SIZE} ${(fpCenter.y + 4) * PIXEL_SIZE}`,
                `L ${(fpCenter.x - 3) * PIXEL_SIZE} ${(fpCenter.y + 4) * PIXEL_SIZE}`,
                "Z",
              ].join(" ")}
            />
          )
          : (
            <rect
              key={fpi}
              className="indicator indicator-error"
              y={`${(fpCenter.y - 3) * PIXEL_SIZE}px`}
              x={`${(fpCenter.x - 3) * PIXEL_SIZE}px`}
              height={`${7 * PIXEL_SIZE}px`}
              width={`${7 * PIXEL_SIZE}px`}
            />
          )
        )
      }
    </svg>
  );
};

function isPressed(buttons: number): boolean {
  return (buttons & 1) === 1;
}
