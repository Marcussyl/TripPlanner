import { NextResponse } from 'next/server';
import { requireAuth, requireTripMember, TripAccessError } from '@/lib/auth/trip-access';
import { getPusherServer, parsePresenceChannel } from '@/lib/pusher-server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const socketId = formData.get('socket_id') as string;
    const channelName = formData.get('channel_name') as string;

    if (!socketId || !channelName) {
      return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
    }

    const tripId = parsePresenceChannel(channelName);
    if (!tripId) {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
    }

    await requireTripMember(tripId, 'viewer', user.id);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, image: true, avatarUrl: true },
    });

    const pusher = getPusherServer();
    const authResponse = pusher.authorizeChannel(socketId, channelName, {
      user_id: user.id,
      user_info: {
        name: dbUser?.name ?? dbUser?.email ?? 'Traveler',
        avatarUrl: dbUser?.avatarUrl ?? dbUser?.image ?? '',
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    if (error instanceof TripAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Authorization failed' }, { status: 500 });
  }
}
