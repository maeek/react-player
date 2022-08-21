import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeMuteRounded from '@mui/icons-material/VolumeMuteRounded';
import { ButtonProps } from './types';
import './buttons.scss';
import './volume-button.scss';
import throttle from 'lodash.throttle';

export const VolumeButton = ({ size = 'medium' }: ButtonProps) => {
  const seekBarRef = useRef<HTMLDivElement>(null);
  const { volume, setVolume, mediaElement } = useVideoPlayer();
  const [ isMoving, setIsMoving ] = useState(false);
  const [ position, setPosition ] = useState<number | null>(null);
  const setVolThrottled = useRef(throttle((pos) => {
    mediaElement.current!.volume = pos;
  }, 100, { leading: false, trailing: true }));

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-volume',
    `ne-player-button-volume--${volume > 0 ? 'high' : 'low'}`
  );

  const positionOrVolume = position ?? volume;
  const btn = (
    <div className="ne-player-button-icon" onClick={() => {
      setVolume(positionOrVolume === 0 ? 1 : 0);
    }}>
      {
        positionOrVolume > 0 && positionOrVolume <= 0.2 && (
          <VolumeMuteRounded />
        )
      }
      {
        positionOrVolume > 0.2 && positionOrVolume < 0.6 && (
          <VolumeDownRounded />
        )
      }
      {
        positionOrVolume >= 0.6 && (
          <VolumeUpRounded />
        )
      }
      {
        positionOrVolume === 0 && (
          <VolumeOffRounded />
        )
      }
    </div>
  );

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    calculateVolume(e as unknown as MouseEvent);
    setIsMoving(true);
  };

  const calculateVolume = useCallback((e: MouseEvent) => {
    const { clientX } = e;
    const { left, width } = seekBarRef.current!.getBoundingClientRect();
    const volume = (clientX - left) / width;
    const pos = Math.max(Math.min(+volume.toFixed(3), 1), 0);

    setPosition(pos);
    setVolThrottled.current(pos);
  }, []);

  useEffect(() => {
    if(!isMoving) return;

    const onMouseUp = () => {
      setIsMoving(false);
      setVolume(position || 0);
      setPosition(null);
    };
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', calculateVolume);

    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', calculateVolume);
    };
  }, [ isMoving, calculateVolume, setVolume, position ]);

  return (
    <button className={classes}>
      {btn}
      <div
        className="ne-player-button-volume-slider"
        onMouseDown={onMouseDown}
        ref={seekBarRef}
      >
        <div
          className='ne-player-button-volume-slider-thumb'
          style={{ '--volume': `${(position ?? volume) * 100}%` } as CSSProperties}
        />
      </div>
    </button>
  );
};
