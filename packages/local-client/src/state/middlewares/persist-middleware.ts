import { saveCells } from '../action-creators';
import { ActionType } from '../action-types';
import { Middleware } from './middleware';

export const persistMiddleWare: Middleware = ({ dispatch, getState }) => {
  let timer: any;

  return (next) => {
    return (action) => {
      next(action);

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};
