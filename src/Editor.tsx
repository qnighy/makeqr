import React, { useReducer } from "react";
import { initialState, reducer } from "./state";
import { BitmapEditor } from "./BitmapEditor";
import finderPatternImg from "./finder-pattern.png";
import timingPatternImg from "./timing-pattern.png";

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      {
        state.step === "EditFP"
        ? (
          <h2>Step 1: paint the finder patterns</h2>
        )
        : (
          <h2>Step 2: paint the timing patterns</h2>
        )
      }
      <div>
        <button
          onClick={() => {
            if (state.step === "EditTP") {
              dispatch({
                type: "Step",
                newStep: "EditFP"
              });
            }
          }}
          disabled={state.step === "EditFP"}
        >
          Previous Step
        </button>
        <button
          onClick={() => {
            if (state.step === "EditFP") {
              dispatch({
                type: "Step",
                newStep: "EditTP"
              });
            }
          }}
          disabled={state.step === "EditTP"}
        >
          Next Step
        </button>
      </div>
      <BitmapEditor state={state} dispatch={dispatch} />
      <h2>Advice</h2>
      {
        state.step === "EditFP"
        ? (
          <>
            <p>
              <strong>Finder patterns</strong> are the distinctive nested squares.
            </p>
            <img src={finderPatternImg} alt="Figure: finder pattern" />
          </>
        )
        : (
          <>
            <p>
              <strong>Timing patterns</strong> are stripes usually hidden in
              the code, and are used to adjust rows and columns.
            </p>
            <p>
              In regular QR codes, they connect the three finder patterns
              like bridges.
            </p>
            <img src={timingPatternImg} alt="Figure: timing pattern" />
          </>
        )
      }
    </>
  );
};
