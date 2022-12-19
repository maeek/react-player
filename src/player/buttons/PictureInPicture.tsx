import React from 'react';
import classNames from 'classnames';
import { usePlayer } from '../hooks/usePlayer';
import { PictureInPicture } from 'tabler-icons-react';
import { ButtonProps } from './types';
import { useAppSelector } from '../store/createStore';
import './buttons.scss';

export const PictureInPictureButton = ({ size = 'medium', showLabel, labelPosition = 'bottom' }: ButtonProps) => {
  const { mediaElement } = usePlayer();
  const canPlay = useAppSelector(state => state.media.canPlay);

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-pip'
  );

  const btn = (
    <div className="ne-player-button-icon">
      <PictureInPicture />
    </div>
  );

  const label = (
    <div className={classNames('ne-player-button-label', 'ne-player-button-label-' + labelPosition)}>
      Picture in picture
    </div>
  );

  return canPlay ? (
    <button className={classes} onClick={() => {
      if (mediaElement.current instanceof HTMLVideoElement) {
        mediaElement.current.requestPictureInPicture();
      }
    }}>
      {btn}
      {showLabel && label}
    </button>
  ) : <></>;
};
