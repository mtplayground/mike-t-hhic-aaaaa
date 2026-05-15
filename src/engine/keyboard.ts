import {
  isCalculatorOperator,
  isDigitCharacter,
  type CalculatorAction,
} from './types'

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  )
}

export function getActionForKeyboardKey(key: string): CalculatorAction | null {
  if (isDigitCharacter(key)) {
    return {
      type: 'digit',
      digit: key,
    }
  }

  if (isCalculatorOperator(key)) {
    return {
      type: 'operator',
      operator: key,
    }
  }

  switch (key) {
    case '.':
      return { type: 'decimal' }
    case 'Enter':
    case '=':
      return { type: 'equals' }
    case 'Escape':
      return { type: 'clear' }
    case 'Backspace':
      return { type: 'backspace' }
    default:
      return null
  }
}

export function getActionForKeyboardEvent(
  event: Pick<
    KeyboardEvent,
    'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'target'
  >
): CalculatorAction | null {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return null
  }

  if (isEditableTarget(event.target)) {
    return null
  }

  return getActionForKeyboardKey(event.key)
}
