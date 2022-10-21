import React, { useReducer } from "react";
import { initialState, reducer } from "./state";
import { BitmapEditor } from "./BitmapEditor";

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
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
    </>
  );
};
