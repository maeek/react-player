import { createSlice, PayloadAction, prepareAutoBatched } from '@reduxjs/toolkit';

export interface Quality {
  url: string;
  quality: string;
  isPlaying?: boolean;
}

export interface ConfigState {
  url: string | null;
  qualities: Quality[];
  type?: 'video' | 'audio';
  keyboardShortcuts: boolean | undefined;
  fullscreen: boolean;
  offlinePlay: boolean;
  isOffline: boolean;
  poster?: string;
  error: Event | null;
  controls?: boolean;
  controlsHidden: boolean;
  supressControlsFade: boolean;
  visible: boolean;
}

const initialState: ConfigState = {
  url: null,
  qualities: [],
  type: 'audio',
  keyboardShortcuts: false,
  fullscreen: false,
  offlinePlay: true,
  isOffline: window.navigator.onLine,
  error: null,
  poster: undefined,
  controls: undefined,
  controlsHidden: false,
  supressControlsFade: false,
  visible: false
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setUrl: (state, action: PayloadAction<ConfigState['url']>) => {
      state.url = action.payload;

      if (action.payload === null) {
        state.qualities.forEach(quality => (quality.isPlaying = false));
      } else {
        state.qualities = state.qualities.map(quality => ({
          ...quality,
          isPlaying: quality.url === action.payload
        }));
      }
    },
    setQualities: (state, action: PayloadAction<ConfigState['qualities']>) => {
      state.qualities = action.payload;
    },
    setType: (state, action: PayloadAction<ConfigState['type']>) => {
      state.type = action.payload;
    },
    setKeyboardShortcuts: (state, action: PayloadAction<ConfigState['keyboardShortcuts']>) => {
      state.keyboardShortcuts = action.payload;
    },
    setFullscreen: (state, action: PayloadAction<ConfigState['fullscreen']>) => {
      state.fullscreen = action.payload;
    },
    setError: (state, action: PayloadAction<ConfigState['error']>) => {
      state.error = action.payload;
    },
    setControlsHidden: {
      reducer: (state, action: PayloadAction<ConfigState['controlsHidden']>) => {
        state.controlsHidden = action.payload;
      },
      prepare: prepareAutoBatched<ConfigState['controlsHidden']>()
    },
    setVisible: {
      reducer: (state, action: PayloadAction<ConfigState['visible']>) => {
        state.visible = action.payload;
      },
      prepare: prepareAutoBatched<ConfigState['visible']>()
    },
    setControls: (state, action: PayloadAction<ConfigState['controls']>) => {
      state.controls = action.payload;
    },
    setPoster: (state, action: PayloadAction<ConfigState['poster']>) => {
      state.poster = action.payload;
    },
    setOfflinePlay: (state, action: PayloadAction<ConfigState['offlinePlay']>) => {
      state.offlinePlay = action.payload;
    },
    setIsOffline: (state, action: PayloadAction<ConfigState['isOffline']>) => {
      state.isOffline = action.payload;
    },
    setSupressControlsFade: (state, action: PayloadAction<ConfigState['supressControlsFade']>) => {
      state.supressControlsFade = action.payload;
    }
  }
});

export const {
  setUrl,
  setType,
  setKeyboardShortcuts,
  setFullscreen,
  setControlsHidden,
  setControls,
  setError,
  setVisible,
  setPoster,
  setOfflinePlay,
  setIsOffline,
  setQualities,
  setSupressControlsFade
} = configSlice.actions;
export default configSlice.reducer;
