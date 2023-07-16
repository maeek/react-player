import { createSlice, PayloadAction, prepareAutoBatched } from '@reduxjs/toolkit';

export type BufferedChunks = [number, number][];

export interface MediaState {
  duration: number | null;
  currentTime: number | null;
  canPlay: boolean;
  stalled: boolean | null;
  paused: boolean | null;
  playing: boolean | null;
  seeking: boolean | null;
  aborted: boolean | null;
  ended: boolean | null;
  playbackRate: number | null;
  buffered: BufferedChunks | null;
  preload: 'none' | 'metadata' | 'auto' | undefined;
  autoPlay: boolean | undefined;
}

const initialState: MediaState = {
  duration: null,
  currentTime: null,
  canPlay: false,
  stalled: null,
  paused: null,
  playing: null,
  seeking: null,
  aborted: null,
  ended: null,
  playbackRate: null,
  buffered: null,
  preload: 'none',
  autoPlay: false
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<MediaState['currentTime']>) => {
      state.currentTime = action.payload;
    },
    setDuration: {
      reducer: (state, action: PayloadAction<MediaState['duration']>) => {
        state.duration = action.payload;
      },
      prepare: prepareAutoBatched<MediaState['duration']>()
    },
    setCanPlay: (state, action: PayloadAction<MediaState['canPlay']>) => {
      state.canPlay = action.payload;
    },
    setStalled: (state, action: PayloadAction<MediaState['stalled']>) => {
      state.stalled = action.payload;
    },
    setPaused: {
      reducer: (state, action: PayloadAction<MediaState['paused']>) => {
        state.paused = action.payload;
      },
      prepare: prepareAutoBatched<MediaState['paused']>()
    },
    setPlaying: {
      reducer: (state, action: PayloadAction<MediaState['playing']>) => {
        state.playing = action.payload;
      },
      prepare: prepareAutoBatched<MediaState['playing']>()
    },
    setSeeking: {
      reducer: (state, action: PayloadAction<MediaState['seeking']>) => {
        state.seeking = action.payload;
      },
      prepare: prepareAutoBatched<MediaState['seeking']>()
    },
    setAborted: (state, action: PayloadAction<MediaState['aborted']>) => {
      state.aborted = action.payload;
    },
    setEnded: (state, action: PayloadAction<MediaState['ended']>) => {
      state.ended = action.payload;
    },
    setPlaybackRate: (state, action: PayloadAction<MediaState['playbackRate']>) => {
      state.playbackRate = action.payload;
    },
    setBuffered: {
      reducer: (state, action: PayloadAction<MediaState['buffered']>) => {
        state.buffered = action.payload;
      },
      prepare: prepareAutoBatched<MediaState['buffered']>()
    },
    setAutoPlay: (state, action: PayloadAction<MediaState['autoPlay']>) => {
      state.autoPlay = action.payload;
    },
    setPreload: (state, action: PayloadAction<MediaState['preload']>) => {
      state.preload = action.payload;
    }
  }
});

export const {
  setAborted,
  setBuffered,
  setCanPlay,
  setCurrentTime,
  setDuration,
  setEnded,
  setPaused,
  setPlaybackRate,
  setPlaying,
  setSeeking,
  setStalled,
  setAutoPlay,
  setPreload
} = mediaSlice.actions;
export default mediaSlice.reducer;
