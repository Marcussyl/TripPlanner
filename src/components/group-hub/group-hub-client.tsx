'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopAppBar } from '@/components/trip/top-app-bar';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { ChatMessageList } from '@/components/group-hub/chat-message-list';
import { ChatInput } from '@/components/group-hub/chat-input';
import { NotePinCard } from '@/components/group-hub/note-pin-card';
import { LinkPinCard } from '@/components/group-hub/link-pin-card';
import { PollCard } from '@/components/group-hub/poll-card';
import { useTripChannel } from '@/hooks/use-trip-channel';
import { useTripPrivateChannel } from '@/hooks/use-trip-private-channel';

type GroupHubClientProps = {
  tripId: string;
  userId: string;
  canEdit: boolean;
};

export function GroupHubClient({ tripId, userId, canEdit }: GroupHubClientProps) {
  const searchParams = useSearchParams();
  const pinFilter = searchParams.get('type');
  const { onlineCount } = useTripChannel(tripId);

  const [messages, setMessages] = useState<
    Array<{
      id: string;
      content: string;
      createdAt: string;
      user: { id: string; name: string | null };
    }>
  >([]);
  const [pins, setPins] = useState<
    Array<{
      id: string;
      type: string;
      content: string;
      category: string | null;
      createdBy: { name: string | null };
    }>
  >([]);
  const [polls, setPolls] = useState<
    Array<{
      id: string;
      question: string;
      options: Array<{
        id: string;
        label: string;
        votes: Array<{ userId: string }>;
      }>;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pollDialogOpen, setPollDialogOpen] = useState(false);

  const load = useCallback(async () => {
    const pinQuery = pinFilter ? `?type=${pinFilter}` : '';
    const [messagesRes, pinsRes, pollsRes] = await Promise.all([
      fetch(`/api/trips/${tripId}/messages`),
      fetch(`/api/trips/${tripId}/pins${pinQuery}`),
      fetch(`/api/trips/${tripId}/polls`),
    ]);
    if (messagesRes.ok) {
      setMessages((await messagesRes.json()).messages);
    }
    if (pinsRes.ok) {
      setPins((await pinsRes.json()).pins);
    }
    if (pollsRes.ok) {
      setPolls((await pollsRes.json()).polls);
    }
    setLoading(false);
  }, [tripId, pinFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  useTripPrivateChannel(tripId, {
    onEvent: (event) => {
      if (event === 'message.created' || event === 'pin.created' || event === 'poll.updated') {
        void load();
      }
    },
  });

  const sendMessage = async (content: string) => {
    await fetch(`/api/trips/${tripId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    await load();
  };

  const createPin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = String(form.get('type'));
    const title = String(form.get('title'));
    const body = String(form.get('body'));
    const url = String(form.get('url'));

    const content =
      type === 'note'
        ? JSON.stringify({ title, bullets: body.split('\n').filter(Boolean) })
        : JSON.stringify({ url, title, description: body });

    await fetch(`/api/trips/${tripId}/pins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        content,
        category: form.get('idea') === 'on' ? 'idea' : null,
      }),
    });
    setPinDialogOpen(false);
    await load();
  };

  const createPoll = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const question = String(form.get('question'));
    const options = String(form.get('options'))
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    await fetch(`/api/trips/${tripId}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, options }),
    });
    setPollDialogOpen(false);
    await load();
  };

  const vote = async (pollId: string, pollOptionId: string) => {
    await fetch(`/api/trips/${tripId}/polls/${pollId}/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollOptionId }),
    });
    await load();
  };

  if (loading) {
    return <LoadingState label="Loading group hub…" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopAppBar
        title="Group Hub"
        subtitle={`${onlineCount} online now`}
        actions={
          canEdit ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setPinDialogOpen(true)}>
                Add pin
              </Button>
              <Button onClick={() => setPollDialogOpen(true)}>New poll</Button>
            </div>
          ) : undefined
        }
      />
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-3">
        <section className="flex flex-col border-r border-outline-variant/60 lg:col-span-1">
          <ChatMessageList messages={messages} />
          <ChatInput disabled={!canEdit} onSend={sendMessage} />
        </section>
        <section className="space-y-4 overflow-y-auto p-6 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {['all', 'note', 'link'].map((filter) => (
              <a
                key={filter}
                href={
                  filter === 'all'
                    ? `/trips/${tripId}/group-hub`
                    : `/trips/${tripId}/group-hub?type=${filter}`
                }
                className={
                  (filter === 'all' && !pinFilter) || pinFilter === filter
                    ? 'rounded-full bg-primary px-3 py-1 text-label-sm text-on-primary'
                    : 'rounded-full border border-outline-variant px-3 py-1 text-label-sm text-on-surface-variant'
                }
              >
                {filter}
              </a>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pins.map((pin) =>
              pin.type === 'link' ? (
                <LinkPinCard
                  key={pin.id}
                  content={pin.content}
                  authorName={pin.createdBy.name}
                />
              ) : (
                <NotePinCard
                  key={pin.id}
                  content={pin.content}
                  authorName={pin.createdBy.name}
                />
              ),
            )}
          </div>
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              currentUserId={userId}
              canVote={canEdit}
              onVote={(optionId) => vote(poll.id, optionId)}
            />
          ))}
        </section>
      </div>

      <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen} title="Add pin">
        <form className="space-y-4" onSubmit={createPin}>
          <select
            name="type"
            className="w-full rounded-lg border border-outline-variant px-3 py-2"
            defaultValue="note"
          >
            <option value="note">Note</option>
            <option value="link">Link</option>
          </select>
          <Input name="title" placeholder="Title" required />
          <Input name="url" placeholder="URL (for links)" />
          <textarea
            name="body"
            rows={4}
            placeholder="Body or bullet lines (one per line for notes)"
            className="w-full rounded-lg border border-outline-variant px-3 py-2"
          />
          <label className="flex items-center gap-2 text-body-sm">
            <input type="checkbox" name="idea" /> Mark as quick idea
          </label>
          <Button type="submit">Save pin</Button>
        </form>
      </Dialog>

      <Dialog open={pollDialogOpen} onOpenChange={setPollDialogOpen} title="New poll">
        <form className="space-y-4" onSubmit={createPoll}>
          <Input name="question" placeholder="Question" required />
          <textarea
            name="options"
            rows={4}
            placeholder="Options (one per line)"
            className="w-full rounded-lg border border-outline-variant px-3 py-2"
            required
          />
          <Button type="submit">Create poll</Button>
        </form>
      </Dialog>
    </div>
  );
}
