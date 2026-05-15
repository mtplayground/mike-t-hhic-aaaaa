import { evaluateExpression, type EvaluationFailure } from './evaluate'
import {
  INITIAL_CALCULATOR_STATE,
  type HistoryEntry,
  type CalculatorAction,
  type CalculatorOperator,
  type CalculatorState,
  type ExpressionToken,
} from './types'

function valueToken(value: string): ExpressionToken {
  return {
    kind: 'value',
    value,
  }
}

function operatorToken(value: CalculatorOperator): ExpressionToken {
  return {
    kind: 'operator',
    value,
  }
}

function clearError(state: CalculatorState): CalculatorState {
  if (!state.error) {
    return state
  }

  return {
    ...state,
    error: null,
  }
}

function resetCalculatorSessionState(state: CalculatorState): CalculatorState {
  return {
    ...INITIAL_CALCULATOR_STATE,
    history: state.history,
    nextHistoryId: state.nextHistoryId,
  }
}

function commitCurrentEntry(state: CalculatorState): ExpressionToken[] {
  const nextValue = valueToken(state.currentEntry)
  const lastToken = state.pendingExpression.at(-1)

  if (!lastToken) {
    return [nextValue]
  }

  if (lastToken.kind === 'operator') {
    return [...state.pendingExpression, nextValue]
  }

  return [...state.pendingExpression.slice(0, -1), nextValue]
}

function replaceTrailingOperator(
  expression: ExpressionToken[],
  operator: CalculatorOperator
): ExpressionToken[] {
  if (expression.at(-1)?.kind === 'operator') {
    return [...expression.slice(0, -1), operatorToken(operator)]
  }

  return [...expression, operatorToken(operator)]
}

function formatExpression(tokens: ExpressionToken[]): string {
  return tokens.map((token) => token.value).join(' ')
}

function buildHistoryEntry(
  state: CalculatorState,
  expression: ExpressionToken[],
  result: string
): HistoryEntry {
  return {
    id: state.nextHistoryId,
    expression: formatExpression(expression),
    result,
  }
}

function applyEvaluationFailure(
  state: CalculatorState,
  failure: EvaluationFailure
): CalculatorState {
  return {
    ...state,
    error: failure.error.message,
    waitingForOperand: true,
  }
}

function handleDigit(state: CalculatorState, digit: string): CalculatorState {
  const baseState = state.error
    ? resetCalculatorSessionState(state)
    : clearError(state)

  if (baseState.waitingForOperand) {
    return {
      ...baseState,
      currentEntry: digit,
      waitingForOperand: false,
    }
  }

  if (baseState.currentEntry === '0') {
    return {
      ...baseState,
      currentEntry: digit,
    }
  }

  if (baseState.currentEntry === '-0') {
    return {
      ...baseState,
      currentEntry: `-${digit}`,
    }
  }

  return {
    ...baseState,
    currentEntry: `${baseState.currentEntry}${digit}`,
  }
}

function handleDecimal(state: CalculatorState): CalculatorState {
  const baseState = state.error
    ? resetCalculatorSessionState(state)
    : clearError(state)

  if (baseState.waitingForOperand) {
    return {
      ...baseState,
      currentEntry: '0.',
      waitingForOperand: false,
    }
  }

  if (baseState.currentEntry.includes('.')) {
    return baseState
  }

  return {
    ...baseState,
    currentEntry: `${baseState.currentEntry}.`,
  }
}

function handleSign(state: CalculatorState): CalculatorState {
  if (state.error || state.currentEntry === '0') {
    return state
  }

  return {
    ...state,
    currentEntry: state.currentEntry.startsWith('-')
      ? state.currentEntry.slice(1)
      : `-${state.currentEntry}`,
  }
}

function handleBackspace(state: CalculatorState): CalculatorState {
  if (state.error) {
    return resetCalculatorSessionState(state)
  }

  if (state.waitingForOperand) {
    return state
  }

  const nextEntry = state.currentEntry.slice(0, -1)

  return {
    ...state,
    currentEntry: nextEntry === '' || nextEntry === '-' ? '0' : nextEntry,
  }
}

function handleOperator(
  state: CalculatorState,
  operator: CalculatorOperator
): CalculatorState {
  if (state.error) {
    return state
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      pendingExpression: replaceTrailingOperator(
        state.pendingExpression,
        operator
      ),
      pendingOperator: operator,
    }
  }

  const pendingExpression = replaceTrailingOperator(
    commitCurrentEntry(state),
    operator
  )

  return {
    ...state,
    pendingExpression,
    pendingOperator: operator,
    waitingForOperand: true,
    error: null,
  }
}

function handleEquals(state: CalculatorState): CalculatorState {
  if (state.error) {
    return state
  }

  const expression = commitCurrentEntry(state)

  if (expression.length === 1 && state.pendingOperator === null) {
    return {
      ...state,
      pendingExpression: expression,
      waitingForOperand: true,
    }
  }

  if (expression.at(-1)?.kind !== 'value') {
    return state
  }

  const evaluation = evaluateExpression(expression)

  if (!evaluation.ok) {
    return applyEvaluationFailure(state, evaluation)
  }

  const historyEntry = buildHistoryEntry(state, expression, evaluation.value)

  return {
    currentEntry: evaluation.value,
    pendingExpression: [],
    pendingOperator: null,
    waitingForOperand: true,
    error: null,
    history: [...state.history, historyEntry],
    nextHistoryId: state.nextHistoryId + 1,
  }
}

function handleRecallHistory(
  state: CalculatorState,
  entryId: number
): CalculatorState {
  const historyEntry = state.history.find((entry) => entry.id === entryId)

  if (!historyEntry) {
    return state
  }

  return {
    ...resetCalculatorSessionState(state),
    currentEntry: historyEntry.result,
    waitingForOperand: true,
  }
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'digit':
      return handleDigit(state, action.digit)
    case 'operator':
      return handleOperator(state, action.operator)
    case 'decimal':
      return handleDecimal(state)
    case 'sign':
      return handleSign(state)
    case 'clear':
      return resetCalculatorSessionState(state)
    case 'backspace':
      return handleBackspace(state)
    case 'equals':
      return handleEquals(state)
    case 'recall-history':
      return handleRecallHistory(state, action.entryId)
  }
}

export function reduceCalculatorActions(
  actions: CalculatorAction[],
  initialState: CalculatorState = INITIAL_CALCULATOR_STATE
): CalculatorState {
  return actions.reduce(calculatorReducer, initialState)
}
