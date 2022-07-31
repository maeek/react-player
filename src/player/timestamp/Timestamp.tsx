import React, { useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import './timestamp.scss';

dayjs.extend(durationPlugin);

export interface TimestampProps {
  format?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Timestamp = (props: TimestampProps) => {
  const { format = 'H:m:ss', className, style } = props;
  const { currentTime, duration } = useVideoPlayer();

  const timestamp = dayjs.duration(currentTime * 1000).format(format).replace(/^(0:){1}/, '');
  const durationTime = useMemo(
    () => dayjs.duration(duration * 1000).format(format).replace(/^(0:){1}/, ''),
    [ duration, format ]
  );

  return (
    <div className={classNames('ne-player-timestamp', className)} style={style}>
      <span className='ne-player-timestamp-time'>{timestamp}</span>
      <span className='ne-player-timestamp-divider'>/</span>
      <span className='ne-player-timestamp-time'>{durationTime}</span>
    </div>
  );
};
