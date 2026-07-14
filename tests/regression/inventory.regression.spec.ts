import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS, SORT_OPTIONS } from '../../data/products';

const sortRegressionCases = [
  {
    id: 'TC-L3-REG-002',
    option: SORT_OPTIONS.nameAsc,
    firstProduct: PRODUCTS.backpack.name,
    firstPrice: null,
  },
  {
    id: 'TC-L3-REG-002',
    option: SORT_OPTIONS.nameDesc,
    firstProduct: PRODUCTS.allTheThings.name,
    firstPrice: null,
  },
  {
    id: 'TC-L3-REG-002',
    option: SORT_OPTIONS.priceLowHigh,
    firstProduct: PRODUCTS.onesie.name,
    firstPrice: '$7.99',
  },
  {
    id: 'TC-L3-REG-002',
    option: SORT_OPTIONS.priceHighLow,
    firstProduct: PRODUCTS.fleeceJacket.name,
    firstPrice: '$49.99',
  },
] as const;

test.describe('Regression — Inventory @regression @mutating', () => {
  test.beforeEach(async ({ loginAsStandardUser, resetAppState }) => {
    await loginAsStandardUser();
    await resetAppState();
  });

  test('TC-L3-FUNC-002: displays six products', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await expect(inventoryPage.inventoryItemNames).toHaveCount(6);
  });

  test('TC-L3-FUNC-003: add backpack switches button to Remove and updates badge', async ({
    shoppingFlow,
    inventoryPage,
    header,
  }) => {
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);

    await expect(inventoryPage.productRemoveButton(PRODUCTS.backpack.id)).toBeVisible();
    await expect(header.cartBadge).toHaveText('1');
  });

  test('TC-L3-FUNC-013: remove from inventory restores Add to cart button', async ({
    shoppingFlow,
    inventoryPage,
  }) => {
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await shoppingFlow.removeProductFromInventory(PRODUCTS.backpack.id);

    await expect(inventoryPage.productAddToCartButton(PRODUCTS.backpack.id)).toBeVisible();
  });

  test('TC-L3-REG-001: sort Name A to Z puts backpack first and Test.allTheThings() last', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.nameAsc);

    await expect(inventoryPage.firstProductName()).toHaveText(PRODUCTS.backpack.name);

    const names = await inventoryPage.getProductNames();
    expect(names[names.length - 1]).toBe(PRODUCTS.allTheThings.name);
  });

  for (const { id, option, firstProduct, firstPrice } of sortRegressionCases) {
    test(`${id}: sort "${option}" orders products correctly`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      await expect(inventoryPage.firstProductName()).toHaveText(firstProduct);
      if (firstPrice) {
        await expect(inventoryPage.firstProductPrice()).toHaveText(firstPrice);
      }
    });
  }
});
