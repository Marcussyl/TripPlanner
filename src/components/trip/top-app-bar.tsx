type TopAppBarProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function TopAppBar({ title, subtitle, actions }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-outline-variant/40 bg-background/80 px-8 py-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-lg text-on-background">{title}</h2>
          {subtitle && <p className="mt-1 text-body-md text-on-surface-variant">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
