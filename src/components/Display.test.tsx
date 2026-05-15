import { render, screen } from '@testing-library/react'

import { type CalculatorState } from '../engine/types'
import Display from './Display'

function renderDisplay(overrides: Partial<CalculatorState> = {}) {
  return render(
    <Display
      currentEntry={overrides.currentEntry ?? '1234'}
      pendingExpression={overrides.pendingExpression ?? []}
      pendingOperator={overrides.pendingOperator ?? null}
      error={overrides.error ?? null}
    />
  )
}

describe('Display', () => {
  it('renders the current entry and pending expression labels', () => {
    renderDisplay({
      pendingExpression: [
        { kind: 'value', value: '12' },
        { kind: 'operator', value: '+' },
      ],
    })

    expect(
      screen.getByText('Calculator display', { selector: '#display-heading' })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Pending expression')).toHaveTextContent(
      '12 +'
    )
    expect(screen.getByLabelText('Current value')).toHaveTextContent('1234')
  })

  it('falls back to a readable label when no expression is pending', () => {
    renderDisplay()

    expect(screen.getByLabelText('Pending expression')).toHaveTextContent(
      'No pending expression'
    )
  })

  it('renders errors through the current value region', () => {
    renderDisplay({
      currentEntry: '0',
      error: 'Cannot divide by zero.',
    })

    expect(screen.getByLabelText('Current value')).toHaveTextContent(
      'Error: Cannot divide by zero.'
    )
  })

  it('applies the compact sizing class for long values', () => {
    renderDisplay({
      currentEntry: '12345678901234567',
    })

    expect(screen.getByLabelText('Current value')).toHaveClass(
      'text-3xl',
      'sm:text-4xl'
    )
  })
})
