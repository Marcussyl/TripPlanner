'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';

type InviteAcceptPageProps = {
  token: string;
};

type InvitePreview = {
  token: string;
  role: string;
  expiresAt: string;
  trip: {
    id: string;
    name: string;
    destination: string;
  };
};

export function InviteAcceptClient({ token }: InviteAcceptPageProps) {
  const router = useRouter();
  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvite = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/invites/${token}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Invalid invite');
      }
      const data = await res.json();
      setInvite(data.invite);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invite');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadInvite();
  }, [loadInvite]);

  const acceptInvite = async () => {
    setAccepting(true);
    setError(null);
    try {
      const res = await fetch(`/api/invites/${token}`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to accept invite');
      }
      const data = await res.json();
      router.push(`/trips/${data.tripId}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invite');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading invite..." />;
  }

  if (error || !invite) {
    return <ErrorState message={error ?? 'Invite not found'} onRetry={loadInvite} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join trip</CardTitle>
          <CardDescription>
            You&apos;ve been invited to plan <strong>{invite.trip.name}</strong> in{' '}
            {invite.trip.destination}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-md text-on-surface-variant">
            Role: <span className="font-semibold capitalize">{invite.role}</span>
          </p>
          <Button className="w-full" onClick={acceptInvite} disabled={accepting}>
            {accepting ? 'Joining...' : 'Accept invite'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
