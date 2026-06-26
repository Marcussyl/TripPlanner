'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, useDialog } from '@/components/ui/dialog';

type InviteExplorerProps = {
  tripId: string;
  isOwner: boolean;
  variant?: 'card' | 'sidebar';
};

export function InviteExplorer({ tripId, isOwner, variant = 'card' }: InviteExplorerProps) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialog = useDialog();

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

  const inviteContent = (
    <div className="space-y-4">
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
    </div>
  );

  if (variant === 'sidebar') {
    return (
      <>
        <button
          type="button"
          onClick={dialog.openDialog}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-label-md text-on-primary transition-colors hover:bg-surface-tint"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Invite explorer
        </button>
        <Dialog open={dialog.open} onOpenChange={dialog.setOpen} title="Invite explorer">
          <p className="mb-4 text-body-md text-on-surface-variant">
            Generate a link to invite collaborators to this trip.
          </p>
          {inviteContent}
        </Dialog>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-headline-md">
          <span className="material-symbols-outlined text-primary">person_add</span>
          Invite explorer
        </CardTitle>
        <CardDescription>Generate a link to invite collaborators to this trip.</CardDescription>
      </CardHeader>
      <CardContent>{inviteContent}</CardContent>
    </Card>
  );
}
