import { test, expect } from '@playwright/test'

test.describe('Complete Game Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Addition Subtraction Game Flow', () => {
    test('complete game session: start to navigation', async ({ page }) => {
      // Navigate to game - scope to main area to avoid strict mode violation
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()
      
      // Verify game loaded
      await expect(page.locator('.expression')).toBeVisible()
      
      // Test next question navigation
      const initialQuestion = await page.locator('.expression').textContent()
      await page.locator('.nav-btn.right').click()
      
      const nextQuestion = page.locator('.expression')
      await expect(nextQuestion).not.toHaveText(initialQuestion)
      
      // Test previous question navigation
      await page.locator('.nav-btn.left').click()
      
      const prevQuestion = page.locator('.expression')
      await expect(prevQuestion).toHaveText(initialQuestion)
    })

    test('keyboard navigation works correctly', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()
      
      const initialQuestion = await page.locator('.expression').textContent()
      
      // Use right arrow key
      await page.keyboard.press('ArrowRight')
      
      const nextQuestion = page.locator('.expression')
      await expect(nextQuestion).not.toHaveText(initialQuestion)
      
      // Use left arrow key
      await page.keyboard.press('ArrowLeft')
      
      const backQuestion = page.locator('.expression')
      await expect(backQuestion).toHaveText(initialQuestion)
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
      await page.getByRole('main').getByRole('link', { name: '汉字' }).click()
      
      // Wait for canvas display (Hanzi Writer uses canvas)
      await expect(page.locator('canvas')).toBeVisible()
      
      // Verify character is displayed
      const canvas = page.locator('canvas')
      await expect(canvas).toBeVisible()
      
      // Test navigation
      await page.locator('.nav-btn.right').click()
      
      // Canvas should still be visible
      await expect(canvas).toBeVisible()
    })

    test('hanzi writer initialization', async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: '汉字' }).click()
      
      // Check if HanziWriter canvas is created
      const canvas = page.locator('canvas')
      await expect(canvas).toHaveCount(1)
    })
  })

  test.describe('Cross-Game Navigation', () => {
    test('navigate between different games', async ({ page }) => {
      // Start with Addition/Subtraction
      await page.getByRole('main').getByRole('link', { name: '加减法' }).click()
      await expect(page.locator('.expression')).toBeVisible()
      
      // Go back to home using browser back button
      await page.goBack()
      
      // Navigate to Hanzi
      await page.getByRole('main').getByRole('link', { name: '汉字' }).click()
      await expect(page.locator('canvas')).toBeVisible()
      
      // Verify we're in Hanzi game
      const canvas = page.locator('canvas')
      await expect(canvas).toHaveCount(1)
    })

    test('home page shows all available games', async ({ page }) => {
      await page.goto('/')
      
      // Check that multiple game links exist
      const gameLinks = page.locator('.game-link')
      const count = await gameLinks.count()
      expect(count).toBeGreaterThanOrEqual(4) // Should have at least 4 games
      
      // Verify specific games are present
      await expect(page.getByRole('main').getByRole('link', { name: '加减法' })).toBeVisible()
      await expect(page.getByRole('main').getByRole('link', { name: '汉字' })).toBeVisible()
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
      await page.getByRole('main').getByRole('link', { name: '汉字' }).click()
      
      // Wait for character rendering
      await expect(page.locator('canvas')).toBeVisible()
      
      // Verify layout adapts to mobile
      const canvas = page.locator('canvas')
      await expect(canvas).toBeInViewport()
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
