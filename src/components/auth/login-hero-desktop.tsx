import Image from 'next/image';

const HERO_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyL88NK73oUODYSbkR0vMNAvXlaItWwUABNojEicGlh5rQSFiEpQmwcw-0UFk7PJDC724R91lH2UessT_kC6Xox-YTT4MGKthmueO-kCLW6jgyCOqNY-uEj0qAahOTe_de7aKGFLrkp7VheVGlnOj-cuL9yfx5M_u7qMMBOM5GSfWoXIMlWoB8XTHo1m23in1n1InL_4BChWu2Uz8_s0IMFnhTvc1xGyoBGl4_okpEom3HercPe5pr';

export function LoginHeroDesktop() {
  return (
    <section className="relative hidden min-h-[480px] flex-1 overflow-hidden bg-surface-dim md:block md:w-1/2">
      <Image
        src={HERO_IMAGE_URL}
        alt="Mountain road at golden hour"
        fill
        priority
        className="object-cover transition-transform duration-[10000ms] hover:scale-110"
        sizes="50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20" />
      <div className="absolute bottom-12 left-12 max-w-md rounded-2xl border border-white/20 bg-surface/10 p-8 backdrop-blur-md">
        <h2 className="text-headline-lg font-bold text-white">
          Every journey starts with a single plan.
        </h2>
        <p className="mt-2 text-body-md text-white/90">
          Join explorers organizing their next adventure with ease and collaboration.
        </p>
      </div>
    </section>
  );
}
