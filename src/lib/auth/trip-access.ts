import type { TripRole } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ROLE_RANK } from '@/lib/auth/trip-roles';

export class TripAccessError extends Error {
  constructor(
    message: string,
    public status: number = 403,
  ) {
    super(message);
    this.name = 'TripAccessError';
  }
}

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user?.id) {
    throw new TripAccessError('Unauthorized', 401);
  }
  return user;
}

export async function getTripMember(tripId: string, userId: string) {
  return prisma.tripMember.findUnique({
    where: {
      tripId_userId: { tripId, userId },
    },
  });
}

export async function requireTripMember(
  tripId: string,
  minRole: TripRole = 'viewer',
  userId?: string,
) {
  const user = userId ? { id: userId } : await requireAuth();
  const member = await getTripMember(tripId, user.id);

  if (!member) {
    throw new TripAccessError('Not a member of this trip', 403);
  }

  if (ROLE_RANK[member.role] < ROLE_RANK[minRole]) {
    throw new TripAccessError('Insufficient permissions', 403);
  }

  return member;
}
