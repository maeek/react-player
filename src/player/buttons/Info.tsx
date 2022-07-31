import React from 'react';
import classNames from 'classnames';
// import { useVideoPlayer } from '../hooks/useVideoPlayer';
import InfoRounded from '@mui/icons-material/InfoRounded';
import { ButtonProps } from './types';
import './buttons.scss';

export const InfoButton = ({ size = 'medium', showLabel, labelPosition = 'bottom' }: ButtonProps) => {
  // const { videoPlaybackQuality } = useVideoPlayer();

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-info'
  );

  const btn = (
    <div className="ne-player-button-icon">
      <InfoRounded />
    </div>
  );

  const label = (
    <div className={classNames('ne-player-button-label', 'ne-player-button-label-' + labelPosition)}>
      Info
    </div>
  );

  return (
    <button className={classes} onClick={() => {}}>
      {btn}
      {showLabel && label}
    </button>
  );
};
