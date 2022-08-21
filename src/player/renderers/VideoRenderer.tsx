import React, { CSSProperties, RefObject } from 'react';
import classNames from 'classnames';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import './renderer.scss';

export interface VideoRendererProps {
  interactive?: boolean;
}

export const VideoRenderer = ({ interactive, ...rest }: VideoRendererProps) => {
  const {
    mediaElement,
    mediaProps,
    videoAspectRatio,
    dimensions,
    playing,
    play,
    toggleFullscreen
  } = useVideoPlayer();

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
        playing && 'ne-player-renderer--playing'
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
      <video ref={mediaElement as RefObject<HTMLVideoElement>} {...mediaProps} {...rest}>
        Your browser does not support the video tag.
      </video>
      {
        interactive && (
          <div className="ne-player-renderer-controls">
            {
              playing
                ? <PlayArrowRounded className="ne-player-renderer-controls-icon" />
                : <PauseRounded className="ne-player-renderer-controls-icon" />
            }
          </div>
        )
      }
    </div>
  ) : <></>;
};
