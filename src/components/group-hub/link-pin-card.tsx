'use client';

type LinkPinCardProps = {
  content: string;
  authorName?: string | null;
};

export function LinkPinCard({ content, authorName }: LinkPinCardProps) {
  let parsed: { url?: string; title?: string; description?: string } = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { url: content, title: 'Link' };
  }

  return (
    <article className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">link</span>
        <h4 className="text-title-md text-on-background">{parsed.title ?? 'Link'}</h4>
      </div>
      {parsed.description && (
        <p className="mt-2 text-body-sm text-on-surface-variant">{parsed.description}</p>
      )}
      {parsed.url && (
        <a
          href={parsed.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-label-md text-primary hover:underline"
        >
          Open link
        </a>
      )}
      {authorName && (
        <p className="mt-3 text-label-sm text-on-surface-variant">by {authorName}</p>
      )}
    </article>
  );
}
