import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS, SORT_OPTIONS } from '../../data/products';

test.describe('Regression — Inventory @regression', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  test('TC-L3-FUNC-002: displays six products', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await expect(inventoryPage.inventoryItemNames).toHaveCount(6);
  });

  test('TC-L3-REG-001: sort Name A to Z puts backpack first', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.nameAsc);

    await expect(inventoryPage.firstProductName()).toHaveText(PRODUCTS.backpack.name);

    const names = await inventoryPage.getProductNames();
    expect(names[names.length - 1]).toBe(PRODUCTS.allTheThings.name);
  });

  test('TC-L3-FUNC-009: sort Name Z to A puts Test.allTheThings() first', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.nameDesc);

    await expect(inventoryPage.firstProductName()).toHaveText(PRODUCTS.allTheThings.name);
  });

  test('TC-L3-FUNC-011: sort Price low to high puts Onesie first', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.priceLowHigh);

    await expect(inventoryPage.firstProductName()).toHaveText(PRODUCTS.onesie.name);
    await expect(inventoryPage.firstProductPrice()).toHaveText('$7.99');
  });
});
