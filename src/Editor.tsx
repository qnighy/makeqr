import React, { useReducer } from "react";
import { initialState, reducer } from "./state";
import { BitmapEditor } from "./BitmapEditor";

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BitmapEditor state={state} dispatch={dispatch} />
  );
};
