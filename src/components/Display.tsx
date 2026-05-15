import { type CalculatorState, type ExpressionToken } from '../engine/types'

export interface DisplayProps {
  currentEntry: CalculatorState['currentEntry']
  pendingExpression: CalculatorState['pendingExpression']
  pendingOperator: CalculatorState['pendingOperator']
  error: CalculatorState['error']
}

function formatExpression(tokens: ExpressionToken[]): string {
  return tokens.map((token) => token.value).join(' ')
}

function getEntrySizingClass(currentEntry: string): string {
  if (currentEntry.length > 16) {
    return 'text-3xl sm:text-4xl'
  }

  if (currentEntry.length > 10) {
    return 'text-4xl sm:text-5xl'
  }

  return 'text-5xl sm:text-6xl'
}

export function Display({
  currentEntry,
  pendingExpression,
  pendingOperator,
  error,
}: DisplayProps) {
  const expression = formatExpression(pendingExpression)
  const expressionLabel =
    expression || (pendingOperator ? pendingOperator : 'No pending expression')
  const entryLabel = error ? `Error: ${error}` : currentEntry
  const entrySizingClass = getEntrySizingClass(currentEntry)

  return (
    <section
      className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8"
      aria-labelledby="display-heading"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p
            id="display-heading"
            className="font-mono text-sm font-bold tracking-[0.22em] text-[var(--accent)] uppercase"
          >
            Calculator display
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Current entry and in-progress expression preview
          </p>
        </div>
        <div
          className="max-w-[12rem] overflow-x-auto rounded-full bg-[var(--code-bg)] px-3 py-1 font-mono text-xs whitespace-nowrap text-[var(--muted)]"
          aria-label="Pending expression"
          title={expressionLabel}
        >
          {expressionLabel}
        </div>
      </div>

      <div
        className="overflow-x-auto rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--display-bg)] px-4 py-5 text-right shadow-inner sm:px-6"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="mb-3 text-xs tracking-[0.18em] text-[var(--muted)] uppercase">
          Current entry
        </p>
        <p
          className={`min-w-max font-mono leading-none font-semibold tracking-[-0.04em] text-[var(--text-strong)] ${entrySizingClass}`}
          aria-label="Current value"
          title={entryLabel}
        >
          {entryLabel}
        </p>
      </div>
    </section>
  )
}

export default Display
