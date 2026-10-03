import { expect, test, type Page } from '@playwright/test'

async function signInAsChef(page: Page) {
  await page.goto('/chef-dashboard')
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()

  // Mock phone is prefilled in dev; submit to request OTP.
  await page.getByRole('button', { name: 'Continue to verification' }).click()
  await page.locator('input[autocomplete="one-time-code"]').fill('000000')
  await page.getByRole('button', { name: 'Verify' }).click()

  await expect(page.getByText('Girki · chef')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible()
}

function portalNav(page: Page) {
  return page.getByRole('complementary', { name: 'Portal' })
}

test.describe('chef portal', () => {
  test('signs in and opens redesign screens', async ({ page }) => {
    await signInAsChef(page)

    await portalNav(page).getByRole('link', { name: 'Bookings' }).click()
    await expect(page.getByRole('heading', { name: 'Bookings' })).toBeVisible()
    await expect(page.getByText('Ijeoma Adisa')).toBeVisible()

    await page.getByRole('link', { name: /Amara Okonkwo/i }).first().click()
    await expect(page.getByRole('heading', { name: 'Booking' })).toBeVisible()
    await expect(page.getByRole('button', { name: /confirm this table/i })).toBeVisible()

    await portalNav(page).getByRole('link', { name: 'Menus' }).click()
    await expect(page.getByRole('heading', { name: 'Menus' })).toBeVisible()
    await expect(page.getByText('Harmattan Tasting')).toBeVisible()

    await portalNav(page).getByRole('link', { name: 'Messages' }).click()
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible()
    await expect(page.getByText('Is that workable without an oven?')).toBeVisible()
  })
})
