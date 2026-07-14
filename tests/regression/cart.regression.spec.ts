import { test, expect } from '../../fixtures/sauce.fixture';
import { CART_STATES } from '../../data/cart-states';
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
    await shoppingFlow.prepareCartState(CART_STATES.singleBackpack);
    await header.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).toBeVisible();
    await expect(cartPage.checkoutButton).toBeEnabled();
  });

  test('TC-L3-FUNC-014: remove product from cart page empties cart', async ({
    shoppingFlow,
    header,
    cartPage,
  }) => {
    await shoppingFlow.prepareCartState(CART_STATES.singleBackpack);
    await header.openCart();
    await cartPage.removeButton(PRODUCTS.backpack.id).click();

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).not.toBeVisible();
  });

  test('TC-L3-NEG-008: empty cart shows no cart items', async ({ cartPage }) => {
    await cartPage.page.goto('/cart.html');

    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
