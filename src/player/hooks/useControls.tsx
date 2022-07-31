import { RefObject, useCallback } from 'react';

export const useControls = (
  mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>,
  playerRef: RefObject<HTMLDivElement>,
  updateFunc?: {
    setCurrentTime: (time: number) => void;
  }
) => {
  const play = useCallback((state?: boolean) => {
    if (!mediaRef.current) return;

    const isControlled = typeof state === 'boolean';

    if (isControlled) {
      if (state) {
        mediaRef.current.play();
      } else {
        mediaRef.current.pause();
      }
    } else {
      if (mediaRef.current.paused) {
        mediaRef.current.play();
      } else {
        mediaRef.current.pause();
      }
    }

  }, [ mediaRef ]);

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [ playerRef ]);

  const seek = useCallback((time: number) => {
    if (!mediaRef.current) return;

    mediaRef.current.currentTime = time;
    updateFunc?.setCurrentTime(time);
  }, [ mediaRef, updateFunc ]);

  return {
    play,
    toggleFullscreen,
    seek
  };
};
