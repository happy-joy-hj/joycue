import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white">
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--joy-blue), var(--joy-lavender), transparent)",
        }}
      />

      <div
        style={{
          background:
            "linear-gradient(135deg, #0e1a3e 0%, #1b2853 55%, #2e3e6e 100%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            aria-label="JoyCue home"
            className="group flex w-fit items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 shadow-sm ring-1 ring-[#d0a8e0]/30 transition group-hover:bg-white">
              <Image
                src="/icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </span>

            <div>
              <p className="font-semibold tracking-tight text-white">JoyCue</p>

              <p className="mt-0.5 text-xs leading-5 text-white/60">
                Find something that fits your moment.
              </p>
            </div>
          </Link>

          <div className="text-left sm:text-right">
            <p className="text-sm text-white/70">
              A <span className="font-medium text-white">Happy Joy</span>{" "}
              project
            </p>

            <p className="mt-1 text-xs text-white/45">© {currentYear} JoyCue</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
