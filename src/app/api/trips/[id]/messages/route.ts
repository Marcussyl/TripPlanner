import { NextResponse } from 'next/server';
import { requireAuth, requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createMessageSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const messages = await prisma.chatMessage.findMany({
      where: { tripId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, image: true } },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireAuth();
    await requireTripMember(id, 'editor', user.id);

    const body = createMessageSchema.parse(await request.json());

    const message = await prisma.chatMessage.create({
      data: {
        tripId: id,
        userId: user.id,
        content: body.content,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, image: true } },
      },
    });

    await emitTripEvent(id, 'message.created', { message });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
