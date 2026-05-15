import { expect, test } from '@playwright/test'

test('shows the scaffolded application shell', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Mike T HHIC AAAAA' })
  ).toBeVisible()
  await expect(
    page.getByText('Playwright configured for end-to-end browser coverage')
  ).toBeVisible()
})
