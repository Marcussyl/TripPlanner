import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { calculateBalances } from '@/lib/budget/calculate-balances';
import { prisma } from '@/lib/prisma';
import { serializeTripBudget } from '@/lib/trip/serialize';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const [trip, members, expenses] = await Promise.all([
      prisma.trip.findUnique({
        where: { id },
        select: { budgetLimit: true },
      }),
      prisma.tripMember.findMany({
        where: { tripId: id },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.expense.findMany({
        where: { tripId: id },
        include: { splits: true },
      }),
    ]);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    const byCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
      const key = expense.category;
      acc[key] = (acc[key] ?? 0) + Number(expense.amount);
      return acc;
    }, {});

    const balanceMembers = members.map((member) => ({
      userId: member.user.id,
      name: member.user.name ?? member.user.email,
    }));

    const balanceExpenses = expenses.map((expense) => ({
      id: expense.id,
      payerId: expense.payerId,
      amount: Number(expense.amount),
      splits: expense.splits.map((split) => ({
        userId: split.userId,
        amount: Number(split.amount),
      })),
    }));

    const balances = calculateBalances(balanceMembers, balanceExpenses);

    return NextResponse.json({
      ...serializeTripBudget(trip),
      totalSpent: Math.round(totalSpent * 100) / 100,
      byCategory,
      balances,
      memberCount: members.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
