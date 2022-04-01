import { Action } from "./interfaces/action.interface";
import { Reducer } from "./interfaces/reducer.interface";

type StatePartial<T> = Partial<T> | Partial<T[keyof T]>;
type ReducerList<T> = Array<Reducer<StatePartial<T>>>

export const combineReducers = <T>(...reducers: ReducerList<T>): Reducer<T> => {
  const reducer = ((state: T, action: Action<unknown>) => reducers.reduce((acc, reducer) => {
    const _state = acc[reducer.key];
    if (_state && reducer.key !== '_') {
      return { ...acc, [reducer.key]: reducer(_state, action) };
    }
    return { ...acc, ...(reducer(acc, action)) };
  }, state)) as Reducer<T>;

  return reducer;
}