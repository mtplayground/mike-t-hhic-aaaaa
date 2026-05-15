import { evaluateExpression } from './evaluate'
import { calculatorReducer, reduceCalculatorActions } from './reducer'
import { INITIAL_CALCULATOR_STATE, type CalculatorAction } from './types'

function runSequence(actions: CalculatorAction[]) {
  return reduceCalculatorActions(actions)
}

describe('calculatorReducer', () => {
  it('builds a multi-digit current entry', () => {
    expect(
      runSequence([
        { type: 'digit', digit: '1' },
        { type: 'digit', digit: '2' },
        { type: 'digit', digit: '3' },
      ])
    ).toMatchObject({
      currentEntry: '123',
      pendingExpression: [],
      pendingOperator: null,
      waitingForOperand: false,
      error: null,
    })
  })

  it('evaluates arithmetic with operator precedence', () => {
    const state = runSequence([
      { type: 'digit', digit: '2' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'operator', operator: '*' },
      { type: 'digit', digit: '4' },
      { type: 'equals' },
    ])

    expect(state.currentEntry).toBe('14')
    expect(state.pendingExpression).toEqual([])
    expect(state.pendingOperator).toBeNull()
    expect(state.waitingForOperand).toBe(true)
    expect(state.error).toBeNull()
  })

  it('replaces a trailing operator before the next operand is entered', () => {
    const state = runSequence([
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '+' },
      { type: 'operator', operator: '-' },
      { type: 'digit', digit: '3' },
      { type: 'equals' },
    ])

    expect(state.currentEntry).toBe('5')
  })

  it('supports decimal entry and sign toggling', () => {
    const state = runSequence([
      { type: 'digit', digit: '1' },
      { type: 'decimal' },
      { type: 'digit', digit: '5' },
      { type: 'sign' },
    ])

    expect(state.currentEntry).toBe('-1.5')
  })

  it('backs down to zero when the current entry is cleared by backspace', () => {
    const state = runSequence([
      { type: 'digit', digit: '9' },
      { type: 'backspace' },
    ])

    expect(state.currentEntry).toBe('0')
  })

  it('guards divide-by-zero errors without throwing', () => {
    const state = runSequence([
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '0' },
      { type: 'equals' },
    ])

    expect(state.error).toBe('Cannot divide by zero.')
    expect(state.pendingOperator).toBe('/')
    expect(state.currentEntry).toBe('0')
  })

  it('starts a new entry when a digit is typed after equals', () => {
    const state = runSequence([
      { type: 'digit', digit: '7' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '5' },
      { type: 'equals' },
      { type: 'digit', digit: '3' },
    ])

    expect(state.currentEntry).toBe('3')
    expect(state.pendingExpression).toEqual([])
  })

  it('clears back to the initial engine state', () => {
    const state = runSequence([
      { type: 'digit', digit: '7' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '5' },
      { type: 'clear' },
    ])

    expect(state).toEqual(INITIAL_CALCULATOR_STATE)
  })

  it('keeps single-value equals presses stable', () => {
    const state = runSequence([
      { type: 'digit', digit: '9' },
      { type: 'equals' },
    ])

    expect(state.currentEntry).toBe('9')
    expect(state.waitingForOperand).toBe(true)
  })

  it('matches the pure evaluator on a chained expression', () => {
    const reducerState = runSequence([
      { type: 'digit', digit: '2' },
      { type: 'digit', digit: '4' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '3' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '1' },
      { type: 'digit', digit: '0' },
      { type: 'equals' },
    ])

    const evaluation = evaluateExpression([
      { kind: 'value', value: '24' },
      { kind: 'operator', value: '/' },
      { kind: 'value', value: '3' },
      { kind: 'operator', value: '+' },
      { kind: 'value', value: '10' },
    ])

    expect(evaluation.ok).toBe(true)
    expect(reducerState.currentEntry).toBe(
      evaluation.ok ? evaluation.value : ''
    )
  })

  it('can reduce one action at a time from the initial state', () => {
    const state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: 'digit',
      digit: '4',
    })

    expect(state.currentEntry).toBe('4')
    expect(state.waitingForOperand).toBe(false)
  })
})
