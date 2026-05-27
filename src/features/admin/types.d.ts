export type ActivityStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type Activity = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status: ActivityStatus;
};

export type ActivityFormValues = Omit<Activity, 'id'>;
