import React from 'react';
import classNames from 'classnames';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeMuteRounded from '@mui/icons-material/VolumeMuteRounded';
import { ButtonProps } from './types';
import './buttons.scss';
import './volume-button.scss';

export const VolumeButton = ({ size = 'medium' }: ButtonProps) => {
  const { volume, setVolume } = useVideoPlayer();

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-volume',
    `ne-player-button-volume--${volume > 0 ? 'high' : 'low'}`
  );

  const btn = (
    <div className="ne-player-button-icon">
      {
        volume > 0 && volume <= 0.2 && (
          <VolumeMuteRounded />
        )
      }
      {
        volume > 0.2 && volume < 0.6 && (
          <VolumeDownRounded />
        )
      }
      {
        volume >= 0.6 && (
          <VolumeUpRounded />
        )
      }
      {
        volume === 0 && (
          <VolumeOffRounded />
        )
      }
    </div>
  );

  return (
    <button className={classes} onClick={() => {
      setVolume(volume === 0 ? 1 : 0);
    }}>
      {btn}
      <div
        className="ne-player-button-volume-slider"
        onClick={(e) => e.stopPropagation()}
      ></div>
    </button>
  );
};
