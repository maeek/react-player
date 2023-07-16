import { MutableRefObject, useEffect } from 'react';

export const useClickOutside = (
  handler: (e: Event) => void,
  ref: MutableRefObject<Element>
) => {
  useEffect(() => {
    const listener = (e: Event) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;

      handler(e);
    };

    const abortController = new AbortController();
    document.addEventListener('mousedown', listener, { signal: abortController.signal });
    document.addEventListener('touchstart', listener, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, [ ref, handler ]);
};
