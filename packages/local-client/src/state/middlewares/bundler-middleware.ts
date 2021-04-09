import { Middleware } from './middleware';
import { ActionType } from '../action-types';
import bundle from '../../bundler';

let timer: any;
export const bundlerMiddleware: Middleware = ({ getState, dispatch }) => (
  next
) => (action) => {
  next(action);

  if (action.type !== ActionType.UPDATE_CELL) {
    return;
  }
  const {
    cells: { data: cellData, order: cellOrder },
  } = getState();
  const cell = cellData[action.payload.id];

  if (cell.type === 'text') {
    return;
  }

  const cumulativeCode = () => {
    const orderedCells = cellOrder.map((id) => cellData[id]);

    const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var show = (value) => {
      const root =  document.querySelector('#root')


      if(typeof value === 'object') {
        if(value.$$typeof && value.props) {
          _ReactDOM.render(value,  root)
        }else {
          root.innerHTML = JSON.stringify(value);

        }
      } else {
      root.innerHTML = value;}
    }
    `;
    const showFuncNoop = 'var show = () => {}';
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cell.id) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cell.id) {
        break;
      }
    }

    return cumulativeCode;
  };

  clearTimeout(timer);
  timer = setTimeout(async () => {
    dispatch({
      type: ActionType.BUNDLE_LOADING,
      payload: {
        cellId: action.payload.id,
        bundle: { code: '', err: '', loading: true },
      },
    });

    const result = await bundle(cumulativeCode().join('\n'));

    dispatch({
      type: ActionType.BUNDLE_CREATED,
      payload: {
        cellId: action.payload.id,
        bundle: { ...result, loading: false },
      },
    });
  }, 750);
};
