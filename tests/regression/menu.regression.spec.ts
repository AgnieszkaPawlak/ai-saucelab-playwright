import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Regression — Menu @regression', () => {
  test('TC-L3-FUNC-017: logout returns to login page', async ({ loginAsStandardUser, sidebar, loginPage }) => {
    await loginAsStandardUser();
    await sidebar.logout();

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();
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
