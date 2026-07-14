import { test, expect } from '../../fixtures/sauce.fixture';

test.describe('Smoke — Shopping @smoke', () => {
  test.beforeEach(async ({ loginAsStandardUser }) => {
    await loginAsStandardUser();
  });

  // TODO: TC-L3-FUNC-010 — add product to cart
  // TODO: TC-L3-FUNC-004 — remove product from cart
  // TODO: TC-L3-REG-001 — sort products by price

  test.skip('TC-L3-FUNC-010: add backpack to cart (placeholder)', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
