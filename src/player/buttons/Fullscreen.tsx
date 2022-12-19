import React from 'react';
import classNames from 'classnames';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { WindowMaximize, WindowMinimize } from 'tabler-icons-react';
import { ButtonProps } from './types';
import './buttons.scss';

export const FullscreenButton = ({ size = 'medium' }: ButtonProps) => {
  const { toggleFullscreen, isFullscreen } = useVideoPlayer();

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-pnp'
  );

  const btn = (
    <div className="ne-player-button-icon">
      {
        isFullscreen
          ? <WindowMinimize />
          : <WindowMaximize />
      }
    </div>
  );

  return (
    <button className={classes} onClick={() => {
      toggleFullscreen();
    }}>
      {btn}
    </button>
  );
};
