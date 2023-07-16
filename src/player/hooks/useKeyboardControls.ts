import { useDebugValue, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store/createStore';
import { mute, stepDown, stepUp, unmute } from '../store/slices/volume';
import { useMediaControls, usePlayerControls } from './useControls';

const useSeekShortcuts = () => {
  const { seek } = useMediaControls();
  const currentTime = useAppSelector(state => state.media.currentTime, shallowEqual);
  const duration = useAppSelector(state => state.media.duration, shallowEqual);
  const isVisible = useAppSelector(state => state.config.visible, shallowEqual);
  const keyboardShortcuts = useAppSelector(state => state.config.keyboardShortcuts, shallowEqual);

  // Seeking
  useEffect(() => {
    if (!keyboardShortcuts || !isVisible) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const onKeyDown = (event: KeyboardEvent) => {
      if ([ 'ArrowRight', 'ArrowLeft' ].includes(event.key) && currentTime !== null && duration !== null) {
        event.preventDefault();
        seek(Math.max(0, Math.min(currentTime + (event.key === 'ArrowRight' ? 5 : -5), duration)));
      }
      if ([ 'j', 'l' ].includes(event.key) && currentTime !== null && duration !== null) {
        event.preventDefault();
        seek(Math.max(0, Math.min(currentTime + (event.key === 'l' ? 10 : -10), duration)));
      }
      if ([ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ].includes(event.key) && duration !== null) {
        event.preventDefault();
        seek((parseInt(event.key) / 10) * duration);
      }
      if ([ ',', '.' ].includes(event.key) && duration !== null && currentTime !== null) {
        event.preventDefault();
        seek(currentTime + (event.key === '.' ? 1 : -1) / 30);
      }
    };

    document.addEventListener('keydown', onKeyDown, { signal });

    return () => {
      abortController.abort();
    };
  }, [ currentTime, duration, isVisible, keyboardShortcuts, seek ]);
};

const useVolumeShortcuts = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector(state => state.config.visible, shallowEqual);
  const keyboardShortcuts = useAppSelector(state => state.config.keyboardShortcuts, shallowEqual);
  const volume = useAppSelector(state => state.volume.volume, shallowEqual);

  useEffect(() => {
    if (!keyboardShortcuts || !isVisible) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        if (volume === 0) {
          dispatch(unmute(null));
        } else {
          dispatch(mute(null));
        }
      }
      if ([ 'ArrowUp', 'ArrowDown' ].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'ArrowUp') {
          dispatch(stepUp(null));
        } else {
          dispatch(stepDown(null));
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, { signal });
    return () => {
      abortController.abort();
    };
  }, [ dispatch, isVisible, keyboardShortcuts, volume ]);
};

export const usePlayShortcuts = () => {
  const { play } = useMediaControls();
  const isVisible = useAppSelector(state => state.config.visible, shallowEqual);
  const keyboardShortcuts = useAppSelector(state => state.config.keyboardShortcuts, shallowEqual);

  // Playing
  useEffect(() => {
    if (!keyboardShortcuts || !isVisible) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key.toLowerCase() === 'k') {
        event.preventDefault();
        play();
      }
    };

    document.addEventListener('keydown', onKeyDown, { signal });

    return () => {
      abortController.abort();
    };
  }, [ isVisible, keyboardShortcuts, play ]);
};

export const useFullscreenShortcuts = () => {
  const { toggleFullscreen } = usePlayerControls();
  const isVisible = useAppSelector(state => state.config.visible, shallowEqual);
  const keyboardShortcuts = useAppSelector(state => state.config.keyboardShortcuts, shallowEqual);

  // Fullscreen
  useEffect(() => {
    if (!keyboardShortcuts || !isVisible) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', onKeyDown, { signal });

    return () => {
      abortController.abort();
    };
  }, [ isVisible, keyboardShortcuts, toggleFullscreen ]);
};

export const useKeyboardShortcuts = () => {
  useVolumeShortcuts();
  useSeekShortcuts();
  usePlayShortcuts();
  useFullscreenShortcuts();
  useDebugValue('useKeyboardShortcuts');
};
