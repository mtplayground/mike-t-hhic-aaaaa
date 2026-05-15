import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import Keypad from './Keypad'

describe('Keypad', () => {
  it('renders the calculator keypad controls', () => {
    const dispatch = vi.fn()

    render(<Keypad dispatch={dispatch} />)

    expect(
      screen.getByText('Calculator keypad', { selector: '#keypad-heading' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Digit 7' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Evaluate expression' })
    ).toBeInTheDocument()
  })

  it('dispatches digit, operator, decimal, sign, clear, backspace, and equals actions', async () => {
    const user = userEvent.setup()
    const dispatch = vi.fn()

    render(<Keypad dispatch={dispatch} />)

    await user.click(screen.getByRole('button', { name: 'Digit 7' }))
    await user.click(screen.getByRole('button', { name: '+ operator' }))
    await user.click(screen.getByRole('button', { name: 'Decimal point' }))
    await user.click(screen.getByRole('button', { name: 'Toggle sign' }))
    await user.click(screen.getByRole('button', { name: 'Backspace' }))
    await user.click(screen.getByRole('button', { name: 'Clear calculator' }))
    await user.click(
      screen.getByRole('button', { name: 'Evaluate expression' })
    )

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'digit', digit: '7' })
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'operator',
      operator: '+',
    })
    expect(dispatch).toHaveBeenNthCalledWith(3, { type: 'decimal' })
    expect(dispatch).toHaveBeenNthCalledWith(4, { type: 'sign' })
    expect(dispatch).toHaveBeenNthCalledWith(5, { type: 'backspace' })
    expect(dispatch).toHaveBeenNthCalledWith(6, { type: 'clear' })
    expect(dispatch).toHaveBeenNthCalledWith(7, { type: 'equals' })
  })

  it('renders zero as the double-width key', () => {
    const dispatch = vi.fn()

    render(<Keypad dispatch={dispatch} />)

    expect(screen.getByRole('button', { name: 'Digit 0' })).toHaveClass(
      'col-span-2'
    )
  })
})
