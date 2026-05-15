import { type Dispatch } from 'react'

import { type CalculatorAction, type HistoryEntry } from '../engine/types'

export interface HistoryPanelProps {
  history: HistoryEntry[]
  dispatch: Dispatch<CalculatorAction>
}

export function HistoryPanel({ history, dispatch }: HistoryPanelProps) {
  return (
    <section
      className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8"
      aria-labelledby="history-heading"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2
            id="history-heading"
            className="font-mono text-sm font-bold tracking-[0.22em] text-[var(--accent)] uppercase"
          >
            Session history
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Recall a previous result back into the display
          </p>
        </div>
        <div className="rounded-full bg-[var(--code-bg)] px-3 py-1 font-mono text-xs font-semibold text-[var(--muted)]">
          {history.length}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[color:var(--display-bg)] px-4 py-6 text-sm text-[var(--muted)]">
          Completed calculations will appear here once you evaluate them.
        </div>
      ) : (
        <div
          className="max-h-80 space-y-3 overflow-y-auto pr-1"
          aria-label="History entries"
        >
          {history
            .slice()
            .reverse()
            .map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="block w-full rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--display-bg)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                aria-label={`Recall ${entry.expression} equals ${entry.result}`}
                onClick={() =>
                  dispatch({ type: 'recall-history', entryId: entry.id })
                }
              >
                <p className="truncate font-mono text-xs tracking-[0.16em] text-[var(--muted)] uppercase">
                  {entry.expression}
                </p>
                <p className="mt-2 font-mono text-2xl font-semibold text-[var(--text-strong)]">
                  {entry.result}
                </p>
              </button>
            ))}
        </div>
      )}
    </section>
  )
}

export default HistoryPanel
