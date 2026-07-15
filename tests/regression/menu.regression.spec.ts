import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Regression — Menu @regression @mutating', () => {
  test('TC-L3-FUNC-017: logout returns to login page and blocks back navigation', async ({
    loginAsStandardUser,
    sidebar,
    loginPage,
    page,
  }) => {
    await loginAsStandardUser();
    await sidebar.logout();

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();

    await page.goBack();

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-L3-FUNC-015: sidebar All Items navigates to inventory', async ({
    loginAsStandardUser,
    header,
    sidebar,
    inventoryPage,
  }) => {
    await loginAsStandardUser();
    await header.openCart();

    await sidebar.navigateToAllItems();

    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC-L3-FUNC-016: sidebar About opens Sauce Labs site', async ({
    loginAsStandardUser,
    sidebar,
    page,
  }) => {
    await loginAsStandardUser();

    await sidebar.navigateToAbout();

    await page.waitForURL(/saucelabs\.com/, { timeout: 15_000 });
    await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('TC-L3-FUNC-018: reset app state clears cart badge', async ({
    loginAsStandardUser,
    resetAppState,
    shoppingFlow,
    header,
    sidebar,
  }) => {
    await loginAsStandardUser();
    await resetAppState();

    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await expect(header.cartBadge).toHaveText('1');

    await sidebar.resetAppState();

    await expect(header.cartBadge).not.toBeVisible();
    expect(await header.getCartItemCount()).toBe(0);
  });
});
