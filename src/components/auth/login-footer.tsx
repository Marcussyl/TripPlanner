export function LoginFooter() {
  return (
    <footer className="mt-auto hidden w-full border-t border-outline-variant bg-surface-container md:block">
      <div className="flex flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:px-12">
        <div className="text-center md:text-left">
          <span className="text-headline-md font-bold text-on-surface">TripSync</span>
          <p className="mt-2 text-label-sm text-on-secondary-fixed-variant">
            © {new Date().getFullYear()} TripSync. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Help Center', 'Cookies'].map((label) => (
            <span
              key={label}
              className="cursor-default text-label-sm text-on-secondary-fixed-variant"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
