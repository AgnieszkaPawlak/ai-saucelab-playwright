import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('NF — Accessibility @nf-a11y', () => {
  test('TC-L3-S1-001: login page has no critical axe violations', async ({ loginPage, page }) => {
    await loginPage.goto();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );

    expect(criticalViolations).toEqual([]);
  });

  test('TC-L3-S1-002: checkout step one has no critical axe violations', async ({
    loginAsStandardUser,
    resetAppState,
    checkoutFlow,
    page,
  }) => {
    await loginAsStandardUser();
    await resetAppState();
    await checkoutFlow.startCheckout(PRODUCTS.backpack.id);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );

    expect(criticalViolations).toEqual([]);
  });
});
