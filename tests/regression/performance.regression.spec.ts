import { test, expect } from '../../fixtures/sauce.fixture';
import { PERSONA_THRESHOLDS } from '../../data/persona-strategy';
import { USERS } from '../../data/users';

test.describe('Regression — Performance @regression @readonly', () => {
  test('TC-L3-NF1-001: standard_user login completes within 3000 ms', async ({ authFlow }) => {
    const durationMs = await authFlow.loginAsAndMeasureInventory(USERS.standard);

    expect(durationMs).toBeLessThanOrEqual(PERSONA_THRESHOLDS.standardLoginMaxMs);
  });
});

test.describe('Regression — Performance @regression @mutating', () => {
  test('TC-L3-NF1-002: inventory page load completes within 2000 ms', async ({
    loginAsStandardUser,
    inventoryPage,
    page,
  }) => {
    await loginAsStandardUser();

    const loadDurationMs = await page.evaluate(() => {
      const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      return navigation ? navigation.loadEventEnd - navigation.startTime : 0;
    });

    expect(loadDurationMs).toBeLessThanOrEqual(2_000);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });
});
