import { evaluateExpression, resolvePercentageValue } from './evaluate'
import { type ExpressionToken } from './types'

function buildExpression(...tokens: ExpressionToken[]): ExpressionToken[] {
  return tokens
}

describe('evaluateExpression', () => {
  it('evaluates a single value expression', () => {
    expect(
      evaluateExpression(buildExpression({ kind: 'value', value: '42' }))
    ).toEqual({
      ok: true,
      value: '42',
    })
  })

  it('respects multiplication precedence over addition', () => {
    expect(
      evaluateExpression(
        buildExpression(
          { kind: 'value', value: '2' },
          { kind: 'operator', value: '+' },
          { kind: 'value', value: '3' },
          { kind: 'operator', value: '*' },
          { kind: 'value', value: '4' }
        )
      )
    ).toEqual({
      ok: true,
      value: '14',
    })
  })

  it('reduces chained operations from left to right within equal precedence', () => {
    expect(
      evaluateExpression(
        buildExpression(
          { kind: 'value', value: '20' },
          { kind: 'operator', value: '/' },
          { kind: 'value', value: '5' },
          { kind: 'operator', value: '*' },
          { kind: 'value', value: '3' }
        )
      )
    ).toEqual({
      ok: true,
      value: '12',
    })
  })

  it('guards divide-by-zero errors', () => {
    expect(
      evaluateExpression(
        buildExpression(
          { kind: 'value', value: '8' },
          { kind: 'operator', value: '/' },
          { kind: 'value', value: '0' }
        )
      )
    ).toEqual({
      ok: false,
      error: {
        code: 'divide-by-zero',
        message: 'Cannot divide by zero.',
      },
    })
  })

  it('rejects incomplete expressions', () => {
    expect(
      evaluateExpression(
        buildExpression(
          { kind: 'value', value: '8' },
          { kind: 'operator', value: '+' }
        )
      )
    ).toEqual({
      ok: false,
      error: {
        code: 'invalid-expression',
        message: 'Expression cannot end with an operator.',
      },
    })
  })
})

describe('resolvePercentageValue', () => {
  it('converts standalone percentages into decimal values', () => {
    expect(resolvePercentageValue('25')).toEqual({
      ok: true,
      value: '0.25',
    })
  })

  it('uses the left operand for additive percentage calculations', () => {
    expect(
      resolvePercentageValue('10', {
        leftValue: '200',
        operator: '+',
      })
    ).toEqual({
      ok: true,
      value: '20',
    })
  })

  it('keeps multiplicative percentages as normalized decimal values', () => {
    expect(
      resolvePercentageValue('10', {
        leftValue: '200',
        operator: '*',
      })
    ).toEqual({
      ok: true,
      value: '0.1',
    })
  })
})
