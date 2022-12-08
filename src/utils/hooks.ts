import { debounce, throttle } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { AnyFunction } from '@/sharedTypes';

export const useDebounce = (fn: AnyFunction, wait: number = 500) => {
  return useCallback(debounce(fn, wait), [wait]);
};

export const useThrottle = (fn: AnyFunction, wait: number = 500) => {
  return useCallback(throttle(fn, wait), [wait]);
};

export const useEventListener = <T extends Event>(
  eventName: string,
  handler: (event: T) => void,
  shouldListen: boolean = true,
  element: Element | Document | null = global.document
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
      if (shouldListen) element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element, shouldListen] // Re-run if eventName or element changes
  );
};

export const useEventListener2 = <T extends Event>(
  eventName: string,
  handler: (event: T | Event) => void,
  shouldListen: boolean = true,
  element: Element | Document | null = global.document
) => {
  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element?.addEventListener;
      if (!isSupported) return () => {};

      // Create event listener that calls handler function stored in ref
      const eventListener = (event: Event) => handler(event);

      // Add event listener
      if (shouldListen) element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, handler, element, shouldListen] // Re-run if eventName or element changes
  );
};

export const useWindowClose = (handler: (event: BeforeUnloadEvent) => void) => {
  useEventListener('beforeunload', handler);
};

export const useStateWithCallback = <T>(
  initialState: T
): [
  state: T,
  setState: (
    updatedState: React.SetStateAction<T>,
    callback?: (updatedState: T) => void
  ) => void
] => {
  const [state, setState] = useState<T>(initialState);
  const callbackRef = useRef<(updated: T) => void>();

  const handleSetState = (
    updatedState: React.SetStateAction<T>,
    callback?: (updatedState: T) => void
  ) => {
    callbackRef.current = callback;
    setState(updatedState);
  };

  useEffect(() => {
    if (typeof callbackRef.current === 'function') {
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
  }, [state]);

  return [state, handleSetState];
};
