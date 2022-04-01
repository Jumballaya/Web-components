import { Action } from "./action.interface";

export interface Reducer<T> {
  key: string;
  (state: T, action: Action<unknown>): T;
}