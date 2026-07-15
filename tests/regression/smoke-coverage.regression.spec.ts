import { test, expect } from '../../fixtures/sauce.fixture';
import { DEFAULT_CUSTOMER } from '../../data/checkout-data';
import { PRODUCTS } from '../../data/products';

test.describe('Regression — Smoke coverage @regression @readonly', () => {
  test('TC-L3-SMOKE-001: login page loads', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});

test.describe('Regression — Smoke coverage @regression @mutating', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  test('TC-L3-SMOKE-002: complete checkout for backpack', async ({
    checkoutFlow,
    checkoutComplete,
  }) => {
    await checkoutFlow.completeCheckout(PRODUCTS.backpack.id, DEFAULT_CUSTOMER);

    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-L3-NF5-001: chromium smoke purchase path completes successfully', async ({
    checkoutFlow,
    checkoutComplete,
    inventoryPage,
  }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await checkoutFlow.completeCheckout(PRODUCTS.backpack.id, DEFAULT_CUSTOMER);

    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutComplete.page).toHaveURL(/checkout-complete\.html/);
  });
});
