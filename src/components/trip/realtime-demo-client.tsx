'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTripChannel } from '@/hooks/use-trip-channel';

type RealtimeDemoClientProps = {
  tripId: string;
};

export function RealtimeDemoClient({ tripId }: RealtimeDemoClientProps) {
  const { onlineCount, members, isConnected, lastPing, sendPing } = useTripChannel(tripId);
  const [pinging, setPinging] = useState(false);

  const handlePing = async () => {
    setPinging(true);
    try {
      await sendPing(`Hello from ${new Date().toLocaleTimeString()}`);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-8">
      <Card>
        <CardHeader>
          <CardTitle>Realtime presence demo</CardTitle>
          <CardDescription>
            Open this page in two browsers to verify Pusher presence. Phase 0 spike for
            collaborative features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl bg-surface-container px-4 py-3">
              <p className="text-label-sm text-on-surface-variant">Connection</p>
              <p className="text-headline-md text-on-background">
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container px-4 py-3">
              <p className="text-label-sm text-on-surface-variant">Online</p>
              <p className="text-headline-md text-primary">{onlineCount}</p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-label-md text-on-surface-variant">Online members</p>
            {members.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">Waiting for presence...</p>
            ) : (
              <ul className="space-y-2">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-body-md">{member.info.name ?? member.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handlePing} disabled={pinging || !isConnected}>
              Send ping event
            </Button>
            {lastPing && (
              <p className="text-body-md text-on-surface-variant">Last ping: {lastPing}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
