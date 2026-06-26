import { NextResponse } from 'next/server';
import { requireAuth, TripAccessError } from '@/lib/auth/trip-access';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { token } = await context.params;

    const invite = await prisma.tripInvite.findUnique({
      where: { token },
      include: { trip: true },
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    if (invite.acceptedAt) {
      return NextResponse.json({ error: 'Invite already used' }, { status: 410 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invite expired' }, { status: 410 });
    }

    const existingMember = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: invite.tripId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json({
        tripId: invite.tripId,
        message: 'Already a member',
        member: existingMember,
      });
    }

    const [member] = await prisma.$transaction([
      prisma.tripMember.create({
        data: {
          tripId: invite.tripId,
          userId: user.id,
          role: invite.role,
        },
      }),
      prisma.tripInvite.update({
        where: { id: invite.id },
        data: {
          acceptedAt: new Date(),
          acceptedById: user.id,
        },
      }),
    ]);

    return NextResponse.json({
      tripId: invite.tripId,
      tripName: invite.trip.name,
      member,
    });
  } catch (error) {
    if (error instanceof TripAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;

    const invite = await prisma.tripInvite.findUnique({
      where: { token },
      include: {
        trip: {
          select: { id: true, name: true, destination: true },
        },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    if (invite.acceptedAt) {
      return NextResponse.json({ error: 'Invite already used' }, { status: 410 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invite expired' }, { status: 410 });
    }

    return NextResponse.json({
      invite: {
        token: invite.token,
        role: invite.role,
        expiresAt: invite.expiresAt,
        trip: invite.trip,
      },
    });
  } catch (error) {
    throw error;
  }
}
