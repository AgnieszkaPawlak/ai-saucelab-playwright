import { test, expect } from '../../fixtures/sauce.fixture';
import { DEFAULT_CUSTOMER } from '../../data/checkout-data';
import { SAUCE_LABS_BACKPACK } from '../../data/products';

test.describe('Smoke — Checkout @smoke @mutating', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  // TODO: TC-L3-FUNC-020 — cancel checkout returns to inventory

  test('TC-L3-SMOKE-002: complete checkout for backpack', async ({
    checkoutFlow,
    checkoutComplete,
  }) => {
    await checkoutFlow.completeCheckout(SAUCE_LABS_BACKPACK, DEFAULT_CUSTOMER);
    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
  });
});
