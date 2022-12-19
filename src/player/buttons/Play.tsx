import React from 'react';
import classNames from 'classnames';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { PlayerPause, PlayerPlay } from 'tabler-icons-react';
import { ButtonProps } from './types';
import './buttons.scss';

export const PlayButton = ({ size = 'medium' }: ButtonProps) => {
  const { playing, stalled, play } = useVideoPlayer();

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-play',
    playing && 'ne-player-button-play--playing',
    stalled && 'ne-player-button-play--stalled'
  );

  const btn = (
    <div className="ne-player-button-icon">
      {
        playing
          ? <PlayerPause />
          : <PlayerPlay />
      }
    </div>
  );

  return (
    <button className={classes} onClick={() => {
      if (stalled) return;

      play(!playing);
    }}>
      {btn}
    </button>
  );
};
