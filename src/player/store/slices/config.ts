import { createSlice, PayloadAction, prepareAutoBatched } from '@reduxjs/toolkit';

export interface ConfigState {
  url: string | null;
  type?: 'video' | 'audio';
  keyboardShortcuts: boolean | undefined;
  fullscreen: boolean;
  poster?: string;
  error: Event | null;
  controls?: boolean;
  controlsHidden: boolean;
  visible: boolean;
}

const initialState: ConfigState = {
  url: null,
  type: 'audio',
  keyboardShortcuts: false,
  fullscreen: false,
  error: null,
  poster: undefined,
  controls: undefined,
  controlsHidden: false,
  visible: false
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setUrl: (state, action: PayloadAction<ConfigState['url']>) => {
      state.url = action.payload;
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
  setPoster
} = configSlice.actions;
export default configSlice.reducer;
