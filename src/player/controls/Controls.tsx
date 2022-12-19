import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { usePlayer } from '../hooks/usePlayer';
import { filterComponents } from '../../utils/filterComponents';
import { SeekBar } from '../seekbar';
import { useAppDispatch, useAppSelector } from '../store/createStore';
import { setControlsHidden } from '../store/slices/config';
import './controls.scss';

export interface Renderers {
  audio?: ReactNode;
  video?: ReactNode;
}

export interface ControlsProps {
  children?: ReactElement | ReactElement[];
  renderers?: Renderers;
  autohide?: boolean;
}

export const LeftControls = ({ children }: { children: ReactNode}) => (
  <>{children}</>
);
export const RightControls = ({ children }: { children: ReactNode}) => (
  <>{children}</>
);
export const HeaderLeft = ({ children }: { children: ReactNode}) => (
  <>{children}</>
);
export const HeaderRight = ({ children }: { children: ReactNode}) => (
  <>{children}</>
);

export const Controls = ({ children, renderers, autohide }: ControlsProps) => {
  const dispatch = useAppDispatch();
  const { playerElement } = usePlayer();
  const seeking = useAppSelector(state => state.media.seeking);
  const playing = useAppSelector(state => state.media.playing);
  const controlsHidden = useAppSelector(state => state.config.controlsHidden);
  const type = useAppSelector(state => state.config.type);
  const [ isHovering, setIsHovering ] = useState(false);
  const [ wasSeeking, setWasSeeking ] = useState(false);

  const hideTimeout = useRef(debounce(() => {
    dispatch(setControlsHidden(true));
    setIsHovering(false);
  }, 2500, { leading: false, trailing: true }));

  useEffect(() => {
    if (seeking) {
      setWasSeeking(true);
    }

    const timeout = setTimeout(() => {
      setWasSeeking(false);
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, [ seeking ]);

  const leftChildren = filterComponents(children, LeftControls);
  const rightChildren = filterComponents(children, RightControls);
  const seekBar = filterComponents(children, SeekBar);
  const headerLeft = filterComponents(children, HeaderLeft);
  const headerRight = filterComponents(children, HeaderRight);

  useEffect(() => {
    const element = playerElement.current;
    let debFunc: { cancel: () => void } | void;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const handleMouseMove = (e: MouseEvent) => {
      if (autohide && (e.target === element || element?.contains(e.target as Node))) {
        if (controlsHidden) dispatch(setControlsHidden(false));
        setIsHovering(true);
        debFunc = hideTimeout.current();
      } else {
        setIsHovering(false);
        debFunc?.cancel();
      }
    };

    const handleMouseStop = () => {
      if (autohide) {
        dispatch(setControlsHidden(true));
        setIsHovering(false);
        debFunc?.cancel();
      }
    };

    if (element) {
      element.addEventListener('mousemove', handleMouseMove, { signal });
      element.addEventListener('mouseleave', handleMouseStop, { signal });
    }

    return () => {
      abortController.abort();
      debFunc?.cancel();
    };
  }, [ autohide, controlsHidden, dispatch, playerElement ]);

  return (
    <div className={classNames('ne-player-controls', {
      'ne-player-controls--hidden': playing && autohide && controlsHidden && !isHovering && !wasSeeking,
      'ne-player-controls--seeking': seeking
    })}>
      {(headerLeft || headerRight) && (
        <div className={
          classNames(
            'ne-player-controls-header', {
              'ne-player-controls-header--audio': type === 'audio'
            }
          )
        }>
          <div className="ne-player-controls-header-content">
            {headerLeft}
          </div>
          <div className='ne-player-controls-header-actions'>
            {headerRight}
          </div>
        </div>
      )}
      {renderers && renderers[ type! ] && (
        <div className='ne-player-controls-renderer'>
          {renderers[ type! ]}
        </div>
      )}
      <div className="ne-player-controls-content-mask"></div>
      <div className={
        classNames(
          'ne-player-controls-content', {
            'ne-player-controls-content--audio': type === 'audio'
          }
        )
      }>
        {seekBar}
        <div className="ne-player-controls-content-wrapper">
          <div
            className="ne-player-controls-content-elements ne-player-controls-content-elements--left"
          >
            {leftChildren}
          </div>
          <div
            className="ne-player-controls-content-elements ne-player-controls-content-elements--right"
          >
            {rightChildren}
          </div>
        </div>
      </div>
    </div>
  );
};
