import React from 'react';
import classNames from 'classnames';
import { PlayerPlay, PlayerPause } from 'tabler-icons-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useAppSelector } from '../../store/createStore';
import { useMediaControls, usePlayerControls } from '../../hooks';
import { Visualizer } from './Visualizer';
import '../renderer.scss';

export interface AudioRendererProps {
  interactive?: boolean;
  visualizations?: boolean;
}

export const AudioRenderer = ({ interactive, visualizations }: AudioRendererProps) => {
  const { mediaElement } = usePlayer();
  const { play } = useMediaControls();
  const { toggleFullscreen } = usePlayerControls();
  const playing = useAppSelector(state => state.media.playing);
  const preload = useAppSelector(state => state.media.preload);

  return mediaElement.current instanceof HTMLAudioElement ? (
    <div
      className={classNames(
        'ne-player-renderer',
        playing && 'ne-player-renderer--playing',
        'ne-player-renderer--audio'
      )}
      onClick={() => {
        if (interactive) {
          play();
        }
      }}
      onDoubleClick={(e) => {
        if (interactive) {
          e.preventDefault();
          e.stopPropagation();
          toggleFullscreen();
        }
      }}
    >
      { visualizations && <Visualizer />}
      <audio ref={mediaElement} crossOrigin={'anonymous'} preload={preload} />
      {
        interactive && (
          <div className="ne-player-renderer-controls">
            {
              playing
                ? <PlayerPlay className="ne-player-renderer-controls-icon" />
                : <PlayerPause className="ne-player-renderer-controls-icon" />
            }
          </div>
        )
      }
    </div>
  ) : <></>;
};
