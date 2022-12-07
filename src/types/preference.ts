import type { SchedulorSelection } from '@/components/Schedulor/DateSlider';

export class Preference {
  constructor(
    public preferenceId: string,
    public scheduleSelections: SchedulorSelection[]
  ) {}
}
