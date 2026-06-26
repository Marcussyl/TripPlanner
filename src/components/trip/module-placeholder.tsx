type ModulePlaceholderProps = {
  title: string;
  description: string;
  icon: string;
};

export function ModulePlaceholder({ title, description, icon }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-outline-variant/40 px-8 py-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
          <div>
            <h1 className="text-headline-lg text-on-background">{title}</h1>
            <p className="text-body-md text-on-surface-variant">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-lg rounded-3xl border border-dashed border-outline-variant bg-surface-container-low px-8 py-12 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-primary">construction</span>
          <p className="text-headline-md text-on-background">Coming in Phase 1</p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            The shell and navigation are ready. Module features ship next.
          </p>
        </div>
      </div>
    </div>
  );
}
