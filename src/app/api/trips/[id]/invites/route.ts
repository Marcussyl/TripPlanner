import { TripRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireTripMember, TripAccessError } from '@/lib/auth/trip-access';
import { prisma } from '@/lib/prisma';

const inviteSchema = z.object({
  role: z.enum(['editor', 'viewer']).default('editor'),
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id: tripId } = await context.params;
    const member = await requireTripMember(tripId, 'owner');
    const body = inviteSchema.parse(await request.json());

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + body.expiresInDays);

    const invite = await prisma.tripInvite.create({
      data: {
        tripId,
        role: body.role as TripRole,
        createdById: member.userId,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const url = `${baseUrl}/invites/${invite.token}`;

    return NextResponse.json({ invite, url }, { status: 201 });
  } catch (error) {
    if (error instanceof TripAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    throw error;
  }
}
