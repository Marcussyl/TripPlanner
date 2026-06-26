import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, TripAccessError } from '@/lib/auth/trip-access';
import { prisma } from '@/lib/prisma';

const createTripSchema = z.object({
  name: z.string().min(1).max(120),
  destination: z.string().min(1).max(200),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budgetLimit: z.number().positive().optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const trips = await prisma.trip.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, image: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json({ trips });
  } catch (error) {
    if (error instanceof TripAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = createTripSchema.parse(await request.json());

    const trip = await prisma.trip.create({
      data: {
        name: body.name,
        destination: body.destination,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        budgetLimit: body.budgetLimit,
        members: {
          create: {
            userId: user.id,
            role: 'owner',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, image: true, avatarUrl: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ trip }, { status: 201 });
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
