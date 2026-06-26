import Image from 'next/image';

const ILLUSTRATION_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCe7xIgIqK_xu0tmTRSsy2pf5QCS7wExc9rzLJ-azCShb6QT09rIXd505zuCJR0mQYNFZdQVGFZRzON0gRGVauOvqxM23N1rQqIRNS1PIfYuYDnbPQaXCdtsvfSswPEVgVdkTwst1cXSpPWWJWV-LSP3BaPxs5DrfmVmppcvEGZ1X4Ff5IdvAiz_Ko9DUUn_V7ffhT7T8QmLYYZJRj8rSO3G2fJPGULq89eR0IctyFZvE9Yb9d1qAco';

export function LoginHeroMobile() {
  return (
    <div className="mb-10 flex w-full max-w-sm flex-col items-center">
      <div className="relative mb-2 h-48 w-48">
        <div className="absolute inset-0 rounded-full bg-primary-fixed-dim/20 opacity-80" />
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <Image
            src={ILLUSTRATION_URL}
            alt="Compass and paper airplane illustration"
            width={160}
            height={160}
            className="h-40 w-40 object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-[28px] font-bold leading-9 tracking-tight text-on-surface">
          Welcome back
        </h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Your next adventure is waiting for you.
        </p>
      </div>
    </div>
  );
}
