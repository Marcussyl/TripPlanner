import { describe, expect, it } from 'vitest';
import {
  canManageTrip,
  canWriteTripContent,
  hasMinRole,
} from '@/lib/auth/trip-roles';

describe('trip role guards', () => {
  it('ranks roles correctly', () => {
    expect(hasMinRole('owner', 'viewer')).toBe(true);
    expect(hasMinRole('editor', 'owner')).toBe(false);
    expect(hasMinRole('viewer', 'editor')).toBe(false);
  });

  it('allows editors to write trip content', () => {
    expect(canWriteTripContent('editor')).toBe(true);
    expect(canWriteTripContent('viewer')).toBe(false);
  });

  it('restricts trip management to owners', () => {
    expect(canManageTrip('owner')).toBe(true);
    expect(canManageTrip('editor')).toBe(false);
  });

  it('blocks viewers from invite generation (owner-only)', () => {
    expect(canManageTrip('viewer')).toBe(false);
  });
});
