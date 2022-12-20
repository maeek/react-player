import React, { useEffect, useMemo, useRef } from 'react';
import { PlayerContextType, PlayerProvider } from './context';
import { Provider } from 'react-redux';
import store, { useAppDispatch } from './store/createStore';
import { setAutoPlay, setPlaybackRate, setPreload } from './store/slices/media';
import { useLifecycle } from './hooks/useLifecycle';
import { useSynchronizeWithPlayer } from './hooks/useSynchronizeWithPlayer';
import { setControls, setKeyboardShortcuts, setPoster, setType, setUrl } from './store/slices/config';
import { useKeyboardShortcuts } from './hooks/useKeyboardControls';
import { useVisibility } from './hooks/useVisibility';
import { setVolume } from './store/slices/volume';
import { usePlayer } from './hooks';
import Logger from '../utils/logger';
import './player.scss';

export interface PlayerProps {
  children: React.ReactNode;
  url: string;
  tag?: 'video' | 'audio';
  autoPlay?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  controls?: boolean;
  poster?: string;
  volume?: number;
  playbackRate?: number;
  aspectRatio?: string;
  forceAspectRatio?: boolean;
  keyboardShortcuts?: boolean;
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
  getNodeElement?: (element: HTMLVideoElement | HTMLAudioElement) => void;
}

// eslint-disable-next-line react/display-name
const withPlayerStore = (Component: React.ComponentType<PlayerProps>) => (props: PlayerProps) => {
  const { aspectRatio, forceAspectRatio, tag } = props;
  const playerRef = useRef<HTMLDivElement>(document.createElement('div'));
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(document.createElement(tag || 'video'));

  /**
   * Derivative values
   */
  const videoAspectRatio = useMemo(() => {
    if (!aspectRatio) return undefined;

    const [ width, height ] = aspectRatio.split(/[:x]/);

    return (width ?? false) && (height ?? false) ? {
      force: forceAspectRatio,
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    } : undefined;
  }, [ aspectRatio, forceAspectRatio ]);

  const value: PlayerContextType = {
    mediaElement: mediaRef,
    playerElement: playerRef,
    videoAspectRatio
  };

  return (
    <Provider store={store}>
      <PlayerProvider value={value}>
        <Component {...props} />
      </PlayerProvider>
    </Provider>
  );
};

export const Player = withPlayerStore((props: PlayerProps) => {
  const {
    children,
    url,
    autoPlay = false,
    preload,
    controls,
    tag,
    poster,
    playbackRate,
    onLoadedMetadata,
    onTimeUpdate,
    onLoadedData,
    onEnd,
    onError,
    onProgress,
    onPlay,
    onPause,
    onVolumeChange,
    onCanPlay,
    onFullscreenChange,
    getNodeElement,
    volume: initialVolume = 1,
    keyboardShortcuts
  } = props;
  const { mediaElement: mediaRef, playerElement: playerRef } = usePlayer();
  const dispatch = useAppDispatch();

  useKeyboardShortcuts();
  useSynchronizeWithPlayer(mediaRef);
  useLifecycle({
    onLoadedMetadata,
    onTimeUpdate,
    onLoadedData,
    onEnd,
    onError,
    onProgress,
    onPlay,
    onPause,
    onVolumeChange,
    onCanPlay,
    onFullscreenChange
  });
  useVisibility(mediaRef);

  useEffect(() => {
    getNodeElement?.(mediaRef.current!);
  }, [ getNodeElement, mediaRef ]);

  // Update playback speed from props
  useEffect(() => {
    if (playbackRate === undefined) return;
    dispatch(setPlaybackRate(Math.max(0.25, Math.min(playbackRate, 15))));
  }, [ dispatch, playbackRate ]);

  // Update internal volume level from props
  useEffect(() => {
    if (initialVolume === undefined) return;
    const newVolume = Math.max(0, Math.min(1, initialVolume));

    if (newVolume !== initialVolume) Logger.warn('[@maeek/react-player] Volume must be between 0 and 1');

    dispatch(setVolume(newVolume));
  }, [ dispatch, initialVolume ]);

  // Update internal url from props
  useEffect(() => {
    dispatch(setUrl(url));
  }, [ dispatch, url ]);

  // Update internal autoplay from props
  useEffect(() => {
    dispatch(setAutoPlay(autoPlay));
  }, [ dispatch, autoPlay ]);

  // Update internal preload from props
  useEffect(() => {
    dispatch(setPreload(preload));
  }, [ dispatch, preload ]);

  // Update keyboard shortcuts from props
  useEffect(() => {
    dispatch(setKeyboardShortcuts(keyboardShortcuts));
  }, [ dispatch, keyboardShortcuts ]);

  // Update controls from props
  useEffect(() => {
    dispatch(setControls(controls));
  }, [ dispatch, controls ]);

  // Update type from props
  useEffect(() => {
    dispatch(setType(tag));
  }, [ dispatch, tag ]);

  // Update postertype from props
  useEffect(() => {
    dispatch(setPoster(poster));
  }, [ dispatch, poster ]);

  return (
    <div className="ne-player" ref={playerRef}>
      {children}
    </div>
  );
});
