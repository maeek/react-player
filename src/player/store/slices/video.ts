import { createSlice, PayloadAction, prepareAutoBatched } from '@reduxjs/toolkit';

export type VideoDimensions = { width: number; height: number } | null;

export interface VideoState {
  dimensions: VideoDimensions | undefined;
  playbackQuality: VideoPlaybackQuality | undefined;
}

const videoSlice = createSlice({
  name: 'video',
  initialState: {} as VideoState,
  reducers: {
    setDimensions: (state, action: PayloadAction<VideoDimensions>) => {
      state.dimensions = action.payload;
    },
    setPlaybackQuality: {
      reducer: (state, action: PayloadAction<VideoPlaybackQuality>) => {
        state.playbackQuality = action.payload;
      },
      prepare: prepareAutoBatched<VideoPlaybackQuality>()
    },
    resetVideo: (state) => {
      state.dimensions = undefined;
      state.playbackQuality = undefined;
    }
  }
});

export const { setDimensions, setPlaybackQuality, resetVideo } = videoSlice.actions;
export default videoSlice.reducer;
