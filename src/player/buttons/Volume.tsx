import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { usePlayer } from '../hooks/usePlayer';
import { VolumeOff, Volume, Volume2, Volume3 } from 'tabler-icons-react';
import { ButtonProps } from './types';
import './buttons.scss';
import './volume-button.scss';
import throttle from 'lodash.throttle';
import { useAppDispatch, useAppSelector } from '../store/createStore';
import { mute, setVolume, unmute } from '../store/slices/volume';

export const VolumeButton = ({ size = 'medium' }: ButtonProps) => {
  const dispatch = useAppDispatch();
  const seekBarRef = useRef<HTMLDivElement>(null);
  const { mediaElement } = usePlayer();
  const volume = useAppSelector(state => state.volume.volume ?? 1);
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
      if (volume === 0) {
        dispatch(unmute(null));
      } else {
        dispatch(mute(null));
      }
      // dispatch(setVolume(positionOrVolume === 0 ? 1 : 0));
    }}>
      {
        positionOrVolume > 0 && positionOrVolume <= 0.2 && (
          <Volume3 />
        )
      }
      {
        positionOrVolume > 0.2 && positionOrVolume < 0.6 && (
          <Volume2 />
        )
      }
      {
        positionOrVolume >= 0.6 && (
          <Volume />
        )
      }
      {
        positionOrVolume === 0 && (
          <VolumeOff />
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
      dispatch(setVolume(position || 0));
      setPosition(null);
    };
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', calculateVolume);

    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', calculateVolume);
    };
  }, [ isMoving, calculateVolume, position, dispatch ]);

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
