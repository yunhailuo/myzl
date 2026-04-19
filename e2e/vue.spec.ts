import { test, expect } from '@playwright/test'

test('home page loads and shows title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('快问快答')
})

test('can navigate to game', async ({ page }) => {
  await page.goto('/')
  await page.locator('.game-link').click()
  await expect(page.locator('.counter')).toContainText('第 1 题')
  await expect(page.locator('.question')).toBeVisible()
})

test('can navigate between questions', async ({ page }) => {
  await page.goto('/addition-subtraction')

  // Check first question counter
  await expect(page.locator('.counter')).toContainText('第 1 题')

  // Click right arrow to go to next question
  await page.locator('.nav-bar.right').click()

  // Check second question counter
  await expect(page.locator('.counter')).toContainText('第 2 题')

  // Click left arrow to go back
  await page.locator('.nav-bar.left').click()

  // Check back to first question
  await expect(page.locator('.counter')).toContainText('第 1 题')
})

test('left arrow is disabled on first question', async ({ page }) => {
  await page.goto('/addition-subtraction')

  const leftArrow = page.locator('.nav-bar.left')
  await expect(leftArrow).toBeDisabled()
})
