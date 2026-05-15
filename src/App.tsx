function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur">
        <p className="mb-3 font-mono text-sm font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
          Issue 2 of 15
        </p>
        <h1>Tailwind, ESLint, and Prettier are configured</h1>
        <p className="max-w-3xl text-base/7 text-[var(--muted)] sm:text-lg/8">
          This repository now runs on Vite, React, and TypeScript. Later issues
          will add the calculator engine, UI components, history, and test
          coverage on top of this foundation.
        </p>
      </section>

      <section
        className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur"
        aria-labelledby="tooling-heading"
      >
        <h2 id="tooling-heading">Current tooling</h2>
        <ul className="mt-4 grid gap-3 pl-5 text-[var(--muted)] marker:text-[var(--accent)]">
          <li>Vite for local development and production builds</li>
          <li>React 19 with a TypeScript entrypoint</li>
          <li>
            Tailwind CSS for utility-first styling and shared design tokens
          </li>
          <li>ESLint and Prettier base configs for consistent code quality</li>
          <li>
            Dev server bound to <code>0.0.0.0:8080</code>
          </li>
        </ul>
      </section>

      <section
        className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur"
        aria-labelledby="next-heading"
      >
        <h2 id="next-heading">Next implementation milestones</h2>
        <ol className="mt-4 grid list-decimal gap-3 pl-5 text-[var(--muted)] marker:text-[var(--accent)]">
          <li>Install styling, linting, and formatting conventions</li>
          <li>Define the calculator engine state and actions</li>
          <li>Build the display, keypad, and app shell</li>
        </ol>
      </section>
    </main>
  )
}

export default App
