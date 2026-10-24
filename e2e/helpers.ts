import { expect, test, type Page } from '@playwright/test'

/** Start each test with a fresh app origin and empty browser storage. */
export async function resetBrowserState(page: Page) {
  await page.goto('/')
  await page.context().clearCookies()
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
