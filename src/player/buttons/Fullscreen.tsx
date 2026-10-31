import React from 'react';
import classNames from 'classnames';
import { Maximize, Minimize } from 'tabler-icons-react';
import { ButtonProps } from './types';
import { usePlayerControls } from '../hooks';
import { useAppSelector } from '../store/createStore';
import './buttons.scss';

export const FullscreenButton = ({ size = 'medium' }: ButtonProps) => {
  const { toggleFullscreen } = usePlayerControls();
  const isFullscreen = useAppSelector(state => state.config.fullscreen);

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-pnp'
  );

  const btn = (
    <div className="ne-player-button-icon">
      {
        isFullscreen
          ? <Minimize />
          : <Maximize />
      }
    </div>
  );

  return (
    <button type='button' aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      className={classes} onClick={() => {
        toggleFullscreen();
      }}>
      {btn}
    </button>
  );
};
