import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Regression — Cart @regression', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  test('TC-L3-FUNC-004: cart shows added backpack and enables checkout', async ({
    shoppingFlow,
    header,
    cartPage,
  }) => {
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await header.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).toBeVisible();
    await expect(cartPage.checkoutButton).toBeEnabled();
  });
});
