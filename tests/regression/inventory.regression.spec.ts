import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS, SORT_OPTIONS } from '../../data/products';

const sortFuncCases = [
  {
    id: 'TC-L3-FUNC-009',
    option: SORT_OPTIONS.nameAsc,
    firstProduct: PRODUCTS.backpack.name,
    firstPrice: null,
  },
  {
    id: 'TC-L3-FUNC-010',
    option: SORT_OPTIONS.nameDesc,
    firstProduct: PRODUCTS.allTheThings.name,
    firstPrice: null,
  },
  {
    id: 'TC-L3-FUNC-011',
    option: SORT_OPTIONS.priceLowHigh,
    firstProduct: PRODUCTS.onesie.name,
    firstPrice: '$7.99',
  },
  {
    id: 'TC-L3-FUNC-012',
    option: SORT_OPTIONS.priceHighLow,
    firstProduct: PRODUCTS.fleeceJacket.name,
    firstPrice: '$49.99',
  },
] as const;

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

  test('TC-L3-NF8-001: all inventory prices use USD format', async ({ inventoryPage }) => {
    const prices = await inventoryPage.inventoryItemPrices.allTextContents();

    expect(prices).toHaveLength(6);
    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
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

  test('TC-L3-T3-001: add to cart updates badge via user-visible actions only', async ({
    shoppingFlow,
    header,
  }) => {
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);

    await expect(header.cartBadge).toHaveText('1');
    expect(await shoppingFlow.getCartItemCount()).toBe(1);
  });

  test('TC-L3-SAN-001: sort price low to high puts onesie first after deploy check', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.priceLowHigh);

    await expect(inventoryPage.firstProductName()).toHaveText(PRODUCTS.onesie.name);
    await expect(inventoryPage.firstProductPrice()).toHaveText('$7.99');
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

  for (const { id, option, firstProduct, firstPrice } of sortFuncCases) {
    test(`${id}: sort "${option}" orders products correctly`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      await expect(inventoryPage.firstProductName()).toHaveText(firstProduct);
      if (firstPrice) {
        await expect(inventoryPage.firstProductPrice()).toHaveText(firstPrice);
      }
    });
  }

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
