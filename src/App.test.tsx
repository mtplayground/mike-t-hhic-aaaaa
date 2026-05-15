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
    await user.click(screen.getByRole('button', { name: '+ operator' }))
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
})
