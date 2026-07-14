import { test, expect } from '../../fixtures/sauce.fixture';
import { credentials } from '../../config/credentials';

test.describe('Smoke — Login @smoke @readonly', () => {
  test('TC-L3-SMOKE-001: login page loads', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-L3-NEG-001: locked_out_user cannot log in', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.lockedOutUser, credentials.password);

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });
});

test.describe('Smoke — Login @smoke @mutating', () => {
  test('TC-L3-FUNC-001: standard_user logs in successfully', async ({
    loginPage,
    header,
    inventoryPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(credentials.standardUser, credentials.password);

    await expect(loginPage.page).toHaveURL(/inventory\.html/);
    await expect(header.title).toHaveText('Products');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });
});
