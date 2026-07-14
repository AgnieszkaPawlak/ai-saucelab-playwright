import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS } from '../../data/products';
import { USERS } from '../../data/users';

test.describe('NF — Cross-browser @nf-cross-browser', () => {
  test('TC-L3-NF5-001: standard_user reaches inventory after login', async ({
    authFlow,
    inventoryPage,
  }) => {
    await authFlow.loginAsAndExpectInventory(USERS.standard);

    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC-L3-NF5-002: login flow works in current browser project', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await expect(loginPage.page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC-L3-NF5-003: add to cart updates badge in current browser project', async ({
    loginAsStandardUser,
    resetAppState,
    shoppingFlow,
    header,
  }) => {
    await loginAsStandardUser();
    await resetAppState();
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);

    await expect(header.cartBadge).toHaveText('1');
  });
});
