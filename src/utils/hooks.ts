import { debounce, throttle } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';

import type { AnyFunction } from '@/sharedTypes';

export const useDebounce = (fn: AnyFunction, wait: number = 500) => {
  return useCallback(debounce(fn, wait), [wait]);
};

export const useThrottle = (fn: AnyFunction, wait: number = 500) => {
  return useCallback(throttle(fn, wait), [wait]);
};

export const useEventListener = (
  eventName: string,
  handler: (event: Event) => void,
  element: Element | Window = global.window
) => {
  const savedHandler = useRef<AnyFunction>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler
  // without us needing to pass it in effect deps array
  // and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element?.addEventListener;
      if (!isSupported) return () => {};

      // Create event listener that calls handler function stored in ref
      const eventListener = (event: Event) => savedHandler.current?.(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};

export const useWindowClose = (handler: (event: BeforeUnloadEvent) => void) => {
  useEventListener('beforeunload', handler);
};
