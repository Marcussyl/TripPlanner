import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireTripMember, TripAccessError } from '@/lib/auth/trip-access';
import { getPusherServer, tripPresenceChannel } from '@/lib/pusher-server';

const pingSchema = z.object({
  tripId: z.string().min(1),
  message: z.string().min(1).max(200).default('ping'),
});

export async function POST(request: Request) {
  try {
    const body = pingSchema.parse(await request.json());
    await requireTripMember(body.tripId, 'viewer');

    const pusher = getPusherServer();
    await pusher.trigger(tripPresenceChannel(body.tripId), 'client-ping', {
      message: body.message,
      at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof TripAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    throw error;
  }
}
