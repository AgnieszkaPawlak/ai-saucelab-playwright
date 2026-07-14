import { test, expect } from '../../fixtures/sauce.fixture';
import {
  BROKEN_IMAGE_SRC_FRAGMENT,
  characterizeCartLink,
  PERSONA_THRESHOLDS,
} from '../../data/persona-strategy';
import { PRODUCTS } from '../../data/products';
import { USERS } from '../../data/users';

test.describe('Characterization — Personas @characterization @mutating', () => {
  test('TC-L3-PERS-001: problem_user shows broken product images', async ({
    loginAs,
    inventoryPage,
  }) => {
    await loginAs('problem');

    await expect(inventoryPage.inventoryItems).toHaveCount(6);

    for (let index = 0; index < 6; index += 1) {
      const image = inventoryPage.inventoryItems.nth(index).locator('img').first();
      await expect(image).toHaveAttribute('src', new RegExp(BROKEN_IMAGE_SRC_FRAGMENT));
      const naturalWidth = await image.evaluate((element: HTMLImageElement) => element.naturalWidth);
      test.info().annotations.push({
        type: `image-${index}-natural-width`,
        description: String(naturalWidth),
      });
    }
  });

  test('TC-L3-PERS-002: performance_glitch_user login completes within threshold', async ({
    authFlow,
  }) => {
    const durationMs = await authFlow.loginAsAndMeasureInventory(USERS.performance_glitch);

    expect(durationMs).toBeGreaterThan(500);
    expect(durationMs).toBeLessThanOrEqual(PERSONA_THRESHOLDS.glitchLoginMaxMs);
  });

  test('TC-L3-PERS-003: error_user cart link class is captured flexibly', async ({
    loginAs,
    resetAppState,
    shoppingFlow,
    header,
  }) => {
    await loginAs('error');
    await resetAppState();
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);

    const classList = await header.getCartLinkClassList();
    const characterization = characterizeCartLink(classList);

    test.info().annotations.push({
      type: 'cart-link-class',
      description: classList || '(empty)',
    });
    test.info().annotations.push({
      type: 'has-error-class',
      description: String(characterization.hasErrorClass),
    });

    expect(classList).toContain('shopping_cart_link');

    if (characterization.hasErrorClass) {
      await expect(header.cartLink).toHaveClass(/error/);
    }
  });

  test('TC-L3-PERS-004: visual_user inventory sort control state is documented', async ({
    loginAs,
    inventoryPage,
    page,
  }) => {
    await loginAs('visual');

    const sortVisible = await inventoryPage.sortDropdown.isVisible();
    test.info().annotations.push({
      type: 'sort-visible',
      description: String(sortVisible),
    });

    await expect(inventoryPage.sortDropdown).toBeVisible();

    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('visual-user-inventory', {
      body: screenshot,
      contentType: 'image/png',
    });
  });
});
