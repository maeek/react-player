import { createSlice, PayloadAction, prepareAutoBatched } from '@reduxjs/toolkit';

export type BufferedChunks = [number, number][];

export interface VolumeState {
  lastVolume: number | null;
  volume: number | null;
}

const initialState: VolumeState = {
  lastVolume: null,
  volume: null
};

const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    setVolume: {
      reducer: (state, action: PayloadAction<VolumeState['volume']>) => {
        state.volume = action.payload;
        state.lastVolume = action.payload;
      },
      prepare: prepareAutoBatched<VolumeState['volume']>()
    },
    stepUp: {
      reducer: (state) => {
        const newVolume = Math.max(0, Math.min(1, state.volume! + 0.1));
        state.volume = newVolume;
        state.lastVolume = newVolume;
      },
      prepare: prepareAutoBatched<VolumeState['volume']>()
    },
    stepDown: {
      reducer: (state) => {
        const newVolume = Math.max(0, Math.min(1, state.volume! - 0.1));
        state.volume = newVolume;
        state.lastVolume = newVolume;
      },
      prepare: prepareAutoBatched<VolumeState['volume']>()
    },
    mute: {
      reducer: (state) => {
        state.lastVolume = state.volume;
        state.volume = 0;
      },
      prepare: prepareAutoBatched<VolumeState['volume']>()
    },
    unmute: {
      reducer: (state) => {
        state.volume = state.lastVolume;
      },
      prepare: prepareAutoBatched<VolumeState['volume']>()
    }
  }
});

export const { setVolume, mute, stepDown, stepUp, unmute } = volumeSlice.actions;
export default volumeSlice.reducer;
