import { test, expect } from '@playwright/test'

test.describe('Timer Feature', () => {
  test('should navigate to timer from home', async ({ page }) => {
    await page.goto('/')

    await page
      .locator('.home')
      .getByRole('link', { name: /倒计时/ })
      .click()

    await expect(page).toHaveURL(/\/timer$/)
    await expect(page.locator('.counter')).toHaveText('第 1 圈')
  })

  test('should display timer with default settings', async ({ page }) => {
    await page.goto('/timer')

    await expect(page.locator('.time-display')).toHaveText('05:00')
    await expect(page.getByRole('button', { name: /开始/ })).toBeVisible()
  })

  test('should set the countdown by typing digits on the timer page', async ({ page }) => {
    await page.goto('/timer')
    const timeDisplay = page.locator('.time-display')
    await page.locator('.time-entry-input').focus()

    await page.keyboard.press('1')
    await expect(timeDisplay).toHaveText('00:01')
    await page.keyboard.press('0')
    await expect(timeDisplay).toHaveText('00:10')
    await page.keyboard.press('0')
    await expect(timeDisplay).toHaveText('01:00')

    await page.getByRole('button', { name: /开始/ }).click()
    await expect(page.getByRole('button', { name: /暂停/ })).toBeVisible()
  })

  test('should normalize overflow seconds when starting and restore duration on reset', async ({
    page,
  }) => {
    await page.goto('/timer')
    const timeDisplay = page.locator('.time-display')

    await page.locator('.time-entry-input').fill('69')
    await expect(timeDisplay).toHaveText('00:69')
    await page.getByRole('button', { name: /开始/ }).click()
    await expect(timeDisplay).toHaveText('01:09')
    await page.getByRole('button', { name: /重置/ }).click()
    await expect(timeDisplay).toHaveText('01:09')
  })

  test('should display zero when entering or deleting all digits', async ({ page }) => {
    await page.goto('/timer')
    const input = page.locator('.time-entry-input')
    const timeDisplay = page.locator('.time-display')
    await input.focus()

    await page.keyboard.press('0')
    await expect(timeDisplay).toHaveText('00:00')
    await page.keyboard.press('0')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await expect(timeDisplay).toHaveText('00:00')
    await expect(page.getByRole('button', { name: '开始' })).toBeDisabled()
  })

  test('should limit the duration to 99 minutes', async ({ page }) => {
    await page.goto('/timer')
    const input = page.locator('.time-entry-input')
    const timeDisplay = page.locator('.time-display')
    await input.focus()

    for (const digit of ['9', '9', '0', '0']) {
      await page.keyboard.press(digit)
    }
    await expect(timeDisplay).toHaveText('99:00')

    await page.keyboard.press('0')
    await expect(timeDisplay).toHaveText('99:00')
  })

  test('should start and pause timer', async ({ page }) => {
    await page.goto('/timer')

    const timeDisplay = page.locator('.time-display')
    await page.getByRole('button', { name: /开始/ }).click()
    await expect(page.getByRole('button', { name: /暂停/ })).toBeVisible()
    await expect(timeDisplay).not.toHaveText('05:00')

    await page.getByRole('button', { name: /暂停/ }).click()
    await expect(page.getByRole('button', { name: /继续/ })).toBeVisible()
  })

  test('should keep counting when navigating away and back', async ({ page }) => {
    await page.clock.install()
    await page.goto('/timer')
    const timeDisplay = page.locator('.time-display')

    await page.getByRole('button', { name: /开始/ }).click()
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('link', { name: '首页' }).click()
    await page.clock.fastForward(1_100)
    await page
      .locator('.home')
      .getByRole('link', { name: /倒计时/ })
      .click()

    await expect(timeDisplay).not.toHaveText('05:00')
    await expect(page.getByRole('button', { name: /暂停/ })).toBeVisible()
  })

  test('should reset timer', async ({ page }) => {
    await page.goto('/timer')

    const timeDisplay = page.locator('.time-display')
    await page.getByRole('button', { name: /开始/ }).click()
    await expect(timeDisplay).not.toHaveText('05:00')
    await page.getByRole('button', { name: /重置/ }).click()
    await expect(timeDisplay).toHaveText('05:00')
  })

  test('should keep alert settings and persist duration entered on the timer page', async ({
    page,
  }) => {
    await page.goto('/timer')
    await page.locator('.time-display').focus()

    for (const digit of ['1', '0', '0', '0']) {
      await page.keyboard.press(digit)
    }
    await expect(page.locator('.time-display')).toHaveText('10:00')

    await page.getByRole('button', { name: 'Settings' }).click()
    const settingsPanel = page.locator('.config-panel.open')
    await expect(settingsPanel).toBeVisible()

    await expect(settingsPanel.locator('#timer-duration')).toHaveCount(0)
    await expect(settingsPanel.locator('#timer-alert-seconds')).toBeVisible()
    await settingsPanel.getByRole('button', { name: 'Close' }).click()

    await expect(settingsPanel).toBeHidden()
    await expect(page.locator('.time-display')).toHaveText('10:00')

    await page.reload()
    await expect(page.locator('.time-display')).toHaveText('10:00')
  })

  test('should display lap count', async ({ page }) => {
    await page.goto('/timer')

    await expect(page.locator('.counter')).toContainText('第 1 圈')
  })

  test('should have circular progress indicator', async ({ page }) => {
    await page.goto('/timer')

    const progress = page.locator('.timer-progress')
    await expect(progress).toBeVisible()
  })

  test('should fit the circular timer in common viewport sizes', async ({ page }) => {
    await page.goto('/timer')

    const viewports = [
      { width: 320, height: 568 },
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1366, height: 768 },
      { width: 844, height: 390 },
      { width: 390, height: 320 },
    ]
    const progress = page.locator('.timer-progress')
    const display = page.locator('.time-display')
    const controls = page.locator('.controls')

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)

      const bounds = await Promise.all([
        progress.boundingBox(),
        display.boundingBox(),
        controls.boundingBox(),
      ])
      const [circle, time, buttons] = bounds

      expect(circle).not.toBeNull()
      expect(time).not.toBeNull()
      expect(buttons).not.toBeNull()
      expect(Math.abs(circle!.width - circle!.height)).toBeLessThanOrEqual(1)
      expect(circle!.width).toBeGreaterThan(230)
      expect(circle!.x).toBeGreaterThanOrEqual(0)
      expect(circle!.y).toBeGreaterThanOrEqual(0)
      expect(circle!.x + circle!.width).toBeLessThanOrEqual(viewport.width)
      expect(circle!.y + circle!.height).toBeLessThanOrEqual(viewport.height)
      expect(time!.x).toBeGreaterThanOrEqual(circle!.x)
      expect(time!.x + time!.width).toBeLessThanOrEqual(circle!.x + circle!.width)
      expect(time!.x).toBeGreaterThanOrEqual(0)
      expect(time!.y + time!.height).toBeLessThanOrEqual(viewport.height)
      expect(buttons!.x).toBeGreaterThanOrEqual(circle!.x)
      expect(buttons!.x + buttons!.width).toBeLessThanOrEqual(circle!.x + circle!.width)
      expect(buttons!.x + buttons!.width).toBeLessThanOrEqual(viewport.width)
      expect(buttons!.y + buttons!.height).toBeLessThanOrEqual(viewport.height)
    }
  })
})
