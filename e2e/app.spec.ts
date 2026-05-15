import { expect, test, type Page } from '@playwright/test'

async function expectCurrentValue(page: Page, value: string) {
  await expect(page.getByLabel('Current value')).toHaveText(value)
}

async function expectPendingExpression(page: Page, value: string) {
  await expect(page.getByLabel('Pending expression')).toHaveText(value)
}

async function clickKeys(page: Page, labels: string[]) {
  for (const label of labels) {
    await page.getByRole('button', { name: label }).click()
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('evaluates chained arithmetic with operator precedence', async ({
  page,
}) => {
  await expect(
    page.getByRole('heading', { name: 'Mike T HHIC AAAAA' })
  ).toBeVisible()

  await clickKeys(page, [
    'Digit 2',
    'add operator',
    'Digit 3',
    'multiply operator',
    'Digit 4',
    'Evaluate expression',
  ])

  await expectCurrentValue(page, '14')
  await expectPendingExpression(page, 'No pending expression')
  await expect(
    page.getByRole('button', { name: 'Recall 2 + 3 * 4 equals 14' })
  ).toBeVisible()
})

test('mirrors keypad arithmetic through keyboard input', async ({ page }) => {
  await page.locator('main').click()

  await page.keyboard.type('12+3')
  await expectPendingExpression(page, '12 +')
  await expectCurrentValue(page, '3')

  await page.keyboard.press('Enter')
  await expectCurrentValue(page, '15')

  await page.keyboard.type('9')
  await expectCurrentValue(page, '9')
  await page.keyboard.press('Backspace')
  await expectCurrentValue(page, '0')

  await page.keyboard.type('7')
  await expectCurrentValue(page, '7')
  await page.keyboard.press('Escape')
  await expectCurrentValue(page, '0')
  await expectPendingExpression(page, 'No pending expression')
})

test('recalls a previous history result into the display', async ({ page }) => {
  await clickKeys(page, [
    'Digit 8',
    'divide operator',
    'Digit 2',
    'Evaluate expression',
    'Digit 9',
  ])

  await expectCurrentValue(page, '9')

  await page.getByRole('button', { name: 'Recall 8 / 2 equals 4' }).click()

  await expectCurrentValue(page, '4')
  await expectPendingExpression(page, 'No pending expression')
  await expect(
    page.getByRole('button', { name: 'Recall 8 / 2 equals 4' })
  ).toBeVisible()
})

test('supports backspace editing and clear reset from the keypad', async ({
  page,
}) => {
  await clickKeys(page, ['Digit 9', 'Digit 8', 'Backspace'])
  await expectCurrentValue(page, '9')

  await clickKeys(page, ['add operator', 'Digit 4'])
  await expectPendingExpression(page, '9 +')
  await expectCurrentValue(page, '4')

  await page.getByRole('button', { name: 'Clear calculator' }).click()

  await expectCurrentValue(page, '0')
  await expectPendingExpression(page, 'No pending expression')
  await expect(
    page.getByText(
      'Completed calculations will appear here once you evaluate them.'
    )
  ).toBeVisible()
})

test('announces divide-by-zero and keeps history after backspace recovery', async ({
  page,
}) => {
  await clickKeys(page, [
    'Digit 8',
    'divide operator',
    'Digit 2',
    'Evaluate expression',
    'Digit 8',
    'divide operator',
    'Digit 0',
    'Evaluate expression',
  ])

  await expect(page.getByRole('alert')).toContainText('Cannot divide by zero.')
  await expect(
    page.getByText(
      'Cannot divide by zero. Press a digit or decimal to start over, or clear the calculator.'
    )
  ).toBeVisible()

  await page.getByRole('button', { name: 'Backspace' }).click()

  await expectCurrentValue(page, '0')
  await expect(
    page.getByRole('button', { name: 'Recall 8 / 2 equals 4' })
  ).toBeVisible()
})
