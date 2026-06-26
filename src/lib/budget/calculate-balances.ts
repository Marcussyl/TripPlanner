export type BalanceMember = {
  userId: string;
  name: string;
};

export type BalanceExpense = {
  id: string;
  payerId: string;
  amount: number;
  splits: { userId: string; amount: number }[];
};

export type MemberBalance = {
  userId: string;
  name: string;
  net: number;
};

export function calculateBalances(
  members: BalanceMember[],
  expenses: BalanceExpense[],
): MemberBalance[] {
  const nets = new Map<string, number>(members.map((member) => [member.userId, 0]));

  for (const expense of expenses) {
    nets.set(expense.payerId, (nets.get(expense.payerId) ?? 0) + expense.amount);
    for (const split of expense.splits) {
      nets.set(split.userId, (nets.get(split.userId) ?? 0) - split.amount);
    }
  }

  return members.map((member) => ({
    userId: member.userId,
    name: member.name,
    net: Math.round((nets.get(member.userId) ?? 0) * 100) / 100,
  }));
}
