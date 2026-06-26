'use client';

import { useEffect, useRef } from 'react';

type ChatMessageListProps = {
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string | null };
  }>;
};

function formatDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  let lastDate = '';

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.map((message) => {
        const dateLabel = formatDateLabel(message.createdAt);
        const showDate = dateLabel !== lastDate;
        lastDate = dateLabel;

        return (
          <div key={message.id}>
            {showDate && (
              <p className="my-4 text-center text-label-sm text-on-surface-variant">{dateLabel}</p>
            )}
            <div className="rounded-2xl bg-surface-container-lowest px-4 py-3">
              <p className="text-label-sm font-semibold text-primary">
                {message.user.name ?? 'Traveler'}
              </p>
              <p className="mt-1 text-body-md text-on-surface">{message.content}</p>
              <p className="mt-1 text-label-sm text-on-surface-variant">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
