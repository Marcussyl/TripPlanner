import { describe, expect, it } from 'vitest';
import { calculateBalances } from '@/lib/budget/calculate-balances';

const members = [
  { userId: 'u1', name: 'Alice' },
  { userId: 'u2', name: 'Bob' },
  { userId: 'u3', name: 'Carol' },
  { userId: 'u4', name: 'Dave' },
];

describe('calculateBalances', () => {
  it('splits equal expense across four members', () => {
    const balances = calculateBalances(members, [
      {
        id: 'e1',
        payerId: 'u1',
        amount: 400,
        splits: [
          { userId: 'u1', amount: 100 },
          { userId: 'u2', amount: 100 },
          { userId: 'u3', amount: 100 },
          { userId: 'u4', amount: 100 },
        ],
      },
    ]);

    expect(balances.find((b) => b.userId === 'u1')?.net).toBe(300);
    expect(balances.find((b) => b.userId === 'u2')?.net).toBe(-100);
    expect(balances.find((b) => b.userId === 'u3')?.net).toBe(-100);
    expect(balances.find((b) => b.userId === 'u4')?.net).toBe(-100);
  });

  it('handles partial member splits', () => {
    const balances = calculateBalances(
      members.slice(0, 2),
      [
        {
          id: 'e1',
          payerId: 'u1',
          amount: 100,
          splits: [
            { userId: 'u1', amount: 50 },
            { userId: 'u2', amount: 50 },
          ],
        },
      ],
    );

    expect(balances.find((b) => b.userId === 'u1')?.net).toBe(50);
    expect(balances.find((b) => b.userId === 'u2')?.net).toBe(-50);
  });
});
