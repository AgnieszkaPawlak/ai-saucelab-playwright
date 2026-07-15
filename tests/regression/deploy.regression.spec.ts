import { test, expect } from '../../fixtures/sauce.fixture';

const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

test.describe('Regression — Deploy @regression @readonly', () => {
  test('TC-L3-S5-001: demo base URL responds with HTTPS 200', async ({ request }) => {
    expect(baseURL).toMatch(/^https:/);

    const response = await request.get(baseURL);

    expect(response.status()).toBe(200);
    expect(response.url()).toMatch(/^https:/);
  });
});
