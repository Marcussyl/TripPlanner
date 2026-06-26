import { getPusherServer, tripPrivateChannel } from '@/lib/pusher-server';

export async function emitTripEvent(tripId: string, event: string, payload: object) {
  try {
    const pusher = getPusherServer();
    await pusher.trigger(tripPrivateChannel(tripId), event, payload);
  } catch (error) {
    console.error(`Failed to emit ${event} for trip ${tripId}:`, error);
  }
}
