import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import { bundlerMiddleware } from './middlewares/bundler-middleware';
import { persistMiddleWare } from './middlewares/persist-middleware';

export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleWare, bundlerMiddleware, thunk)
);
