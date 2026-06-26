import { describe, expect, it, vi, beforeEach } from 'vitest';

class TripAccessError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
    this.name = 'TripAccessError';
  }
}

const { requireTripMemberMock, requireAuthMock } = vi.hoisted(() => ({
  requireTripMemberMock: vi.fn(),
  requireAuthMock: vi.fn().mockResolvedValue({ id: 'user-1' }),
}));

vi.mock('@/lib/auth/trip-access', () => ({
  TripAccessError,
  requireAuth: requireAuthMock,
  requireTripMember: requireTripMemberMock,
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    activity: { create: vi.fn() },
    itineraryDay: { findFirst: vi.fn() },
    expense: { create: vi.fn() },
    tripMember: { findMany: vi.fn() },
    chatMessage: { create: vi.fn() },
    canvasPin: { create: vi.fn() },
  },
}));

vi.mock('@/lib/realtime/trip-events', () => ({
  emitTripEvent: vi.fn(),
}));

async function expectViewerForbidden(
  importPath: string,
  handler: 'POST',
  url: string,
  body: object,
  params: Record<string, string>,
) {
  requireTripMemberMock.mockImplementation(async (_tripId: string, role: string) => {
    if (role === 'editor') {
      throw new TripAccessError('Insufficient permissions', 403);
    }
    return { role: 'viewer' };
  });

  const route = await import(importPath);
  const response = await route[handler](
    new Request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve(params) },
  );

  expect(response.status).toBe(403);
}

describe('viewer write operations return 403', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks activity creation', async () => {
    await expectViewerForbidden(
      '@/app/api/trips/[id]/activities/route',
      'POST',
      'http://localhost/api/trips/trip-1/activities',
      { dayId: 'day-1', type: 'activity', title: 'Test' },
      { id: 'trip-1' },
    );
  });

  it('blocks expense creation', async () => {
    await expectViewerForbidden(
      '@/app/api/trips/[id]/expenses/route',
      'POST',
      'http://localhost/api/trips/trip-1/expenses',
      { title: 'Dinner', amount: 50, category: 'food' },
      { id: 'trip-1' },
    );
  });

  it('blocks message creation', async () => {
    await expectViewerForbidden(
      '@/app/api/trips/[id]/messages/route',
      'POST',
      'http://localhost/api/trips/trip-1/messages',
      { content: 'Hello' },
      { id: 'trip-1' },
    );
  });

  it('blocks pin creation', async () => {
    await expectViewerForbidden(
      '@/app/api/trips/[id]/pins/route',
      'POST',
      'http://localhost/api/trips/trip-1/pins',
      { type: 'note', content: JSON.stringify({ title: 'Idea', bullets: ['a'] }) },
      { id: 'trip-1' },
    );
  });
});
