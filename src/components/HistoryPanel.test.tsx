import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import HistoryPanel from './HistoryPanel'

describe('HistoryPanel', () => {
  it('renders an empty state when no calculations have been recorded', () => {
    const dispatch = vi.fn()

    render(<HistoryPanel history={[]} dispatch={dispatch} />)

    expect(
      screen.getByRole('heading', { name: 'Session history' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Completed calculations will appear here once you evaluate them.'
      )
    ).toBeInTheDocument()
  })

  it('renders history entries in reverse chronological order and recalls one on click', async () => {
    const user = userEvent.setup()
    const dispatch = vi.fn()

    render(
      <HistoryPanel
        history={[
          { id: 1, expression: '2 + 3', result: '5' },
          { id: 2, expression: '9 - 4', result: '5' },
        ]}
        dispatch={dispatch}
      />
    )

    const buttons = screen.getAllByRole('button')

    expect(buttons[0]).toHaveAccessibleName('Recall 9 - 4 equals 5')
    expect(buttons[1]).toHaveAccessibleName('Recall 2 + 3 equals 5')

    await user.click(buttons[0])

    expect(dispatch).toHaveBeenCalledWith({
      type: 'recall-history',
      entryId: 2,
    })
  })
})
