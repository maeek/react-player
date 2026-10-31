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

export const createPlayerStore = (type: 'video' | 'audio' = 'video') => {
  const initialState = rootReducer(undefined, { type: '@@INIT' });
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...initialState,
      config: { ...initialState.config, type }
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat();
    },
    enhancers: (existingEnhancers) => {
      // Add the autobatch enhancer to the store setup
      return existingEnhancers.concat(autoBatchEnhancer({ type: 'tick' }));
    }
  });
};

export const store = createPlayerStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<RootState>();

export default store;
