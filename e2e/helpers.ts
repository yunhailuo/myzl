import { expect, test, type Page } from '@playwright/test'

/**
 * Reset persisted browser state once at the start of a test.
 *
 * This intentionally does not use addInitScript because some tests verify
 * persistence across reload within the same test.
 */
export async function resetBrowserState(page: Page) {
  await page.context().clearCookies()
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.reload()
}

export async function goToHanziPractice(page: Page) {
  await page.goto('/hanzi')
  await expect(page).toHaveURL(/\/hanzi$/)
}

export async function expectHanziWriterReady(page: Page) {
  await expect(page.getByTestId('hanzi-writer-container')).toHaveAttribute('data-ready', 'true')
}

export { test, expect }
