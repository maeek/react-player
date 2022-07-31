import { RefObject, createContext, Dispatch } from 'react';

export type VideoDimensions = { width: number; height: number } | null;

export type BufferedChunks = [number, number][];

export interface PlayerContextType {
  url: string;
  duration: number;
  currentTime: number;
  buffered: BufferedChunks | null;
  playing: boolean;
  stalled: boolean;
  seeking: boolean;
  isVisible: boolean;
  isAborted: boolean;
  error?: Event;
  canPlay?: boolean;
  hasEnded?: boolean;
  playbackRate: number;
  play: (state?: boolean) => void;
  setUrl: (url: string) => void;
  reset: () => void;
  seek: (time: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  toggleFullscreen: () => void;
  mediaElement: RefObject<HTMLVideoElement | HTMLAudioElement>;
  playerElement: RefObject<HTMLDivElement>;
  dimensions?: VideoDimensions;
  isFullscreen?: boolean;
  controlsHidden: boolean;
  hideControls: Dispatch<boolean>;
  videoAspectRatio?: {
    force?: boolean;
    width: number;
    height: number;
  };
  videoPlaybackQuality?: VideoPlaybackQuality;
  mediaProps?: {
    poster?: string;
    autoPlay?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    controls?: boolean;
  };
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = PlayerContext.Provider;
export const PlayerConsumer = PlayerContext.Consumer;
