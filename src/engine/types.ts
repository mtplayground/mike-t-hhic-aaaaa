export const DIGIT_CHARACTERS = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
] as const

export type DigitCharacter = (typeof DIGIT_CHARACTERS)[number]

export const CALCULATOR_OPERATORS = ['+', '-', '*', '/'] as const

export type CalculatorOperator = (typeof CALCULATOR_OPERATORS)[number]

export const CALCULATOR_ACTION_TYPES = [
  'digit',
  'operator',
  'decimal',
  'sign',
  'clear',
  'backspace',
  'equals',
  'recall-history',
] as const

export type CalculatorActionType = (typeof CALCULATOR_ACTION_TYPES)[number]

export type ExpressionToken =
  | {
      kind: 'value'
      value: string
    }
  | {
      kind: 'operator'
      value: CalculatorOperator
    }

export interface HistoryEntry {
  id: number
  expression: string
  result: string
}

export interface CalculatorState {
  currentEntry: string
  pendingExpression: ExpressionToken[]
  pendingOperator: CalculatorOperator | null
  waitingForOperand: boolean
  error: string | null
  history: HistoryEntry[]
  nextHistoryId: number
}

export type DigitAction = {
  type: 'digit'
  digit: DigitCharacter
}

export type OperatorAction = {
  type: 'operator'
  operator: CalculatorOperator
}

export type DecimalAction = {
  type: 'decimal'
}

export type SignAction = {
  type: 'sign'
}

export type ClearAction = {
  type: 'clear'
}

export type BackspaceAction = {
  type: 'backspace'
}

export type EqualsAction = {
  type: 'equals'
}

export type RecallHistoryAction = {
  type: 'recall-history'
  entryId: number
}

export type CalculatorAction =
  | DigitAction
  | OperatorAction
  | DecimalAction
  | SignAction
  | ClearAction
  | BackspaceAction
  | EqualsAction
  | RecallHistoryAction

export const OPERATOR_LABELS: Record<CalculatorOperator, string> = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
}

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  currentEntry: '0',
  pendingExpression: [],
  pendingOperator: null,
  waitingForOperand: false,
  error: null,
  history: [],
  nextHistoryId: 1,
}

export function isDigitCharacter(value: string): value is DigitCharacter {
  return DIGIT_CHARACTERS.includes(value as DigitCharacter)
}

export function isCalculatorOperator(
  value: string
): value is CalculatorOperator {
  return CALCULATOR_OPERATORS.includes(value as CalculatorOperator)
}
