import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

export const useVideoPlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('useVideoPlayer must be used within a PlayerContext');
  }

  return context;
};
