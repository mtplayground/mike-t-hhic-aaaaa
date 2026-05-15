import {
  CALCULATOR_ACTION_TYPES,
  INITIAL_CALCULATOR_STATE,
  OPERATOR_LABELS,
} from './engine/types'

function App() {
  const appTitle = import.meta.env.VITE_APP_TITLE ?? 'Mike T HHIC AAAAA'
  const operatorNames = Object.values(OPERATOR_LABELS).join(', ')

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur">
        <p className="mb-3 font-mono text-sm font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
          Issue 4 of 15
        </p>
        <h1>{appTitle}</h1>
        <p className="max-w-3xl text-base/7 text-[var(--muted)] sm:text-lg/8">
          This repository now runs on Vite, React, TypeScript, Tailwind, and a
          ready-to-use test harness. This step adds the calculator engine state
          model and typed action catalog that later reducer and UI work will
          build on top of.
        </p>
      </section>

      <section
        className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur"
        aria-labelledby="engine-heading"
      >
        <h2 id="engine-heading">Engine model foundation</h2>
        <ul className="mt-4 grid gap-3 pl-5 text-[var(--muted)] marker:text-[var(--accent)]">
          <li>
            Current entry defaults to{' '}
            <code>{INITIAL_CALCULATOR_STATE.currentEntry}</code>
          </li>
          <li>Pending expression starts empty until input is chained</li>
          <li>Pending operator starts unset and supports {operatorNames}</li>
          <li>
            {CALCULATOR_ACTION_TYPES.length} typed engine actions are modeled
            for input, editing, and evaluation flow
          </li>
        </ul>
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
          <li>Vitest and React Testing Library for fast component tests</li>
          <li>Playwright configured for end-to-end browser coverage</li>
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
          <li>Implement arithmetic evaluation with operator precedence</li>
          <li>Build the reducer around these engine actions</li>
          <li>Wire the display and keypad into the app shell</li>
        </ol>
      </section>
    </main>
  )
}

export default App
