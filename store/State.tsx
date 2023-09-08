import { Dispatch, FC, ReactNode, Reducer, createContext, useContext, useReducer } from "react";
import { reducer, IMutualState, TAction } from "./reducer";

const StateContext = createContext<[IMutualState, Dispatch<TAction>] | undefined>(undefined);

interface IStateProviderProps {
  reducer: Reducer<IMutualState, TAction>;
  initialState: IMutualState;
  children: ReactNode;
}

const StateProvider: FC<IStateProviderProps> = ({ reducer, initialState, children }) => {
  return (
    < StateContext.Provider value={useReducer(reducer, initialState)} >
      {children}
    </StateContext.Provider >);
}
const useStateValue = () => useContext(StateContext);

export { StateContext, IStateProviderProps, StateProvider, useStateValue }