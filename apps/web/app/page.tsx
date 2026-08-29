import { AuthStatus } from "@/components/auth-status";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl justify-end">
        <AuthStatus />
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl items-center justify-center text-center">
        <div>
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
        </div>
      </section>
    </main>
  );
}
