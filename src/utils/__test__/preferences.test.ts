import { Time24 } from '@/types/time24';

import {
  calculateIntervalIndexFromTime,
  calculateNumIntervalsBetweenTimes,
} from '../preferences';

describe('Preferences utils', () => {
  describe('calculateNumIntervalsBetweenTimes', () => {
    it('Num intervals, integer interval, integer returned value', () => {
      const minTime = new Time24(10);
      const maxTime = new Time24(15);

      const intervalSize = 1;

      const numIntervals = calculateNumIntervalsBetweenTimes(
        minTime,
        maxTime,
        intervalSize
      );

      expect(numIntervals).toEqual(5);
    });

    it('Num intervals, integer interval, float returned value', () => {
      const minTime = new Time24(10);
      const maxTime = new Time24(15);

      const intervalSize = 2;

      const numIntervals = calculateNumIntervalsBetweenTimes(
        minTime,
        maxTime,
        intervalSize
      );

      expect(numIntervals).toEqual(2.5);
    });

    it('Num intervals, float interval, integer returned value', () => {
      const minTime = new Time24(10);
      const maxTime = new Time24(15);

      const intervalSize = 0.5;

      const numIntervals = calculateNumIntervalsBetweenTimes(
        minTime,
        maxTime,
        intervalSize
      );

      expect(numIntervals).toEqual(10);
    });

    it('Num intervals, float interval, float returned value', () => {
      const minTime = new Time24(10);
      const maxTime = new Time24(12);

      const intervalSize = 0.8;

      const numIntervals = calculateNumIntervalsBetweenTimes(
        minTime,
        maxTime,
        intervalSize
      );

      expect(numIntervals).toEqual(2.5);
    });
  });

  describe('calculateIntervalIndexFromTime', () => {
    it('Interval index, integer interval, time == minTime', () => {
      const minTime = new Time24(10);
      const time = new Time24(10);
      const intervalSize = 1;
      const numIntervalsInDay = 10;

      const intervalIndex = calculateIntervalIndexFromTime(
        time,
        minTime,
        intervalSize,
        numIntervalsInDay
      );

      expect(intervalIndex).toEqual(0);
    });

    it('Interval index, integer interval, minTime < time < maxTime', () => {
      const minTime = new Time24(10);
      const time = new Time24(12);
      const intervalSize = 1;
      const numIntervalsInDay = 10;

      const intervalIndex = calculateIntervalIndexFromTime(
        time,
        minTime,
        intervalSize,
        numIntervalsInDay
      );

      expect(intervalIndex).toEqual(2);
    });

    it('Interval index, integer interval, time == maxTime', () => {
      const minTime = new Time24(10);
      const time = new Time24(20);
      const intervalSize = 1;
      const numIntervalsInDay = 10;

      const intervalIndex = calculateIntervalIndexFromTime(
        time,
        minTime,
        intervalSize,
        numIntervalsInDay
      );

      expect(intervalIndex).toEqual(10);
    });

    it('Interval index, throws errors for invalid values', () => {
      const minTime = new Time24(10);

      const intervalSize = 1;
      const numIntervalsInDay = 5;

      const timeLessThanMinTime = new Time24(9);
      const timeGreaterThanMaxTime = new Time24(16);

      expect(() =>
        calculateIntervalIndexFromTime(
          timeLessThanMinTime,
          minTime,
          intervalSize,
          numIntervalsInDay
        )
      ).toThrow();

      expect(() =>
        calculateIntervalIndexFromTime(
          timeGreaterThanMaxTime,
          minTime,
          intervalSize,
          numIntervalsInDay
        )
      ).toThrow();
    });
  });
});
