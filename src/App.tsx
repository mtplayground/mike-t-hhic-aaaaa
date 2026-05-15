import { useReducer } from 'react'

import Display from './components/Display'
import Keypad from './components/Keypad'
import { calculatorReducer } from './engine/reducer'
import { INITIAL_CALCULATOR_STATE } from './engine/types'

function App() {
  const appTitle = import.meta.env.VITE_APP_TITLE ?? 'Mike T HHIC AAAAA'
  const [engineState, dispatch] = useReducer(
    calculatorReducer,
    INITIAL_CALCULATOR_STATE
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-10 lg:justify-center">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:items-stretch">
        <section className="rounded-[2.25rem] border border-[color:var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-6">
          <div className="mb-5 border-b border-[color:var(--border)] pb-5">
            <p className="mb-3 font-mono text-sm font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
              Issue 9 of 15
            </p>
            <h1 className="max-w-2xl">{appTitle}</h1>
            <p className="max-w-2xl text-base/7 text-[var(--muted)] sm:text-lg/8">
              A responsive calculator shell assembled around the live engine
              reducer. The display and keypad now form the primary mobile-first
              interface.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(19rem,0.9fr)] xl:items-start">
            <Display
              currentEntry={engineState.currentEntry}
              pendingExpression={engineState.pendingExpression}
              pendingOperator={engineState.pendingOperator}
              error={engineState.error}
            />
            <Keypad dispatch={dispatch} />
          </div>
        </section>

        <aside className="rounded-[2.25rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
          <h2>App shell notes</h2>
          <ul className="mt-4 grid gap-3 pl-5 text-[var(--muted)] marker:text-[var(--accent)]">
            <li>
              Single-column stacking on mobile keeps the calculator readable.
            </li>
            <li>
              The layout shifts into a two-panel shell on larger screens for a
              more intentional desktop presentation.
            </li>
            <li>
              Display and keypad share the same reducer state, so button presses
              update the visible output immediately.
            </li>
          </ul>

          <div className="mt-6 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--display-bg)] p-5">
            <p className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
              Live state
            </p>
            <dl className="mt-4 grid gap-4 text-sm text-[var(--muted)]">
              <div>
                <dt className="font-semibold text-[var(--text-strong)]">
                  Current entry
                </dt>
                <dd className="mt-1 font-mono">{engineState.currentEntry}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--text-strong)]">
                  Pending operator
                </dt>
                <dd className="mt-1 font-mono">
                  {engineState.pendingOperator ?? 'None'}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--text-strong)]">
                  Entry mode
                </dt>
                <dd className="mt-1">
                  {engineState.waitingForOperand
                    ? 'Waiting for next operand'
                    : 'Editing current operand'}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default App
