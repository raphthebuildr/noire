import Image from "next/image";
import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="page-shell py-10 lg:py-16">
      <div className="grid overflow-hidden border border-line lg:grid-cols-[1fr_1.05fr]">
        <div className="relative hidden min-h-[680px] bg-surface lg:block">
          <Image
            src="/images/editorial/home-b-05-editorial-portrait-of-a-model-in-a-heather-slate-heavyweight.jpg"
            alt="NOIRÉ model in a heather slate hoodie"
            fill
            priority
            sizes="50vw"
            className="image-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-8 pt-24 text-canvas">
            <p className="font-serif text-[30px] leading-tight">
              Fewer pieces.
              <br />
              Worn more often.
            </p>
            <p className="mt-3 max-w-[300px] text-xs leading-relaxed text-canvas/75">
              Save addresses, track orders and return to your favourites without
              starting over.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-paper px-6 py-10 sm:px-12 lg:px-16 lg:py-16">
          <div className="mx-auto w-full max-w-[420px]">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-[0.2em]"
            >
              NOIRÉ
            </Link>
            <span className="eyebrow mt-10 block text-muted">{eyebrow}</span>
            <h1 className="mt-3 font-serif text-[38px] leading-[1.05] sm:text-[46px]">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{intro}</p>
            <div className="mt-8">{children}</div>
            {footer ? (
              <div className="mt-8 border-t border-line pt-6 text-sm text-muted">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
