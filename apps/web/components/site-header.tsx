import Image from "next/image";
import Link from "next/link";

import { AuthStatus } from "@/components/auth-status";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 shadow-sm"
      style={{ background: "var(--joy-gradient-dark)" }}
    >
      <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="JoyCue home"
          className="group flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#ffffff_0%,#f3f1f8_100%)] shadow-sm ring-1 ring-[#d0a8e0]/40 transition group-hover:scale-[1.03] group-hover:shadow-md">
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
          </span>

          <span className="text-xl font-semibold tracking-tight text-white">
            JoyCue
          </span>
        </Link>

        <AuthStatus />
      </div>
    </header>
  );
}
