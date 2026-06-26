import { NextResponse } from 'next/server';
import { requireAuth, requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createPollSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const polls = await prisma.poll.findMany({
      where: { tripId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true, image: true } },
        options: {
          include: {
            votes: {
              include: {
                user: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ polls });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireAuth();
    await requireTripMember(id, 'editor', user.id);

    const body = createPollSchema.parse(await request.json());

    const poll = await prisma.$transaction(async (tx) => {
      const created = await tx.poll.create({
        data: {
          tripId: id,
          question: body.question,
          closesAt: body.closesAt ? new Date(body.closesAt) : null,
          createdById: user.id,
          options: {
            create: body.options.map((label) => ({ label })),
          },
        },
        include: {
          createdBy: { select: { id: true, name: true, avatarUrl: true, image: true } },
          options: { include: { votes: true } },
        },
      });

      await tx.chatMessage.create({
        data: {
          tripId: id,
          userId: user.id,
          content: `[Poll] ${body.question}`,
        },
      });

      return created;
    });

    await emitTripEvent(id, 'poll.updated', { poll });
    await emitTripEvent(id, 'message.created', {
      message: { content: `[Poll] ${body.question}`, userId: user.id },
    });

    return NextResponse.json({ poll }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
