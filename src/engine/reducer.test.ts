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
    expect(state.history).toEqual([
      {
        id: 1,
        expression: '2 + 3 * 4',
        result: '14',
      },
    ])
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

  it('preserves session history when backspace clears an error state', () => {
    const state = runSequence([
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '2' },
      { type: 'equals' },
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '0' },
      { type: 'equals' },
      { type: 'backspace' },
    ])

    expect(state).toEqual({
      ...INITIAL_CALCULATOR_STATE,
      history: [
        {
          id: 1,
          expression: '8 / 2',
          result: '4',
        },
      ],
      nextHistoryId: 2,
    })
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
    expect(state.history).toEqual([])
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
      { type: 'equals' },
      { type: 'clear' },
    ])

    expect(state).toEqual({
      ...INITIAL_CALCULATOR_STATE,
      history: [
        {
          id: 1,
          expression: '7 + 5',
          result: '12',
        },
      ],
      nextHistoryId: 2,
    })
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
    expect(reducerState.history).toEqual([
      {
        id: 1,
        expression: '24 / 3 + 10',
        result: '18',
      },
    ])
  })

  it('can reduce one action at a time from the initial state', () => {
    const state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: 'digit',
      digit: '4',
    })

    expect(state.currentEntry).toBe('4')
    expect(state.waitingForOperand).toBe(false)
  })

  it('increments history across successful calculations in the same session', () => {
    const state = runSequence([
      { type: 'digit', digit: '2' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'equals' },
      { type: 'digit', digit: '9' },
      { type: 'operator', operator: '-' },
      { type: 'digit', digit: '4' },
      { type: 'equals' },
    ])

    expect(state.history).toEqual([
      {
        id: 1,
        expression: '2 + 3',
        result: '5',
      },
      {
        id: 2,
        expression: '9 - 4',
        result: '5',
      },
    ])
    expect(state.nextHistoryId).toBe(3)
  })

  it('preserves history when recovering from an error with new input', () => {
    const state = runSequence([
      { type: 'digit', digit: '2' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'equals' },
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '0' },
      { type: 'equals' },
      { type: 'digit', digit: '4' },
    ])

    expect(state.currentEntry).toBe('4')
    expect(state.error).toBeNull()
    expect(state.history).toEqual([
      {
        id: 1,
        expression: '2 + 3',
        result: '5',
      },
    ])
    expect(state.nextHistoryId).toBe(2)
  })

  it('recalls a history result into the current entry without clearing the session history', () => {
    const state = runSequence([
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '2' },
      { type: 'equals' },
      { type: 'digit', digit: '9' },
      { type: 'recall-history', entryId: 1 },
    ])

    expect(state.currentEntry).toBe('4')
    expect(state.pendingExpression).toEqual([])
    expect(state.pendingOperator).toBeNull()
    expect(state.waitingForOperand).toBe(true)
    expect(state.error).toBeNull()
    expect(state.history).toEqual([
      {
        id: 1,
        expression: '8 / 2',
        result: '4',
      },
    ])
    expect(state.nextHistoryId).toBe(2)
  })

  it('ignores recall actions for missing history entries', () => {
    const state = runSequence([{ type: 'recall-history', entryId: 999 }])

    expect(state).toEqual(INITIAL_CALCULATOR_STATE)
  })
})
