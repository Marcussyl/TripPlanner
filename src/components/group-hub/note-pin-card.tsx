'use client';

type NotePinCardProps = {
  content: string;
  authorName?: string | null;
};

export function NotePinCard({ content, authorName }: NotePinCardProps) {
  let parsed: { title?: string; bullets?: string[] } = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { title: 'Note', bullets: [content] };
  }

  return (
    <article className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-primary">sticky_note_2</span>
        <h4 className="text-title-md text-on-background">{parsed.title ?? 'Note'}</h4>
      </div>
      {parsed.bullets && parsed.bullets.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">
          {parsed.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {authorName && (
        <p className="mt-3 text-label-sm text-on-surface-variant">by {authorName}</p>
      )}
    </article>
  );
}
