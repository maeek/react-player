import { listenToEvent } from '../../utils/eventUtil';
import { useCallback, useDebugValue, useEffect } from 'react';
import { BufferedChunks } from '../context';
import { useAppDispatch, useAppSelector } from '../store/createStore';
import { setError, setFullscreen } from '../store/slices/config';
import {
  setEnded,
  setCurrentTime,
  setDuration,
  setCanPlay,
  setPlaying,
  setBuffered,
  setStalled,
  setAborted,
  setSeeking
} from '../store/slices/media';
import { setDimensions } from '../store/slices/video';
import { usePlayer } from './usePlayer';

interface UseLifecycleEventHandlers {
  onLoadedData?:  (...args: unknown[]) => void;
  onLoadedMetadata?: (...args: unknown[]) => void;
  onTimeUpdate?: (...args: unknown[]) => void;
  onCanPlay?: (...args: unknown[]) => void;
  onEnd?: (...args: unknown[]) => void;
  onError?: (...args: unknown[]) => void;
  onProgress?: (buffered: number, ...args: unknown[]) => void;
  onPlay?: (...args: unknown[]) => void;
  onPause?: (...args: unknown[]) => void;
  onVolumeChange?: (volume: number, ...args: unknown[]) => void;
  onFullscreenChange?: (fullscreen: boolean, ...args: unknown[]) => void;
}

export const useLifecycle = ({
  onEnd,
  onCanPlay,
  onError,
  onFullscreenChange,
  onLoadedData,
  onLoadedMetadata,
  onPause,
  onPlay,
  onProgress,
  onTimeUpdate,
  onVolumeChange
}: UseLifecycleEventHandlers) => {
  const dispatch = useAppDispatch();
  const { mediaElement: mediaRef, playerElement: playerRef } = usePlayer();
  const url = useAppSelector(state => state.config.url);

  useDebugValue('useLifecycle');

  const onEndCallback = useCallback((...args: unknown[]) => {
    dispatch(setEnded(true));
    onEnd?.(...args);
  }, [ dispatch, onEnd ] );

  const onTimeUpdateCallback = useCallback((...args: unknown[]) => {
    dispatch(setCurrentTime(mediaRef.current!.currentTime));
    onTimeUpdate?.(...args);
  }, [ dispatch, mediaRef, onTimeUpdate ]);

  /**
   * Lifecycle events
   */
  useEffect(() => {
    const mediaElement = mediaRef.current!;
    const playerElement = playerRef.current!;
    const abortController = new AbortController();
    const signal = abortController.signal;

    listenToEvent(mediaElement, 'loadedmetadata', (...args: unknown[]) => {
      dispatch(setDuration(mediaElement.duration));

      if (mediaElement instanceof HTMLVideoElement) {
        dispatch(setDimensions({
          width: mediaElement.videoWidth,
          height: mediaElement.videoHeight
        }));
      }

      dispatch(setCurrentTime(mediaElement.currentTime));
      onLoadedMetadata?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'loadeddata', (...args: unknown[]) => {
      onLoadedData?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'canplay', (...args: unknown[]) => {
      dispatch(setCanPlay(true));
      onCanPlay?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'ended', (...args: unknown[]) => {
      dispatch(setPlaying(false));
      onEndCallback?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'error', (...args: unknown[]) => {
      dispatch(setError(args[ 0 ] as Event));
      onError?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'timeupdate', (...args: unknown[]) => {
      onTimeUpdateCallback?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'progress', (...args: unknown[]) => {
      const result: BufferedChunks = [];

      for (let i = 0; i < mediaElement.buffered.length; i++) {
        result.push([ mediaElement.buffered.start(i), mediaElement.buffered.end(i) ]);
      }

      dispatch(setBuffered(result));

      if (mediaElement.buffered.length > 0) {
        onProgress?.((mediaElement.buffered.end(0) / mediaElement.duration) * 100, ...args);
      }
    }, { signal });

    listenToEvent(mediaElement, 'play', (...args: unknown[]) => {
      dispatch(setPlaying(true));
      onPlay?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'pause', (...args: unknown[]) => {
      dispatch(setPlaying(false));
      onPause?.(...args);
    }, { signal });

    listenToEvent(mediaElement, 'playing', () => {
      dispatch(setStalled(false));
      dispatch(setAborted(false));
    }, { signal });

    listenToEvent(mediaElement, 'stalled', () => {
      dispatch(setStalled(true));
    }, { signal });

    listenToEvent(playerElement, 'fullscreenchange', (...args: unknown[]) => {
      const newState = !!document.fullscreenElement;
      dispatch(setFullscreen(newState));
      onFullscreenChange?.(newState, ...args);
    }, { signal });

    listenToEvent(mediaElement, 'volumechange', (...args: unknown[]) => {
      onVolumeChange?.(mediaElement.volume, ...args);
    }, { signal });

    listenToEvent(mediaElement, 'durationchange', () => {
      dispatch(setDuration(mediaElement.duration));
    }, { signal });

    listenToEvent(mediaElement, 'seeking', () => {
      dispatch(setSeeking(true));
    }, { signal });

    listenToEvent(mediaElement, 'seeked', () => {
      dispatch(setSeeking(false));
    }, { signal });

    if (mediaElement instanceof HTMLVideoElement) {
      listenToEvent(mediaElement, 'resize', () => {
        dispatch(setDimensions({
          width: (mediaElement as HTMLVideoElement).videoWidth,
          height: (mediaElement as HTMLVideoElement).videoHeight
        }));
      }, { signal });
    }

    listenToEvent(mediaElement, 'abort', (...args: unknown[]) => {
      onError?.(...args);
      dispatch(setAborted(true));
    }, { signal });

    if (url) mediaElement.src = url;

    return () => {
      abortController.abort();
    };
  }, [
    url,
    onEndCallback,
    onTimeUpdateCallback,
    onProgress,
    onPlay,
    onPause,
    onError,
    onVolumeChange,
    onCanPlay,
    onFullscreenChange,
    onLoadedMetadata,
    onLoadedData,
    dispatch,
    mediaRef,
    playerRef
  ]);
};
