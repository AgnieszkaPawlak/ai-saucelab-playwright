import { test, expect } from '../../fixtures/sauce.fixture';
import { CART_STATES } from '../../data/cart-states';
import { DEFAULT_CUSTOMER } from '../../data/checkout-data';
import { PRODUCTS } from '../../data/products';

test.describe('Regression — Session @regression @mutating', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  test('TC-L3-NF2-001: refresh during checkout step one keeps session or re-authenticates', async ({
    checkoutFlow,
    checkoutStepOne,
    loginPage,
    page,
  }) => {
    await checkoutFlow.startCheckoutForCartState(CART_STATES.singleBackpack);
    await checkoutStepOne.fillCustomerInfo(
      DEFAULT_CUSTOMER.firstName,
      DEFAULT_CUSTOMER.lastName,
      DEFAULT_CUSTOMER.postalCode,
    );

    await page.reload();

    await expect(page).toHaveURL(/checkout-step-one\.html|\/$/);
    if (page.url().includes('checkout-step-one')) {
      await expect(checkoutStepOne.continueButton).toBeVisible();
    } else {
      await expect(loginPage.loginButton).toBeVisible();
    }
  });

  test('TC-L3-NF2-002: reset app state and re-login restores clean inventory', async ({
    shoppingFlow,
    sidebar,
    loginAsStandardUser,
    header,
    inventoryPage,
  }) => {
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await expect(header.cartBadge).toHaveText('1');

    await sidebar.resetAppState();
    await loginAsStandardUser();

    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await expect(header.cartBadge).not.toBeVisible();
    expect(await header.getCartItemCount()).toBe(0);
  });

  test('TC-L3-S6-001: browser back from overview returns to checkout step one', async ({
    checkoutFlow,
    checkoutOverview,
    checkoutStepOne,
    page,
  }) => {
    await checkoutFlow.proceedToOverview(PRODUCTS.backpack.id, DEFAULT_CUSTOMER);

    await expect(checkoutOverview.page).toHaveURL(/checkout-step-two\.html/);
    await page.goBack();

    await expect(checkoutStepOne.page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutStepOne.continueButton).toBeVisible();
  });
});
