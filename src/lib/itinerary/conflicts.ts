export type ActivityForConflict = {
  id: string;
  startTime: Date | string | null;
  duration: number | null;
};

function getEndTime(start: Date, durationMin: number): Date {
  return new Date(start.getTime() + durationMin * 60 * 1000);
}

export function detectConflicts(activities: ActivityForConflict[]): Set<string> {
  const conflicting = new Set<string>();
  const timed = activities
    .filter((activity) => activity.startTime != null && activity.duration != null)
    .map((activity) => {
      const start = new Date(activity.startTime!);
      return {
        id: activity.id,
        start,
        end: getEndTime(start, activity.duration!),
      };
    });

  for (let i = 0; i < timed.length; i++) {
    for (let j = i + 1; j < timed.length; j++) {
      const a = timed[i];
      const b = timed[j];
      if (a.start < b.end && b.start < a.end) {
        conflicting.add(a.id);
        conflicting.add(b.id);
      }
    }
  }

  return conflicting;
}
