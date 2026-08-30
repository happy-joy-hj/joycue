import Image from "next/image";
import Link from "next/link";

import { AuthStatus } from "@/components/auth-status";

export function SiteHeader() {
  return (
    <header className="bg-joy-gradient-dark sticky top-0 z-50 border-b border-white/10 shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-[76px] sm:px-6">
        <Link
          href="/"
          aria-label="JoyCue home"
          className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-joy-night"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white to-surface-soft shadow-sm ring-1 ring-joy-soft-lavender/40 transition group-hover:scale-[1.03] group-hover:shadow-md sm:h-11 sm:w-11">
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
              priority
            />
          </span>

          <span className="hidden text-xl font-semibold tracking-tight text-white sm:inline">
            JoyCue
          </span>
        </Link>

        <AuthStatus />
      </div>
    </header>
  );
}
