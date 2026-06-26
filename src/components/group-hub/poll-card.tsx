'use client';

type PollCardProps = {
  poll: {
    id: string;
    question: string;
    options: Array<{
      id: string;
      label: string;
      votes: Array<{ userId: string }>;
    }>;
  };
  currentUserId?: string;
  canVote: boolean;
  onVote: (pollOptionId: string) => Promise<void>;
};

export function PollCard({ poll, currentUserId, canVote, onVote }: PollCardProps) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);

  return (
    <article className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4">
      <h4 className="text-title-md text-on-background">{poll.question}</h4>
      <ul className="mt-4 space-y-3">
        {poll.options.map((option) => {
          const count = option.votes.length;
          const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const voted = option.votes.some((vote) => vote.userId === currentUserId);

          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={!canVote}
                onClick={() => void onVote(option.id)}
                className="w-full text-left disabled:cursor-default"
              >
                <div className="mb-1 flex justify-between text-body-sm">
                  <span className={voted ? 'font-semibold text-primary' : 'text-on-surface'}>
                    {option.label}
                  </span>
                  <span className="text-on-surface-variant">
                    {count} · {percent}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
