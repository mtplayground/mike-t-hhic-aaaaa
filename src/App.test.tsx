import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('App', () => {
  function getDefinitionValue(term: string) {
    return screen.getByText(term).nextElementSibling
  }

  it('renders the configured application title', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Mike T HHIC AAAAA' })
    ).toBeInTheDocument()
  })

  it('renders the assembled calculator shell', () => {
    render(<App />)

    expect(
      screen.getByText('Calculator display', { selector: '#display-heading' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Calculator keypad', { selector: '#keypad-heading' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'App shell notes' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Keyboard input mirrors the on-screen controls for digits, operators, Enter, Escape, Backspace, and decimal entry.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Successful evaluations are now recorded in an in-memory session history for later recall.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Error states are announced more explicitly, and long values now expose a visible overflow hint instead of silently truncating the context.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Session history' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Calculator display' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Calculator keypad' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Completed calculations will appear here once you evaluate them.'
      )
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Pending expression')).toHaveTextContent(
      'No pending expression'
    )
    expect(screen.getByLabelText('Current value')).toHaveTextContent('0')
    expect(screen.getByText('History entries')).toBeInTheDocument()
    expect(getDefinitionValue('History entries')).toHaveTextContent('0')
  })

  it('updates the display when keypad actions are pressed', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Digit 1' }))
    await user.click(screen.getByRole('button', { name: 'Digit 2' }))
    await user.click(screen.getByRole('button', { name: 'add operator' }))
    await user.click(screen.getByRole('button', { name: 'Digit 3' }))

    expect(screen.getByLabelText('Pending expression')).toHaveTextContent(
      '12 +'
    )
    expect(screen.getByLabelText('Current value')).toHaveTextContent('3')
    expect(screen.getByText('Editing current operand')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Evaluate expression' })
    )
    expect(screen.getByLabelText('Current value')).toHaveTextContent('15')
    expect(getDefinitionValue('History entries')).toHaveTextContent('1')
    expect(
      screen.getByRole('button', { name: 'Recall 12 + 3 equals 15' })
    ).toBeInTheDocument()
  })

  it('recalls a recorded result from the history panel', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Digit 8' }))
    await user.click(screen.getByRole('button', { name: 'divide operator' }))
    await user.click(screen.getByRole('button', { name: 'Digit 2' }))
    await user.click(
      screen.getByRole('button', { name: 'Evaluate expression' })
    )
    await user.click(screen.getByRole('button', { name: 'Digit 9' }))

    expect(screen.getByLabelText('Current value')).toHaveTextContent('9')

    await user.click(
      screen.getByRole('button', { name: 'Recall 8 / 2 equals 4' })
    )

    expect(screen.getByLabelText('Current value')).toHaveTextContent('4')
    expect(screen.getByLabelText('Pending expression')).toHaveTextContent(
      'No pending expression'
    )
    expect(getDefinitionValue('History entries')).toHaveTextContent('1')
  })

  it('updates the display when keyboard actions are pressed', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.keyboard('12+3')

    expect(screen.getByLabelText('Pending expression')).toHaveTextContent(
      '12 +'
    )
    expect(screen.getByLabelText('Current value')).toHaveTextContent('3')

    await user.keyboard('{Enter}')
    expect(screen.getByLabelText('Current value')).toHaveTextContent('15')

    await user.keyboard('9')
    await user.keyboard('{Backspace}')
    expect(screen.getByLabelText('Current value')).toHaveTextContent('0')

    await user.keyboard('9')
    await user.keyboard('{Escape}')
    expect(screen.getByLabelText('Current value')).toHaveTextContent('0')
  })

  it('keeps the keypad buttons in a predictable tab order', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.tab()
    expect(
      screen.getByRole('button', { name: 'Clear calculator' })
    ).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Toggle sign' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Backspace' })).toHaveFocus()

    await user.tab()
    expect(
      screen.getByRole('button', { name: 'divide operator' })
    ).toHaveFocus()
  })

  it('announces divide-by-zero errors and preserves history after backspace recovery', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Digit 8' }))
    await user.click(screen.getByRole('button', { name: 'divide operator' }))
    await user.click(screen.getByRole('button', { name: 'Digit 2' }))
    await user.click(
      screen.getByRole('button', { name: 'Evaluate expression' })
    )
    await user.click(screen.getByRole('button', { name: 'Digit 8' }))
    await user.click(screen.getByRole('button', { name: 'divide operator' }))
    await user.click(screen.getByRole('button', { name: 'Digit 0' }))
    await user.click(
      screen.getByRole('button', { name: 'Evaluate expression' })
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Cannot divide by zero.'
    )
    expect(
      screen.getByText(
        'Cannot divide by zero. Press a digit or decimal to start over, or clear the calculator.'
      )
    ).toBeInTheDocument()
    expect(getDefinitionValue('History entries')).toHaveTextContent('1')

    await user.click(screen.getByRole('button', { name: 'Backspace' }))

    expect(screen.getByLabelText('Current value')).toHaveTextContent('0')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(getDefinitionValue('History entries')).toHaveTextContent('1')
  })
})
