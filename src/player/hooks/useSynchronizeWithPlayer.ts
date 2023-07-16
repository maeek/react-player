import { RefObject, useDebugValue, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store/createStore';
import { setPlaybackQuality } from '../store/slices/video';
import { setIsOffline } from '../store/slices/config';

const usePlaybackRate = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  const playbackRate = useAppSelector(state => state.media.playbackRate, shallowEqual);

  useEffect(() => {
    if (!mediaRef.current || !playbackRate) return;

    mediaRef.current.playbackRate = playbackRate;
  }, [ mediaRef, playbackRate ]);
};

const useVolume = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  const volume = useAppSelector(state => state.volume.volume, shallowEqual);

  useEffect(() => {
    if (!mediaRef.current || volume === undefined || volume === null) return;

    mediaRef.current.volume = volume;
  }, [ mediaRef, volume ]);
};

const useAutoPlay = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  const autoplay = useAppSelector(state => state.media.autoPlay, shallowEqual);

  useEffect(() => {
    if (!mediaRef.current || !autoplay) return;

    mediaRef.current.autoplay = autoplay;
  }, [ mediaRef, autoplay ]);
};

const usePreload = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  const preload = useAppSelector(state => state.media.preload, shallowEqual);

  useEffect(() => {
    if (!mediaRef.current || !preload) return;

    mediaRef.current.preload = preload;
  }, [ mediaRef, preload ]);
};

const useUpdatePlaybackQuality = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  const dispatch = useAppDispatch();
  const currentTime = useAppSelector(state => state.media.currentTime);

  useEffect(() => {
    const mediaElement = mediaRef.current;

    if (mediaElement instanceof HTMLVideoElement) {
      const quality = mediaElement.getVideoPlaybackQuality();
      dispatch(setPlaybackQuality({
        droppedVideoFrames: quality.droppedVideoFrames,
        totalVideoFrames: quality.totalVideoFrames,
        corruptedVideoFrames: quality.corruptedVideoFrames,
        creationTime: quality.creationTime
      }));
    }

  }, [ mediaRef, currentTime, dispatch ]);
};

const useIsOffline = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener('offline', () => {
      dispatch(setIsOffline(true));
    });
    window.addEventListener('online', () => {
      dispatch(setIsOffline(false));
    });
  }, [ dispatch ]);
};

export const useSynchronizeWithPlayer = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  usePlaybackRate(mediaRef);
  useVolume(mediaRef);
  useAutoPlay(mediaRef);
  usePreload(mediaRef);
  useUpdatePlaybackQuality(mediaRef);
  useIsOffline();

  useDebugValue('useSynchronizeWithPlayer');
};
