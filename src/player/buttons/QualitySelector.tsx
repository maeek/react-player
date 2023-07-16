import React, { MutableRefObject, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/createStore';
import { usePlayer } from '../hooks/usePlayer';
import { Quality, setSupressControlsFade, setUrl } from '../store/slices/config';
import { setBuffered, setStalled } from '../store/slices/media';
import { Check, Settings } from 'tabler-icons-react';
import classNames from 'classnames';
import type { ButtonProps } from './types';
import './buttons.scss';
import './quality-selector.scss';
import { useClickOutside } from '../../utils/useClickOutside';

export interface QualitySelectorProps {
 size?: Pick<ButtonProps, 'size'>
}

export const QualitySelector = ({ size = 'medium' }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [ isOpen, setIsOpen ] = useState(false);
  const qualities = useAppSelector(state => state.config.qualities);
  const currentQuality = qualities.find(q => q.isPlaying);
  const { mediaElement } = usePlayer();

  const onChange = (quality: Quality) => {
    if (!quality) return;

    setIsOpen(false);
    dispatch(setSupressControlsFade(false));
    dispatch(setStalled(true));
    const currentTime = mediaElement.current!.currentTime;
    const wasPlaying = !mediaElement.current!.paused;
    dispatch(setUrl(quality.url));
    dispatch(setBuffered([]));
    mediaElement.current!.src = quality.url;
    mediaElement.current!.currentTime = currentTime;

    const loaded = () => {
      if (wasPlaying) mediaElement.current!.play();
      mediaElement.current!.removeEventListener('loadedmetadata', loaded);
    };
    mediaElement.current!.addEventListener('loadedmetadata', loaded);
  };

  const classes = classNames(
    'ne-player-button',
    `ne-player-button--${size}`,
    'ne-player-button-quality'
  );

  const onSettingsClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    dispatch(setSupressControlsFade(newState));
  };

  useClickOutside(() => {
    dispatch(setSupressControlsFade(false));
    setIsOpen(false);
  }, ref as MutableRefObject<HTMLDivElement>);

  return (
    <div className="ne-player-quality-selector" ref={ref}>
      <button
        className={classes}
        onClick={onSettingsClick}
        tabIndex={0}
        type='button'
      >
        <div className="ne-player-button-icon">
          <Settings style={isOpen ? { transform: 'rotate(25deg)' } : undefined} />
        </div>
      </button>
      {
        isOpen && (
          <ul className='ne-player-quality-selector-list'>
            <li className='ne-player-quality-selector-list-header'>
              Quality
            </li>
            {
              qualities.map((quality) => (
                <li
                  className={classNames('ne-player-quality-selector-list-item', {
                    'ne-player-quality-selector-list-item--active': currentQuality?.quality === quality.quality
                      && currentQuality.isPlaying
                  })}
                  key={quality.url}
                  onClick={() => onChange(quality)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') onChange(quality);
                  }}
                  tabIndex={0}
                >
                  <span className='ne-player-quality-selector-list-item-icon'>
                    {
                      currentQuality?.quality === quality.quality && currentQuality.isPlaying && (
                        <Check />
                      )
                    }
                  </span>
                  <span>{quality.quality}</span>
                </li>
              ))
            }
          </ul>
        )
      }
    </div>
  );
};
