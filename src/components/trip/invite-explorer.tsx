'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type InviteExplorerProps = {
  tripId: string;
  isOwner: boolean;
};

export function InviteExplorer({ tripId, isOwner }: InviteExplorerProps) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOwner) {
    return null;
  }

  const generateInvite = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/trips/${tripId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'editor', expiresInDays: 7 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create invite');
      }
      const data = await res.json();
      setInviteUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  const copyInvite = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-headline-md">
          <span className="material-symbols-outlined text-primary">person_add</span>
          Invite Explorer
        </CardTitle>
        <CardDescription>Generate a link to invite collaborators to this trip.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-body-md text-error">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <Button onClick={generateInvite} disabled={loading}>
            {loading ? 'Generating...' : 'Generate invite link'}
          </Button>
          {inviteUrl && (
            <Button variant="secondary" onClick={copyInvite}>
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
          )}
        </div>
        {inviteUrl && (
          <p className="break-all rounded-lg bg-surface-container-low p-3 text-body-md text-on-surface-variant">
            {inviteUrl}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
