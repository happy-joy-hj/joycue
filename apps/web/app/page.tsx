const contextLabels = ["Time", "Energy", "Interests", "Your situation"];

export default function Home() {
  return (
    <main className="flex-1 px-6 py-14 sm:py-16">
      <section className="mx-auto flex min-h-[calc(100vh-16rem)] w-full max-w-4xl items-center justify-center text-center">
        <div className="w-full">
          <div className="mx-auto mb-5 w-fit rounded-full border border-line bg-white/70 px-4 py-1.5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-joy-purple uppercase">
              JoyCue
            </p>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-[-0.035em] text-joy-night sm:text-6xl lg:text-7xl">
            Find something that fits{" "}
            <span className="text-joy-gradient">your moment.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            JoyCue helps you find realistic things you can do right now based on
            your time, energy, interests, and current situation.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
            {contextLabels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-line bg-white/65 px-3 py-1.5 text-xs font-medium text-joy-indigo backdrop-blur-sm"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-line bg-white/85 p-1 shadow-[0_20px_60px_-35px_rgba(46,62,110,0.45)] backdrop-blur-sm">
            <div className="bg-joy-gradient h-1.5 w-full rounded-t-[20px]" />

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-joy-mist/70 to-joy-soft-lavender/70 shadow-sm"
                aria-hidden="true"
              >
                <span className="text-2xl leading-none text-joy-purple">✦</span>
              </div>

              <p className="mt-5 text-sm font-medium text-muted">
                Start with one simple question
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-joy-night sm:text-3xl">
                What can I do right now?
              </p>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
                A recommendation should fit the moment you are actually in,
                rather than asking you to completely change it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
