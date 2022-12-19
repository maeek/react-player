import { useContext, useDebugValue } from 'react';
import { PlayerContext } from '../context/PlayerContext';

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  useDebugValue('usePlayer');

  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerContext');
  }

  return context;
};
