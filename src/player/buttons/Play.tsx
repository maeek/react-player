import React from 'react';
import classNames from 'classnames';
import { PlayerPause, PlayerPlay } from 'tabler-icons-react';
import { ButtonProps } from './types';
import { useMediaControls } from '../hooks';
import { useAppSelector } from '../store/createStore';
import './buttons.scss';

export const PlayButton = ({ size = 'medium' }: ButtonProps) => {
  const { play } = useMediaControls();
  const playing = useAppSelector(state => state.media.playing);
  const stalled = useAppSelector(state => state.media.stalled);

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
