import { RefObject, createContext } from 'react';

export type VideoDimensions = { width: number; height: number } | null;

export type BufferedChunks = [number, number][];

export interface PlayerContextType {
  mediaElement: RefObject<HTMLVideoElement | HTMLAudioElement>;
  playerElement: RefObject<HTMLDivElement>;
  videoAspectRatio?: {
    force?: boolean;
    width: number;
    height: number;
  };
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = PlayerContext.Provider;
export const PlayerConsumer = PlayerContext.Consumer;
