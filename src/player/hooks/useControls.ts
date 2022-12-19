import { useCallback, useDebugValue } from 'react';
import { useAppDispatch } from '../store/createStore';
import { setCurrentTime } from '../store/slices/media';
import { usePlayer } from './usePlayer';

export const useMediaControls = () => {
  const { mediaElement } = usePlayer();
  const dispatch = useAppDispatch();

  useDebugValue('useMediaControls');

  const play = useCallback((state?: boolean) => {
    if (!mediaElement.current) return;

    const isControlled = typeof state === 'boolean';

    if (isControlled) {
      if (state) {
        mediaElement.current.play();
      } else {
        mediaElement.current.pause();
      }
    } else {
      if (mediaElement.current.paused) {
        mediaElement.current.play();
      } else {
        mediaElement.current.pause();
      }
    }

  }, [ mediaElement ]);

  const seek = useCallback((time: number) => {
    if (!mediaElement.current) return;

    mediaElement.current.currentTime = time;
    dispatch(setCurrentTime(time));
  }, [ mediaElement, dispatch ]);

  return {
    play,
    seek
  };
};

export const usePlayerControls = () => {
  const { playerElement } = usePlayer();

  useDebugValue('usePlayerControls');

  const toggleFullscreen = useCallback(() => {
    if (!playerElement.current) return;

    if (!document.fullscreenElement) {
      playerElement.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [ playerElement ]);

  return {
    toggleFullscreen
  };
};
