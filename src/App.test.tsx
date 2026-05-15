import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('renders the configured application title', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Mike T HHIC AAAAA' })
    ).toBeInTheDocument()
  })

  it('describes the available test tooling', () => {
    render(<App />)

    expect(
      screen.getByText(
        'Vitest and React Testing Library for fast component tests'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText('Playwright configured for end-to-end browser coverage')
    ).toBeInTheDocument()
  })

  it('summarizes the engine state model', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Reducer foundation' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Pending expression captures chained operands and operators'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(/typed engine actions are modeled and now reduce/)
    ).toBeInTheDocument()
  })

  it('summarizes the evaluation examples', () => {
    render(<App />)

    expect(screen.getByText('Operator precedence example:')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })
})
