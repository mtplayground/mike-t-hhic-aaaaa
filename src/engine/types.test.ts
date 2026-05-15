import {
  CALCULATOR_ACTION_TYPES,
  CALCULATOR_OPERATORS,
  INITIAL_CALCULATOR_STATE,
  isCalculatorOperator,
  isDigitCharacter,
  type CalculatorAction,
} from './types'

describe('calculator engine types', () => {
  it('defines the expected initial calculator state', () => {
    expect(INITIAL_CALCULATOR_STATE).toEqual({
      currentEntry: '0',
      pendingExpression: [],
      pendingOperator: null,
      waitingForOperand: false,
      error: null,
    })
  })

  it('accepts each supported calculator action shape', () => {
    const actions: CalculatorAction[] = [
      { type: 'digit', digit: '7' },
      { type: 'operator', operator: '+' },
      { type: 'decimal' },
      { type: 'sign' },
      { type: 'clear' },
      { type: 'backspace' },
      { type: 'equals' },
    ]

    expect(actions.map((action) => action.type)).toEqual(
      CALCULATOR_ACTION_TYPES
    )
  })

  it('guards valid digits and operators', () => {
    expect(
      CALCULATOR_OPERATORS.every((operator) => isCalculatorOperator(operator))
    ).toBe(true)
    expect(isCalculatorOperator('%')).toBe(false)
    expect(isDigitCharacter('4')).toBe(true)
    expect(isDigitCharacter('x')).toBe(false)
  })
})
