import { NextResponse } from 'next/server';
import { requireAuth, requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { votePollSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';

type RouteContext = {
  params: Promise<{ id: string; pollId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id, pollId } = await context.params;
    const user = await requireAuth();
    await requireTripMember(id, 'editor', user.id);

    const body = votePollSchema.parse(await request.json());

    const poll = await prisma.poll.findFirst({
      where: { id: pollId, tripId: id },
      include: { options: true },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const option = poll.options.find((item) => item.id === body.pollOptionId);
    if (!option) {
      return NextResponse.json({ error: 'Poll option not found' }, { status: 404 });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        pollOption: { pollId },
      },
    });

    if (existingVote) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
    }

    await prisma.vote.create({
      data: {
        pollOptionId: body.pollOptionId,
        userId: user.id,
      },
    });

    const updated = await prisma.poll.findUnique({
      where: { id: pollId },
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

    await emitTripEvent(id, 'poll.updated', { poll: updated });

    return NextResponse.json({ poll: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
