import type { TripRole } from '@prisma/client';

export const ROLE_RANK: Record<TripRole, number> = {
  viewer: 1,
  editor: 2,
  owner: 3,
};

export function hasMinRole(role: TripRole, minRole: TripRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minRole];
}

export function canWriteTripContent(role: TripRole): boolean {
  return hasMinRole(role, 'editor');
}

export function canManageTrip(role: TripRole): boolean {
  return role === 'owner';
}
