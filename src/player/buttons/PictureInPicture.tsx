import React from 'react';
import classNames from 'classnames';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import PictureInPictureRounded from '@mui/icons-material/PictureInPictureRounded';
import { ButtonProps } from './types';
import './buttons.scss';

export const PictureInPictureButton = ({ size = 'medium', showLabel, labelPosition = 'bottom' }: ButtonProps) => {
  const { mediaElement, canPlay } = useVideoPlayer();

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-pip'
  );

  const btn = (
    <div className="ne-player-button-icon">
      <PictureInPictureRounded />
    </div>
  );

  const label = (
    <div className={classNames('ne-player-button-label', 'ne-player-button-label-' + labelPosition)}>
      Picture in picture
    </div>
  );

  return canPlay && (
    <button className={classes} onClick={() => {
      if (mediaElement.current instanceof HTMLVideoElement) {
        mediaElement.current.requestPictureInPicture();
      }
    }}>
      {btn}
      {showLabel && label}
    </button>
  );
};
