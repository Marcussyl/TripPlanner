import { describe, expect, it } from 'vitest';
import { detectConflicts } from '@/lib/itinerary/conflicts';

describe('detectConflicts', () => {
  it('returns empty set when no activities overlap', () => {
    const conflicts = detectConflicts([
      { id: 'a', startTime: '2026-07-10T10:00:00Z', duration: 60 },
      { id: 'b', startTime: '2026-07-10T12:00:00Z', duration: 60 },
    ]);
    expect(conflicts.size).toBe(0);
  });

  it('flags overlapping activities', () => {
    const conflicts = detectConflicts([
      { id: 'a', startTime: '2026-07-10T10:00:00Z', duration: 90 },
      { id: 'b', startTime: '2026-07-10T11:00:00Z', duration: 60 },
    ]);
    expect(conflicts.has('a')).toBe(true);
    expect(conflicts.has('b')).toBe(true);
  });

  it('ignores activities without start time or duration', () => {
    const conflicts = detectConflicts([
      { id: 'a', startTime: null, duration: 60 },
      { id: 'b', startTime: '2026-07-10T10:00:00Z', duration: null },
    ]);
    expect(conflicts.size).toBe(0);
  });
});
