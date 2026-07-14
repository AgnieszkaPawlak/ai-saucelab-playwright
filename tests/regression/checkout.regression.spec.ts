import { test, expect } from '../../fixtures/sauce.fixture';
import { CART_STATES } from '../../data/cart-states';
import { checkoutCustomer, DEFAULT_CUSTOMER } from '../../data/checkout-data';
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

  test('TC-L3-FUNC-008: back home returns to inventory after order', async ({
    checkoutFlow,
    checkoutComplete,
    inventoryPage,
  }) => {
    await checkoutFlow.completeCheckout(PRODUCTS.backpack.id, DEFAULT_CUSTOMER);
    await checkoutComplete.backToProducts();

    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC-L3-FUNC-019: multi-item checkout shows combined subtotal', async ({
    checkoutFlow,
    checkoutOverview,
  }) => {
    await checkoutFlow.proceedToOverviewForCartState(CART_STATES.backpackAndBikeLight, DEFAULT_CUSTOMER);

    await expect(checkoutOverview.subtotalLabel).toHaveText('Item total: $39.98');
  });

  test('TC-L3-FUNC-020: cancel checkout returns to cart with product', async ({
    checkoutFlow,
    cartPage,
  }) => {
    await checkoutFlow.startCheckoutForCartState(CART_STATES.singleBackpack);
    await checkoutFlow.cancelFromStepOne();

    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).toBeVisible();
  });

  test('TC-L3-NEG-005: checkout step one rejects empty customer fields', async ({
    checkoutFlow,
    checkoutStepOne,
  }) => {
    await checkoutFlow.startCheckoutForCartState(CART_STATES.singleBackpack);
    await checkoutStepOne.continueToOverview();

    await expect(checkoutStepOne.errorMessage).toContainText('First Name is required');
    await expect(checkoutStepOne.page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-L3-NEG-006: checkout step one rejects missing last name', async ({
    checkoutFlow,
    checkoutStepOne,
  }) => {
    const customer = checkoutCustomer()
      .withFirstName(DEFAULT_CUSTOMER.firstName)
      .withLastName('')
      .withPostalCode('')
      .build();

    await checkoutFlow.startCheckoutForCartState(CART_STATES.singleBackpack);
    await checkoutStepOne.fillCustomerInfo(
      customer.firstName,
      customer.lastName,
      customer.postalCode,
    );
    await checkoutStepOne.continueToOverview();

    await expect(checkoutStepOne.errorMessage).toContainText('Last Name is required');
    await expect(checkoutStepOne.page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-L3-NEG-007: checkout step one rejects missing postal code', async ({
    checkoutFlow,
    checkoutStepOne,
  }) => {
    const customer = checkoutCustomer()
      .withFirstName(DEFAULT_CUSTOMER.firstName)
      .withLastName(DEFAULT_CUSTOMER.lastName)
      .withPostalCode('')
      .build();

    await checkoutFlow.startCheckoutForCartState(CART_STATES.singleBackpack);
    await checkoutStepOne.fillCustomerInfo(
      customer.firstName,
      customer.lastName,
      customer.postalCode,
    );
    await checkoutStepOne.continueToOverview();

    await expect(checkoutStepOne.errorMessage).toContainText('Postal Code is required');
    await expect(checkoutStepOne.page).toHaveURL(/checkout-step-one\.html/);
  });
});
