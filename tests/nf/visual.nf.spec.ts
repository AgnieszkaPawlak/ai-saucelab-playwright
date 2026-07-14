import { test, expect } from '../../fixtures/sauce.fixture';

const VISUAL_SNAPSHOT_OPTIONS = {
  fullPage: true,
  maxDiffPixelRatio: 0.02,
} as const;

test.describe('NF — Visual regression login @nf-visual @readonly', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('TC-L3-S2-003: login page matches visual baseline', async ({ loginPage, page }) => {
    await loginPage.goto();

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    await expect(page).toHaveScreenshot('login-page.png', VISUAL_SNAPSHOT_OPTIONS);
  });
});

test.describe('NF — Visual regression inventory @nf-visual @mutating', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('TC-L3-S2-001: standard_user inventory matches visual baseline', async ({
    loginAs,
    inventoryPage,
    page,
  }) => {
    await loginAs('standard');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);

    await expect(page).toHaveScreenshot('inventory-standard-user.png', VISUAL_SNAPSHOT_OPTIONS);
  });

  test('TC-L3-S2-002: visual_user inventory matches visual baseline', async ({
    loginAs,
    inventoryPage,
    page,
  }) => {
    await loginAs('visual');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await expect(inventoryPage.sortDropdown).toBeVisible();

    await expect(page).toHaveScreenshot('inventory-visual-user.png', VISUAL_SNAPSHOT_OPTIONS);
  });
});
