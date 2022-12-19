import React, { CSSProperties, MouseEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useSwipeable } from 'react-swipeable';
import { useAppSelector } from '../store/createStore';
import { useMediaControls } from '../hooks';
import './seekbar.scss';

export const SeekBar = () => {
  const currentTime = useAppSelector(state => state.media.currentTime)!;
  const duration = useAppSelector(state => state.media.duration)!;
  const seeking = useAppSelector(state => state.media.seeking);
  const buffered = useAppSelector(state => state.media.buffered);
  const { seek } = useMediaControls();
  const [ isSeeking, setIsSeeking ] = useState(false);
  const [ seekingPos, setSeekingPos ] = useState(0);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [ seekBarWidth, setSeekBarWidth ] = useState(seekBarRef.current?.clientWidth || 0);

  useEffect(() => {
    if (!seekBarRef.current) return;

    const observer = new ResizeObserver(() => {
      setSeekBarWidth(seekBarRef.current?.clientWidth || 0);
    });

    observer.observe(seekBarRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const videoPositionPercentage = (currentTime / duration) || 0;
  const seekBarPositionPercentage = seekBarWidth * videoPositionPercentage;

  const handlers = useSwipeable({
    delta: 0,
    preventScrollOnSwipe: true,
    onSwipeStart: (e) => {
      if (!seekBarRef.current) return;

      const { event } = e;
      const seekBarPosition = seekBarRef.current.getBoundingClientRect();
      const seekBarPositionPercentage = (
        (event as TouchEvent).touches[ 0 ].clientX - seekBarPosition.left
      ) / seekBarPosition.width;
      const seekBarPositionPercentageInSeconds = seekBarPositionPercentage * duration;

      setIsSeeking(true);
      setSeekingPos(Math.max(0, Math.min(seekBarPositionPercentage, 1)));
      seek(Math.max(0, Math.min(seekBarPositionPercentageInSeconds, duration)));
    },
    onSwiping: (e) => {
      if (!seekBarRef.current) return;

      const { event } = e;
      const seekBarPosition = seekBarRef.current.getBoundingClientRect();
      const seekBarPositionPercentage = (
        (event as TouchEvent).touches[ 0 ].clientX - seekBarPosition.left
      ) / seekBarPosition.width;
      const seekBarPositionPercentageInSeconds = seekBarPositionPercentage * duration;

      setSeekingPos(Math.max(0, Math.min(seekBarPositionPercentage, 1)));
      seek(Math.max(0, Math.min(seekBarPositionPercentageInSeconds, duration)));
    }
  });

  const clickHandler: MouseEventHandler = (e) => {
    if (!seekBarRef.current) return;

    const seekBar = seekBarRef.current;
    const seekBarPosition = seekBar.getBoundingClientRect();
    const seekBarPositionPercentage = (e.clientX - seekBarPosition.left) / seekBarPosition.width;
    const seekBarPositionPercentageInSeconds = seekBarPositionPercentage * duration;

    seek(seekBarPositionPercentageInSeconds);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const seekPos = (e: MouseEvent) => {
      if (!seekBarRef.current) return;

      const seekBarPosition = seekBarRef.current.getBoundingClientRect();
      const seekBarPositionPercentage = (e.clientX - seekBarPosition.left) / seekBarPosition.width;
      const seekBarPositionPercentageInSeconds = seekBarPositionPercentage * duration;

      setSeekingPos(Math.max(0, Math.min(seekBarPositionPercentage, 1)));
      seek(Math.max(0, Math.min(seekBarPositionPercentageInSeconds, duration)));
    };

    const startSeeking = (e: MouseEvent) => {
      if (e.target === seekBarRef.current || seekBarRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        setIsSeeking(true);

        seekPos(e);
      }
    };

    const stopSeeking = (e: MouseEvent) => {
      if (!isSeeking) return;
      e.preventDefault();
      setIsSeeking(false);

      seekPos(e);
    };

    const seeking = (e: MouseEvent) => {
      if (!isSeeking) return;
      e.preventDefault();

      seekPos(e);
    };

    document.addEventListener('mousedown', startSeeking, { signal });
    document.addEventListener('mouseup', stopSeeking, { signal });
    document.addEventListener('mousemove', seeking, { signal });

    return () => {
      abortController.abort();
    };
  }, [ duration, isSeeking, seek ]);

  const progressWidth = isSeeking ? seekingPos : videoPositionPercentage;
  const progressThumbPosition = isSeeking ? seekingPos * seekBarWidth : seekBarPositionPercentage;

  return (
    <div
      {...handlers}
      className={classNames('ne-player-seek-bar', {
        'ne-player-seek-bar--seeking': isSeeking || seeking
      })}
      ref={(el) => {
        if (!el) return;

        handlers.ref(el);
        (seekBarRef as MutableRefObject<HTMLDivElement>).current = el;
      }}
      onClick={clickHandler}
    >
      <div className='ne-player-seek-bar-buffered'>
        {
          (buffered || []).map((range, index) => {
            const start = range[ 0 ];
            const end = range[ 1 ];
            const width = (end - start) / duration * 100;

            return (
              <div
                key={index}
                className='ne-player-seek-bar-buffered-range'
                style={{
                  '--left': `${start / duration * 100}%`,
                  '--width': `${width}%`
                } as CSSProperties}
              ></div>
            );
          })
        }
      </div>
      <div className='ne-player-seek-bar-timeline'></div>
      <div
        className='ne-player-seek-bar-progress'
        style={{ '--width': progressWidth } as CSSProperties}
      />
      <div
        className='ne-player-seek-bar-thumb'
        style={{ '--left': `${progressThumbPosition}px` } as CSSProperties}
      />
    </div>
  );
};
