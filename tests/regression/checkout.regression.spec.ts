import { test, expect } from '../../fixtures/sauce.fixture';
import { DEFAULT_CUSTOMER } from '../../data/checkout-data';
import { PRODUCTS } from '../../data/products';

test.describe('Regression — Checkout @regression', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  test('TC-L3-FUNC-005: checkout step one accepts valid customer data', async ({
    checkoutFlow,
    checkoutOverview,
  }) => {
    await checkoutFlow.proceedToOverview(PRODUCTS.backpack.id, DEFAULT_CUSTOMER);

    await expect(checkoutOverview.page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverview.finishButton).toBeVisible();
  });

  test('TC-L3-FUNC-006: checkout overview shows correct totals for backpack', async ({
    checkoutFlow,
    checkoutOverview,
  }) => {
    await checkoutFlow.proceedToOverview(PRODUCTS.backpack.id, DEFAULT_CUSTOMER);

    await expect(checkoutOverview.subtotalLabel).toHaveText('Item total: $29.99');
    await expect(checkoutOverview.taxLabel).toHaveText('Tax: $2.40');
    await expect(checkoutOverview.totalLabel).toHaveText('Total: $32.39');
  });

  test('TC-L3-FUNC-007: finish order shows thank you message', async ({
    checkoutFlow,
    checkoutComplete,
  }) => {
    await checkoutFlow.completeCheckout(PRODUCTS.backpack.id, DEFAULT_CUSTOMER);

    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-L3-FUNC-020: cancel checkout returns to cart with product', async ({
    checkoutFlow,
    cartPage,
  }) => {
    await checkoutFlow.startCheckout(PRODUCTS.backpack.id);
    await checkoutFlow.cancelFromStepOne();

    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).toBeVisible();
  });

  test('TC-L3-NEG-005: checkout step one rejects empty customer fields', async ({
    checkoutFlow,
    checkoutStepOne,
  }) => {
    await checkoutFlow.startCheckout(PRODUCTS.backpack.id);
    await checkoutStepOne.continueToOverview();

    await expect(checkoutStepOne.errorMessage).toContainText('First Name is required');
    await expect(checkoutStepOne.page).toHaveURL(/checkout-step-one\.html/);
  });
});
