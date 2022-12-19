import { RefObject, useDebugValue, useEffect } from 'react';
import { useAppDispatch } from '../store/createStore';
import { setVisible } from '../store/slices/config';

export const useVisibility = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  const dispatch = useAppDispatch();

  useDebugValue('useVisibility');

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[ 0 ].isIntersecting) {
          dispatch(setVisible(true));
        } else {
          dispatch(setVisible(false));
        }
      }
    );

    intersectionObserver.observe(mediaRef.current!);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [ dispatch, mediaRef ]);
};
