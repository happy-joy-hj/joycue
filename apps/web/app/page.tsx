export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="mx-auto w-full max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium tracking-widest text-violet-600 uppercase">
          JoyCue
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          Find something that fits your moment.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          JoyCue helps you find realistic things you can do right now based on
          your time, energy, interests, and current situation.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Start with one simple question
          </p>

          <p className="mt-2 text-xl font-medium text-slate-900">
            What can I do right now?
          </p>
        </div>
      </section>
    </main>
  );
}
