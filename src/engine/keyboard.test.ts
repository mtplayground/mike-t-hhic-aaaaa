import { getActionForKeyboardEvent, getActionForKeyboardKey } from './keyboard'

describe('getActionForKeyboardKey', () => {
  it('maps digits to digit actions', () => {
    expect(getActionForKeyboardKey('7')).toEqual({
      type: 'digit',
      digit: '7',
    })
  })

  it('maps operators and decimal keys', () => {
    expect(getActionForKeyboardKey('+')).toEqual({
      type: 'operator',
      operator: '+',
    })
    expect(getActionForKeyboardKey('.')).toEqual({
      type: 'decimal',
    })
  })

  it('maps control keys to reducer actions', () => {
    expect(getActionForKeyboardKey('Enter')).toEqual({
      type: 'equals',
    })
    expect(getActionForKeyboardKey('Escape')).toEqual({
      type: 'clear',
    })
    expect(getActionForKeyboardKey('Backspace')).toEqual({
      type: 'backspace',
    })
  })

  it('returns null for unsupported keys', () => {
    expect(getActionForKeyboardKey('%')).toBeNull()
    expect(getActionForKeyboardKey('a')).toBeNull()
  })
})

describe('getActionForKeyboardEvent', () => {
  it('ignores modified key combinations', () => {
    expect(
      getActionForKeyboardEvent({
        key: '1',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        target: null,
      })
    ).toBeNull()
  })

  it('ignores editable element targets', () => {
    const input = document.createElement('input')

    expect(
      getActionForKeyboardEvent({
        key: '1',
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        target: input,
      })
    ).toBeNull()
  })
})
