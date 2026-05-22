import { test, expect } from '@playwright/test';

test.describe('Learning Tool - Basic Functionality', () => {
  test('homepage loads and displays the title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Learning Tool');

    const root = page.locator('#root');
    await expect(root).toBeVisible();

    await expect(root).not.toBeEmpty();
  });

  test('chapter navigation and animation rendering', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Digital Signatures' }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Digital Signature — Signing' })).toBeVisible();
  });

  test('navigating to a lesson route renders content', async ({ page }) => {
    await page.goto('/#/lesson/1');

    const root = page.locator('#root');
    await expect(root).toBeVisible();
    await expect(root).not.toBeEmpty();
  });

  test('404 page is shown for unknown routes', async ({ page }) => {
    await page.goto('/#/nonexistent-page');

    await expect(page.locator('#root')).toBeVisible();
  });
});
