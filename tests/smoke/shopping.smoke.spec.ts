import { test, expect } from '../../fixtures/sauce.fixture';
import { SAUCE_LABS_BACKPACK } from '../../data/products';

test.describe('Smoke — Shopping @smoke @mutating', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  // TODO: TC-L3-FUNC-004 — remove product from cart
  // TODO: TC-L3-REG-001 — sort products by price

  test('TC-L3-FUNC-010: add backpack to cart', async ({ shoppingFlow, header }) => {
    await shoppingFlow.addProductToCart(SAUCE_LABS_BACKPACK);
    await expect(header.cartBadge).toHaveText('1');
  });
});
