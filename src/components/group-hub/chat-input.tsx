'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatInputProps = {
  disabled?: boolean;
  onSend: (content: string) => Promise<void>;
};

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || disabled) {
      return;
    }
    setSending(true);
    await onSend(trimmed);
    setContent('');
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-outline-variant/60 p-4">
      <Input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Message the group…"
        disabled={disabled || sending}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || sending || !content.trim()}>
        Send
      </Button>
    </form>
  );
}
