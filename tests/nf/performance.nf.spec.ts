import { test, expect } from '../../fixtures/sauce.fixture';
import { PERSONA_THRESHOLDS } from '../../data/persona-strategy';
import { USERS } from '../../data/users';

test.describe('NF — Performance @nf-performance', () => {
  test('TC-L3-NF1-001: standard_user login completes within 3000 ms', async ({ authFlow }) => {
    const durationMs = await authFlow.loginAsAndMeasureInventory(USERS.standard);

    expect(durationMs).toBeLessThanOrEqual(PERSONA_THRESHOLDS.standardLoginMaxMs);
  });
});
