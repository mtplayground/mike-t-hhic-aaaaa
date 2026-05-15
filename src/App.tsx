import { useReducer } from 'react'

import Display from './components/Display'
import { evaluateExpression, resolvePercentageValue } from './engine/evaluate'
import { calculatorReducer, reduceCalculatorActions } from './engine/reducer'
import {
  CALCULATOR_ACTION_TYPES,
  INITIAL_CALCULATOR_STATE,
  OPERATOR_LABELS,
} from './engine/types'

function App() {
  const appTitle = import.meta.env.VITE_APP_TITLE ?? 'Mike T HHIC AAAAA'
  const operatorNames = Object.values(OPERATOR_LABELS).join(', ')
  const [engineState] = useReducer(calculatorReducer, INITIAL_CALCULATOR_STATE)
  const precedenceExample = evaluateExpression([
    { kind: 'value', value: '2' },
    { kind: 'operator', value: '+' },
    { kind: 'value', value: '3' },
    { kind: 'operator', value: '*' },
    { kind: 'value', value: '4' },
  ])
  const percentageExample = resolvePercentageValue('10', {
    leftValue: '200',
    operator: '+',
  })
  const reducerPreview = reduceCalculatorActions([
    { type: 'digit', digit: '1' },
    { type: 'digit', digit: '2' },
    { type: 'operator', operator: '+' },
    { type: 'digit', digit: '3' },
  ])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur">
        <p className="mb-3 font-mono text-sm font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
          Issue 7 of 15
        </p>
        <h1>{appTitle}</h1>
        <p className="max-w-3xl text-base/7 text-[var(--muted)] sm:text-lg/8">
          This repository now runs on Vite, React, TypeScript, Tailwind, and a
          ready-to-use test harness. This step adds the first dedicated
          calculator UI primitive: an accessible display for the current entry
          and in-progress expression.
        </p>
      </section>

      <Display
        currentEntry={reducerPreview.currentEntry}
        pendingExpression={reducerPreview.pendingExpression}
        pendingOperator={reducerPreview.pendingOperator}
        error={reducerPreview.error}
      />

      <section
        className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur"
        aria-labelledby="engine-heading"
      >
        <h2 id="engine-heading">Engine preview</h2>
        <ul className="mt-4 grid gap-3 pl-5 text-[var(--muted)] marker:text-[var(--accent)]">
          <li>
            Initial reducer entry stays at{' '}
            <code>{engineState.currentEntry}</code>
          </li>
          <li>Pending operator starts unset and supports {operatorNames}</li>
          <li>
            {CALCULATOR_ACTION_TYPES.length} typed engine actions are modeled
            and now reduce into concrete state transitions
          </li>
          <li>
            Operator precedence example:{' '}
            <code>
              {precedenceExample.ok ? precedenceExample.value : 'error'}
            </code>
          </li>
          <li>
            Additive percentage example:{' '}
            <code>
              {percentageExample.ok ? percentageExample.value : 'error'}
            </code>
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
          <li>Connect percent and equals actions to reducer transitions</li>
          <li>Wire the display and keypad into the app shell</li>
          <li>
            Expose reducer state through interactive calculator components
          </li>
        </ol>
      </section>
    </main>
  )
}

export default App
