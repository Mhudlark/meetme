import type { Preference } from './preference';
import type { User } from './user';

export class Meeting {
  constructor(
    public id: string,
    public name: string,
    public users: User[],
    public preferences: Preference[]
  ) {}
}
