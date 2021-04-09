import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface BundlesState {
  [key: string]: {
    code: string;
    err: string;
    loading: boolean;
  };
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_LOADING:
        state[action.payload.cellId] = action.payload.bundle;

        return state;
      case ActionType.BUNDLE_CREATED:
        state[action.payload.cellId] = action.payload.bundle;

        return state;
      default:
        return state;
    }
  }
);

export default reducer;
