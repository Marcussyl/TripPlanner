import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createExpenseSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';
import { serializeExpense } from '@/lib/trip/serialize';

type RouteContext = {
  params: Promise<{ id: string; expenseId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id, expenseId } = await context.params;
    await requireTripMember(id, 'editor');

    const body = createExpenseSchema.partial().parse(await request.json());

    const existing = await prisma.expense.findFirst({
      where: { id: expenseId, tripId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(body.title != null ? { title: body.title } : {}),
        ...(body.amount != null ? { amount: body.amount } : {}),
        ...(body.category != null ? { category: body.category } : {}),
        ...(body.linkedActivityId !== undefined
          ? { linkedActivityId: body.linkedActivityId }
          : {}),
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
    await emitTripEvent(id, 'expense.updated', { expense: serialized });

    return NextResponse.json({ expense: serialized });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, expenseId } = await context.params;
    await requireTripMember(id, 'editor');

    const existing = await prisma.expense.findFirst({
      where: { id: expenseId, tripId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    await prisma.expense.delete({ where: { id: expenseId } });
    await emitTripEvent(id, 'expense.updated', { expenseId, deleted: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
