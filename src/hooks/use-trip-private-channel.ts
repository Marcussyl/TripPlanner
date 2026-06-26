'use client';

import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { tripPrivateChannel } from '@/lib/realtime/channels';

const TRIP_EVENTS = [
  'activity.created',
  'activity.updated',
  'activity.deleted',
  'message.created',
  'expense.created',
  'expense.updated',
  'pin.created',
  'pin.updated',
  'pin.deleted',
  'poll.updated',
] as const;

export type TripPrivateEvent = (typeof TRIP_EVENTS)[number];

type UseTripPrivateChannelOptions = {
  onEvent: (event: TripPrivateEvent, data: unknown) => void;
  enabled?: boolean;
};

export function useTripPrivateChannel(
  tripId: string,
  { onEvent, enabled = true }: UseTripPrivateChannelOptions,
) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      return;
    }

    const pusher = new Pusher(key, {
      cluster,
      authEndpoint: '/api/realtime/auth',
    });

    const channelName = tripPrivateChannel(tripId);
    const channel = pusher.subscribe(channelName);

    const handlers = TRIP_EVENTS.map((event) => {
      const handler = (data: unknown) => onEventRef.current(event, data);
      channel.bind(event, handler);
      return { event, handler };
    });

    return () => {
      handlers.forEach(({ event, handler }) => channel.unbind(event, handler));
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [tripId, enabled]);
}
