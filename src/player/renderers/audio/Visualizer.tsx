import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { usePlayer } from '../../hooks';
import { useAppSelector } from '../../store/createStore';
import './visualizer.scss';

export const Visualizer = () => {
  const { mediaElement } = usePlayer();
  const playing = useAppSelector(state => state.media.playing);
  const poster = useAppSelector(state => state.config.poster);
  const [ source, setSource ] = useState<any>(null);
  const [ analyser, setAnalyser ] = useState<any>(null);
  const [ sample, setSample ] = useState<number | null>(null);

  useEffect(() => {
    //@ts-expect-error
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    //declare source just once
    const src = ctx.createMediaElementSource(mediaElement.current!);
    setSource(src);

    //connect analyser to source
    const anl = ctx.createAnalyser();
    anl.fftSize = 1024;
    setAnalyser(anl);
    src.connect(anl);
    anl.connect(ctx.destination);
  }, [ mediaElement ]);

  useEffect(() => {
    if (!source) return;

    const abortController = new AbortController();
    const data = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      if (!abortController.signal.aborted && playing) requestAnimationFrame(loop);

      analyser.getByteFrequencyData(data);

      const rms = Math.sqrt(data.reduce((a, b) => a + b * b, 0) / data.length);
      setSample(
        30 + Math.ceil(rms) / 2.55
      );
    };

    requestAnimationFrame(loop);

    return () => {
      abortController.abort();
    };
  }, [ analyser, playing, source ]);

  return (
    <div
      className={classNames('ne-player-renderer-visualizer', {
        'ne-player-renderer-visualizer--no-poster': !poster
      })}
      style={{ opacity: sample === null ? 0 : `${Math.min(85, sample || 0)}%` }}
    >
      {
        poster && <img src={poster} />
      }
    </div>
  );
};
