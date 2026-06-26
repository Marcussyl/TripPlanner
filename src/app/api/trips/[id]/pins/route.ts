import { NextResponse } from 'next/server';
import { requireAuth, requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createPinSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const pins = await prisma.canvasPin.findMany({
      where: {
        tripId: id,
        ...(type ? { type: type as 'link' | 'note' | 'image' } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true, image: true } },
      },
    });

    return NextResponse.json({ pins });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireAuth();
    await requireTripMember(id, 'editor', user.id);

    const body = createPinSchema.parse(await request.json());

    if (body.type === 'image') {
      return NextResponse.json({ error: 'Image pins are not supported yet' }, { status: 501 });
    }

    const pin = await prisma.canvasPin.create({
      data: {
        tripId: id,
        type: body.type,
        content: body.content,
        category: body.category ?? null,
        createdById: user.id,
      },
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true, image: true } },
      },
    });

    await emitTripEvent(id, 'pin.created', { pin });

    return NextResponse.json({ pin }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
