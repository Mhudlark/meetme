import type { Time24 } from './types/time24';

export type AnyFunction = (...args: any[]) => void;

export interface SelectionIntervalRange {
  startTime: Time24;
  endTime: Time24;
}
