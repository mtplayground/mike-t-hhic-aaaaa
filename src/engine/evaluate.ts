import { type CalculatorOperator, type ExpressionToken } from './types'

export type EvaluationErrorCode =
  | 'divide-by-zero'
  | 'invalid-expression'
  | 'invalid-number'

export interface EvaluationSuccess {
  ok: true
  value: string
}

export interface EvaluationFailure {
  ok: false
  error: {
    code: EvaluationErrorCode
    message: string
  }
}

export type EvaluationResult = EvaluationSuccess | EvaluationFailure

export interface PercentageContext {
  leftValue?: string | null
  operator?: CalculatorOperator | null
}

const PRECEDENCE: Record<CalculatorOperator, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
}

function success(value: number): EvaluationSuccess {
  return {
    ok: true,
    value: formatNumber(value),
  }
}

function failure(
  code: EvaluationErrorCode,
  message: string
): EvaluationFailure {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  }
}

function parseNumericValue(rawValue: string): EvaluationResult | number {
  const numericValue = Number(rawValue)

  if (!Number.isFinite(numericValue)) {
    return failure('invalid-number', `Invalid numeric value: ${rawValue}`)
  }

  return numericValue
}

function formatNumber(value: number): string {
  if (Object.is(value, -0)) {
    return '0'
  }

  const normalizedValue = Number.parseFloat(value.toPrecision(12))

  return normalizedValue.toString()
}

function applyOperation(
  leftValue: number,
  operator: CalculatorOperator,
  rightValue: number
): EvaluationResult | number {
  if (operator === '/' && rightValue === 0) {
    return failure('divide-by-zero', 'Cannot divide by zero.')
  }

  switch (operator) {
    case '+':
      return leftValue + rightValue
    case '-':
      return leftValue - rightValue
    case '*':
      return leftValue * rightValue
    case '/':
      return leftValue / rightValue
  }
}

export function resolvePercentageValue(
  value: string,
  context: PercentageContext = {}
): EvaluationResult {
  const numericValue = parseNumericValue(value)

  if (typeof numericValue !== 'number') {
    return numericValue
  }

  const percentageValue = numericValue / 100

  if (
    context.leftValue &&
    (context.operator === '+' || context.operator === '-')
  ) {
    const leftValue = parseNumericValue(context.leftValue)

    if (typeof leftValue !== 'number') {
      return leftValue
    }

    return success(leftValue * percentageValue)
  }

  return success(percentageValue)
}

export function evaluateExpression(
  tokens: ExpressionToken[]
): EvaluationResult {
  if (tokens.length === 0) {
    return failure('invalid-expression', 'Expression is empty.')
  }

  if (tokens.length % 2 === 0) {
    return failure(
      'invalid-expression',
      'Expression cannot end with an operator.'
    )
  }

  const values: number[] = []
  const operators: CalculatorOperator[] = []

  for (const [index, token] of tokens.entries()) {
    const expectsValue = index % 2 === 0

    if (expectsValue && token.kind !== 'value') {
      return failure(
        'invalid-expression',
        'Expression tokens must alternate between values and operators.'
      )
    }

    if (!expectsValue && token.kind !== 'operator') {
      return failure(
        'invalid-expression',
        'Expression tokens must alternate between values and operators.'
      )
    }

    if (token.kind === 'value') {
      const parsedValue = parseNumericValue(token.value)

      if (typeof parsedValue !== 'number') {
        return parsedValue
      }

      values.push(parsedValue)
      continue
    }

    while (
      operators.length > 0 &&
      PRECEDENCE[operators.at(-1)!] >= PRECEDENCE[token.value]
    ) {
      const rightValue = values.pop()
      const leftValue = values.pop()
      const previousOperator = operators.pop()

      if (
        rightValue === undefined ||
        leftValue === undefined ||
        previousOperator === undefined
      ) {
        return failure(
          'invalid-expression',
          'Expression could not be reduced safely.'
        )
      }

      const reducedValue = applyOperation(
        leftValue,
        previousOperator,
        rightValue
      )

      if (typeof reducedValue !== 'number') {
        return reducedValue
      }

      values.push(reducedValue)
    }

    operators.push(token.value)
  }

  while (operators.length > 0) {
    const rightValue = values.pop()
    const leftValue = values.pop()
    const operator = operators.pop()

    if (
      rightValue === undefined ||
      leftValue === undefined ||
      operator === undefined
    ) {
      return failure(
        'invalid-expression',
        'Expression could not be reduced safely.'
      )
    }

    const reducedValue = applyOperation(leftValue, operator, rightValue)

    if (typeof reducedValue !== 'number') {
      return reducedValue
    }

    values.push(reducedValue)
  }

  if (values.length !== 1) {
    return failure(
      'invalid-expression',
      'Expression reduced to an unexpected number of values.'
    )
  }

  return success(values[0])
}
