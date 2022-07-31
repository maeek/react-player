import { useVideoPlayer } from './useVideoPlayer';

export const useStats = () => {
  const {
    currentTime,
    duration,
    dimensions,
    buffered,
    isAborted,
    playing,
    playbackRate,
    volume,
    videoAspectRatio,
    hasEnded,
    url,
    canPlay
  } = useVideoPlayer();

  return {
    currentTime,
    duration,
    dimensions,
    buffered,
    isAborted,
    playing,
    playbackRate,
    volume,
    videoAspectRatio,
    hasEnded,
    url,
    canPlay
  };
};
