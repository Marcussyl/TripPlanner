const NAV_ITEMS = ['Explore', 'Community', 'Support'] as const;

export function LoginHeader() {
  return (
    <header className="fixed top-0 z-50 h-16 w-full border-b border-outline-variant/50 bg-surface/80 backdrop-blur-lg md:sticky md:h-auto">
      <div className="flex h-full items-center justify-between px-4 md:px-12 md:py-4">
        <div className="flex items-center gap-2 md:gap-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">explore</span>
            <span className="text-headline-md font-bold text-primary md:text-[32px] md:font-extrabold">
              TripSync
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <span
                key={item}
                className="cursor-default text-label-md text-on-surface-variant transition-colors hover:text-primary-container"
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
        <span className="hidden rounded-lg bg-primary-container px-6 py-2 text-label-md font-semibold text-on-primary-container md:inline-block">
          Sign Up
        </span>
      </div>
    </header>
  );
}
