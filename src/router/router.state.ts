import { Action } from "../state/interfaces/action.interface";
import { Reducer } from "../state/interfaces/reducer.interface";
import { RouteState } from "./interfaces/route-state.interface";

export const ROUTE_NAVIGATE_TO = Symbol('Route: Navigate to');
export const routeInitialState: RouteState = {
  path: '/',
  params: {},
  title: '',
}

export const routeReducer: Reducer<RouteState> = (state, _action) => {
  switch (_action.type) {
    case ROUTE_NAVIGATE_TO: {
      const action = _action as Action<RouteState>
      return {
        ...state,
        ...(action.payload),
      }
    }

    default: {
      return state;
    }
  }
}

routeReducer.key = 'route';