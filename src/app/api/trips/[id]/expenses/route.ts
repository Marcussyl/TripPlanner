import { NextResponse } from 'next/server';
import { requireAuth, requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createExpenseSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';
import { serializeExpense } from '@/lib/trip/serialize';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const expenses = await prisma.expense.findMany({
      where: { tripId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        payer: { select: { id: true, name: true, avatarUrl: true, image: true } },
        splits: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, image: true } },
          },
        },
      },
    });

    return NextResponse.json({
      expenses: expenses.map(serializeExpense),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireAuth();
    await requireTripMember(id, 'editor', user.id);

    const body = createExpenseSchema.parse(await request.json());

    const members = await prisma.tripMember.findMany({
      where: { tripId: id },
      select: { userId: true },
    });

    if (members.length === 0) {
      return NextResponse.json({ error: 'No trip members' }, { status: 400 });
    }

    const splitAmount = body.amount / members.length;
    const roundedSplit = Math.round(splitAmount * 100) / 100;

    const expense = await prisma.expense.create({
      data: {
        tripId: id,
        title: body.title,
        amount: body.amount,
        category: body.category,
        payerId: user.id,
        linkedActivityId: body.linkedActivityId ?? null,
        splits: {
          create: members.map((member) => ({
            userId: member.userId,
            amount: roundedSplit,
          })),
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
