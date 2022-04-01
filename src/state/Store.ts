import { combineReducers } from "./helpers";
import { Action } from "./interfaces/action.interface";
import { Reducer } from "./interfaces/reducer.interface";

export class Store<T> {

  private state: T;
  private subscribers: Array<(state: T) => void> = [];
  private reducers: Array<Reducer<T>> = []

  constructor(initialState: T) {
    this.state = initialState;
  }

  public dispatch<A>(action: Action<A>) {
    const reducer = combineReducers<T>(...this.reducers);
    const newState = reducer(this.state, action);
    this.state = newState;
    this.broadcast();
  }

  public addReducer(reducer: Reducer<T>) {
    this.reducers.push(reducer);
  }

  public subscribe(handler: (state: T) => void) {
    this.subscribers.push(handler);
  }

  public getState(): T {
    return { ...this.state };
  }

  private broadcast() {
    for (const sub of this.subscribers) {
      sub(this.state);
    }
  }

}