export interface Action<T> {
  type: symbol;
  payload: T;
}