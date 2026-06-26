import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { settleSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';
import { serializeExpense } from '@/lib/trip/serialize';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'editor');

    const body = settleSchema.parse(await request.json());

    if (body.fromUserId === body.toUserId) {
      return NextResponse.json({ error: 'Cannot settle with yourself' }, { status: 400 });
    }

    const members = await prisma.tripMember.findMany({
      where: { tripId: id, userId: { in: [body.fromUserId, body.toUserId] } },
    });

    if (members.length !== 2) {
      return NextResponse.json({ error: 'Both users must be trip members' }, { status: 400 });
    }

    const toUser = await prisma.user.findUnique({
      where: { id: body.toUserId },
      select: { name: true, email: true },
    });

    const expense = await prisma.expense.create({
      data: {
        tripId: id,
        title: `Settlement to ${toUser?.name ?? toUser?.email ?? 'member'}`,
        amount: body.amount,
        category: 'other',
        payerId: body.fromUserId,
        splitType: 'exact',
        splits: {
          create: [
            { userId: body.fromUserId, amount: 0 },
            { userId: body.toUserId, amount: body.amount },
          ],
        },
      },
      include: {
        payer: { select: { id: true, name: true, avatarUrl: true, image: true } },
        splits: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, image: true } },
          },
        },
      },
    });

    const serialized = serializeExpense(expense);
    await emitTripEvent(id, 'expense.created', { expense: serialized });

    return NextResponse.json({ expense: serialized }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
