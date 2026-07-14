import { test, expect } from '../../fixtures/sauce.fixture';
import { credentials } from '../../config/credentials';

test.describe('NF — Security @nf-security', () => {
  test('TC-L3-SEC-001: inventory URL requires authentication', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC-L3-SEC-002: SQL injection in username fails safely', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("' OR 1=1--", credentials.standardPassword);

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
