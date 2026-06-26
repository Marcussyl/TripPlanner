'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Pusher, { type PresenceChannel } from 'pusher-js';
import { tripPresenceChannel } from '@/lib/realtime/channels';

type PresenceMember = {
  id: string;
  info: {
    name?: string;
    avatarUrl?: string;
  };
};

type UseTripChannelResult = {
  onlineCount: number;
  members: PresenceMember[];
  onlineUserIds: Set<string>;
  isConnected: boolean;
  lastPing: string | null;
  sendPing: (message?: string) => Promise<void>;
};

export function useTripChannel(tripId: string): UseTripChannelResult {
  const [onlineCount, setOnlineCount] = useState(0);
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPing, setLastPing] = useState<string | null>(null);

  const onlineUserIds = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  const updateMembers = useCallback((channel: PresenceChannel) => {
    const presenceMembers = channel.members;
    const list: PresenceMember[] = Object.entries(presenceMembers.members).map(([id, info]) => ({
      id,
      info: info as PresenceMember['info'],
    }));
    setMembers(list);
    setOnlineCount(presenceMembers.count);
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      console.warn('Pusher public env vars are missing');
      return;
    }

    const pusher = new Pusher(key, {
      cluster,
      authEndpoint: '/api/realtime/auth',
    });

    const channelName = tripPresenceChannel(tripId);
    const channel = pusher.subscribe(channelName) as PresenceChannel;

    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
      updateMembers(channel);
    });

    channel.bind('pusher:member_added', () => updateMembers(channel));
    channel.bind('pusher:member_removed', () => updateMembers(channel));
    channel.bind('client-ping', (data: { message?: string; at?: string }) => {
      setLastPing(data.message ?? data.at ?? 'ping');
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      setIsConnected(false);
    };
  }, [tripId, updateMembers]);

  const sendPing = useCallback(
    async (message = 'ping') => {
      await fetch('/api/realtime/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, message }),
      });
    },
    [tripId],
  );

  return {
    onlineCount,
    members,
    onlineUserIds,
    isConnected,
    lastPing,
    sendPing,
  };
}
