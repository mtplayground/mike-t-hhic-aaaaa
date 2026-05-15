import { type Dispatch } from 'react'

import {
  type CalculatorAction,
  type CalculatorOperator,
  type DigitCharacter,
} from '../engine/types'

export interface KeypadProps {
  dispatch: Dispatch<CalculatorAction>
}

interface KeyConfig {
  label: string
  ariaLabel: string
  span?: 'double'
  tone?: 'default' | 'accent' | 'utility'
  action: CalculatorAction
}

const DIGIT_KEYS: DigitCharacter[] = [
  '7',
  '8',
  '9',
  '4',
  '5',
  '6',
  '1',
  '2',
  '3',
  '0',
]

const OPERATOR_KEYS: Array<{
  label: string
  operator: CalculatorOperator
}> = [
  { label: '÷', operator: '/' },
  { label: '×', operator: '*' },
  { label: '−', operator: '-' },
  { label: '+', operator: '+' },
]

const KEY_LAYOUT: KeyConfig[] = [
  {
    label: 'AC',
    ariaLabel: 'Clear calculator',
    tone: 'utility',
    action: { type: 'clear' },
  },
  {
    label: '±',
    ariaLabel: 'Toggle sign',
    tone: 'utility',
    action: { type: 'sign' },
  },
  {
    label: '⌫',
    ariaLabel: 'Backspace',
    tone: 'utility',
    action: { type: 'backspace' },
  },
  ...OPERATOR_KEYS.map((key) => ({
    label: key.label,
    ariaLabel: `${key.operator} operator`,
    tone: 'accent' as const,
    action: { type: 'operator' as const, operator: key.operator },
  })),
  ...DIGIT_KEYS.map((digit) => ({
    label: digit,
    ariaLabel: `Digit ${digit}`,
    span: digit === '0' ? ('double' as const) : undefined,
    action: { type: 'digit' as const, digit },
  })),
  {
    label: '.',
    ariaLabel: 'Decimal point',
    action: { type: 'decimal' },
  },
  {
    label: '=',
    ariaLabel: 'Evaluate expression',
    tone: 'accent',
    action: { type: 'equals' },
  },
]

function getButtonClasses(tone: KeyConfig['tone'] = 'default'): string {
  switch (tone) {
    case 'accent':
      return 'bg-[var(--accent)] text-white shadow-[0_12px_30px_-18px_rgba(164,75,33,0.9)]'
    case 'utility':
      return 'bg-[color:var(--code-bg)] text-[var(--text-strong)]'
    default:
      return 'bg-[color:var(--display-bg)] text-[var(--text-strong)]'
  }
}

export function Keypad({ dispatch }: KeypadProps) {
  return (
    <section
      className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8"
      aria-labelledby="keypad-heading"
    >
      <div className="mb-4">
        <p
          id="keypad-heading"
          className="font-mono text-sm font-bold tracking-[0.22em] text-[var(--accent)] uppercase"
        >
          Calculator keypad
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Action buttons wired to the calculator reducer
        </p>
      </div>

      <div
        className="grid grid-cols-4 gap-3"
        role="group"
        aria-label="Calculator keys"
      >
        {KEY_LAYOUT.map((key) => (
          <button
            key={`${key.label}-${key.ariaLabel}`}
            type="button"
            className={`flex min-h-16 items-center justify-center rounded-[1.25rem] border border-[color:var(--border)] px-4 py-4 font-mono text-2xl font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${key.span === 'double' ? 'col-span-2' : ''} ${getButtonClasses(key.tone)}`}
            aria-label={key.ariaLabel}
            onClick={() => dispatch(key.action)}
          >
            {key.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Keypad
