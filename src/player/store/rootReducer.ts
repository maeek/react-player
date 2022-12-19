import { combineReducers } from '@reduxjs/toolkit';
import videoSlice from './slices/video';
import mediaSlice from './slices/media';
import configSlice from './slices/config';
import volumeSlice from './slices/volume';

export const rootReducer = combineReducers({
  video: videoSlice,
  media: mediaSlice,
  config: configSlice,
  volume: volumeSlice
});
