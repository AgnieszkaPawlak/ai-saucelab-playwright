import { test, expect } from '../../fixtures/sauce.fixture';
import { CART_STATES } from '../../data/cart-states';
import { DEFAULT_CUSTOMER } from '../../data/checkout-data';

const XSS_PAYLOAD = '<script>alert(1)</script>';

test.describe('Regression — Security @regression @readonly', () => {
  test('TC-L3-SEC-001: inventory URL requires authentication', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});

test.describe('Regression — Security @regression @mutating', () => {
  test('TC-L3-SEC-003: XSS payload in checkout first name does not trigger alert', async ({
    loginAsStandardUser,
    resetAppState,
    checkoutFlow,
    checkoutStepOne,
    checkoutOverview,
    page,
  }) => {
    await loginAsStandardUser();
    await resetAppState();
    await checkoutFlow.startCheckoutForCartState(CART_STATES.singleBackpack);

    let dialogMessage: string | null = null;
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await checkoutStepOne.fillCustomerInfo(
      XSS_PAYLOAD,
      DEFAULT_CUSTOMER.lastName,
      DEFAULT_CUSTOMER.postalCode,
    );
    await checkoutStepOne.continueToOverview();

    expect(dialogMessage).toBeNull();
    await expect(checkoutOverview.page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverview.finishButton).toBeVisible();
  });
});
