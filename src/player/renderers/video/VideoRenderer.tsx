import React, { CSSProperties, RefObject } from 'react';
import classNames from 'classnames';
import { PlayerPlay, PlayerPause } from 'tabler-icons-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useAppSelector } from '../../store/createStore';
import { useMediaControls, usePlayerControls } from '../../hooks';
import '../renderer.scss';

export interface VideoRendererProps {
  interactive?: boolean;
}

export const VideoRenderer = ({ interactive, ...rest }: VideoRendererProps) => {
  const {
    mediaElement,
    videoAspectRatio
  } = usePlayer();
  const { play } = useMediaControls();
  const { toggleFullscreen } = usePlayerControls();
  const dimensions = useAppSelector(state => state.video.dimensions);
  const playing = useAppSelector(state => state.media.playing);
  const autoPlay = useAppSelector(state => state.media.autoPlay);
  const preload = useAppSelector(state => state.media.preload);

  const style = videoAspectRatio || dimensions
    ? {
      '--renderer-width': videoAspectRatio?.force
        ? videoAspectRatio?.width ?? dimensions?.width
        : dimensions?.width ?? videoAspectRatio?.width,
      '--renderer-height': videoAspectRatio?.force
        ? videoAspectRatio?.height ?? dimensions?.height
        : dimensions?.height ?? videoAspectRatio?.height
    } as CSSProperties
    : undefined;

  return mediaElement.current instanceof HTMLVideoElement ? (
    <div
      className={classNames(
        'ne-player-renderer',
        videoAspectRatio && 'ne-player-renderer--aspect-ratio',
        playing && 'ne-player-renderer--playing',
        'ne-player-renderer--video'
      )}
      style={style}
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
      <video ref={mediaElement as RefObject<HTMLVideoElement>} autoPlay={autoPlay} preload={preload} {...rest}>
        Your browser does not support the video tag.
      </video>
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
