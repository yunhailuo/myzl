import { expect, expectHanziWriterReady, goToHanziPractice, resetBrowserState, test } from './helpers'

test.describe('Complete Game Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await resetBrowserState(page)
  })

  test.describe('Addition Subtraction Game Flow', () => {
    test('complete game session: start to navigation', async ({ page }) => {
      // Navigate to game - scope to main area to avoid strict mode violation
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

      // Verify game loaded
      await expect(page.locator('.expression')).toBeVisible()
      await expect(page.locator('.counter')).toContainText('第 1 题')

      // Test next question navigation - verify counter changes
      await page.locator('.nav-btn.right').click()
      await expect(page.locator('.counter')).toContainText('第 2 题')

      // Test previous question navigation - verify counter returns
      await page.locator('.nav-btn.left').click()
      await expect(page.locator('.counter')).toContainText('第 1 题')
    })

    test('keyboard navigation works correctly', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

      // Verify initial state
      await expect(page.locator('.counter')).toContainText('第 1 题')

      // Use right arrow key - verify counter advances
      await page.keyboard.press('ArrowRight')
      await expect(page.locator('.counter')).toContainText('第 2 题')

      // Use left arrow key - verify counter returns
      await page.keyboard.press('ArrowLeft')
      await expect(page.locator('.counter')).toContainText('第 1 题')
    })

    test('settings persistence across reload', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

      // Open settings
      await page.locator('.config-btn').click()
      await expect(page.locator('.config-overlay.active')).toBeVisible()

      // Toggle a setting (e.g., hide arrows)
      const toggleButton = page.locator('[data-testid="toggle-arrows"]')
      await toggleButton.click()

      // Close settings
      await page.keyboard.press('Escape')
      await expect(page.locator('.config-overlay.active')).toBeHidden()

      // Reload page
      await page.reload()

      // Verify setting persisted by checking if toggle is still unchecked
      const toggleState = page.locator('[data-testid="toggle-arrows"]')
      await expect(toggleState).not.toBeChecked() // Should remain unchecked after reload
    })
  })

  test.describe('Hanzi Game Flow', () => {
    test('hanzi game basic interaction', async ({ page }) => {
      await goToHanziPractice(page)
      await expectHanziWriterReady(page)

      // Verify character is displayed
      const container = page.getByTestId('hanzi-writer-container')
      await expect(container).toBeVisible()

      // Test navigation
      await page.locator('.nav-btn.right').click()

      // Container should still be visible and ready
      await expect(container).toBeVisible()
      await expectHanziWriterReady(page)
    })

    test('hanzi writer initialization', async ({ page }) => {
      await goToHanziPractice(page)
      await expectHanziWriterReady(page)

      // Verify canvas was created inside the container
      const canvas = page.locator('[data-testid="hanzi-writer-container"] canvas')
      await expect(canvas).toHaveCount(1)
    })

    test('hanzi game on mobile viewport', async ({ page }) => {
      await goToHanziPractice(page)
      await expectHanziWriterReady(page)

      // Verify layout adapts to mobile
      const container = page.getByTestId('hanzi-writer-container')
      await expect(container).toBeInViewport()
    })
  })

  test.describe('Cross-Game Navigation', () => {
    test('navigate between different games', async ({ page }) => {
      // Start with Addition/Subtraction
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()
      await expect(page).toHaveURL(/\/addition-subtraction$/)
      await expect(page.locator('.expression')).toBeVisible()

      // Go back to home using browser back button
      await page.goBack()
      await expect(page).toHaveURL(/\/$/)

      // Navigate to Hanzi
      await goToHanziPractice(page)
      await expectHanziWriterReady(page)

      // Verify we're in Hanzi game
      const container = page.getByTestId('hanzi-writer-container')
      await expect(container).toBeVisible()
    })

    test('home page shows all available games', async ({ page }) => {
      await page.goto('/')

      // Check that multiple game links exist
      const gameLinks = page.locator('.game-link')
      const count = await gameLinks.count()
      expect(count).toBeGreaterThanOrEqual(5) // Should have at least 5 games

      // Verify specific games are present
      await expect(page.getByRole('main').getByRole('link', { name: '加减法' })).toBeVisible()
      await expect(page.getByRole('main').getByRole('link', { name: '🀄 汉字' })).toBeVisible()
    })
  })

  test.describe('Mobile Viewport Testing', () => {
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true }) // iPhone SE size with touch support

    test('addition subtraction game on mobile', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

      // Verify game is usable on mobile
      await expect(page.locator('.expression')).toBeVisible()
      await expect(page.locator('.nav-btn')).toHaveCount(2)

      // Test touch navigation
      await page.locator('.nav-btn.right').tap()

      const questionChanged = page.locator('.expression')
      await expect(questionChanged).toBeVisible()
    })

    test('hanzi game on mobile viewport', async ({ page }) => {
      await goToHanziPractice(page)
      await expectHanziWriterReady(page)

      // Verify layout adapts to mobile
      const container = page.getByTestId('hanzi-writer-container')
      await expect(container).toBeInViewport()
    })

    test('config panel works on mobile', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

      // Open config on mobile
      await page.locator('.config-btn').tap()
      await expect(page.locator('.config-overlay.active')).toBeVisible()

      // Verify panel is accessible
      const overlay = page.locator('.config-overlay.active')
      await expect(overlay).toBeVisible()

      // Close using Escape key (more stable across browsers than tap)
      await page.keyboard.press('Escape')

      const overlayClosed = page.locator('.config-overlay.active')
      await expect(overlayClosed).toHaveCount(0)
    })
  })

  test.describe('Error Handling and Edge Cases', () => {
    test('handles rapid navigation gracefully', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

      // Rapid clicks should not break the app
      for (let i = 0; i < 10; i++) {
        await page.locator('.nav-btn.right').click()
      }

      // App should still be functional
      await expect(page.locator('.expression')).toBeVisible()
    })

    test('settings drawer closes on outside click', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()

      // Open settings
      await page.locator('.config-btn').click()
      await expect(page.locator('.config-overlay.active')).toBeVisible()

      // Click outside (on the overlay itself, which should close it)
      await page.locator('.config-overlay.active').click()

      // Panel should close
      const overlayClosed = page.locator('.config-overlay.active')
      await expect(overlayClosed).toHaveCount(0)
    })
  })
})
