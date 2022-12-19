import { autoBatchEnhancer, configureStore, Middleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';
import { rootReducer } from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

/* eslint-disable */
const logger: Middleware = store => next => action => {
  console.groupCollapsed(action.type);
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
/* eslint-enable */

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat();
  },
  enhancers: (existingEnhancers) => {
    // Add the autobatch enhancer to the store setup
    return existingEnhancers.concat(autoBatchEnhancer({ type: 'tick' }));
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<RootState>();

export default store;
