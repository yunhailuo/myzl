import { expect, test } from '@playwright/test'

test('home page loads and shows the title', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'MYZL' })).toBeVisible()
  await expect(page.getByRole('main').getByRole('link', { name: '加减法' })).toBeVisible()
})

test('can navigate from the home page to the game', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

  await expect(page.locator('.counter')).toContainText('第 1 题')
  await expect(page.locator('.question')).toBeVisible()
})

test('can navigate between questions with the arrow buttons', async ({ page }) => {
  await page.goto('/addition-subtraction')

  await expect(page.locator('.counter')).toContainText('第 1 题')

  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.locator('.counter')).toContainText('第 2 题')

  await page.getByRole('button', { name: 'Previous question' }).click()
  await expect(page.locator('.counter')).toContainText('第 1 题')
})

test('supports keyboard navigation when enabled', async ({ page }) => {
  await page.goto('/addition-subtraction')

  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.counter')).toContainText('第 2 题')
})

test('disables keyboard navigation when the setting is turned off', async ({ page }) => {
  await page.goto('/addition-subtraction')

  await page.getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('checkbox', { name: '启用键盘和滑动操作' }).uncheck()
  await page.keyboard.press('ArrowRight')

  await expect(page.locator('.counter')).toContainText('第 1 题')
})

test('opens and closes the config panel', async ({ page }) => {
  await page.goto('/addition-subtraction')

  await page.getByRole('button', { name: 'Settings' }).click()
  await expect(page.locator('.config-panel')).toHaveClass(/open/)
  await expect(page.locator('.config-overlay')).toHaveClass(/active/)

  await page.locator('.game .close-btn').click()
  await expect(page.locator('.config-panel')).not.toHaveClass(/open/)
  await expect(page.locator('.config-overlay')).not.toHaveClass(/active/)
})

test('config panel closes when the overlay is clicked', async ({ page }) => {
  await page.goto('/addition-subtraction')

  await page.getByRole('button', { name: 'Settings' }).click()
  await page.locator('.config-overlay').click()

  await expect(page.locator('.config-panel')).not.toHaveClass(/open/)
})

test('config panel checkboxes can be toggled', async ({ page }) => {
  await page.goto('/addition-subtraction')

  await page.getByRole('button', { name: 'Settings' }).click()

  const arrowCheckbox = page.getByRole('checkbox', { name: '显示左右箭头按钮' })
  const navigationCheckbox = page.getByRole('checkbox', { name: '启用键盘和滑动操作' })

  await expect(arrowCheckbox).toBeChecked()
  await expect(navigationCheckbox).toBeChecked()

  await arrowCheckbox.uncheck()
  await expect(page.locator('.nav-bar')).toHaveCount(0)

  await arrowCheckbox.check()
  await expect(page.locator('.nav-bar')).toHaveCount(2)
})
