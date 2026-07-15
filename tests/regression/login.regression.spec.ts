import { test, expect } from '../../fixtures/sauce.fixture';
import { credentials } from '../../config/credentials';

const loginNegativeCases = [
  {
    id: 'TC-L3-NEG-002',
    username: '',
    password: '',
    expectedError: 'Username is required',
  },
  {
    id: 'TC-L3-NEG-003',
    username: credentials.standardUser,
    password: '',
    expectedError: 'Password is required',
  },
  {
    id: 'TC-L3-NEG-004',
    username: 'bad_user',
    password: credentials.password,
    expectedError: 'do not match any user in this service',
  },
] as const;

test.describe('Regression — Login @regression @readonly', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-L3-NEG-001: locked_out_user cannot log in', async ({ loginPage }) => {
    await loginPage.login(credentials.lockedOutUser, credentials.password);

    await expect(loginPage.page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });

  for (const { id, username, password, expectedError } of loginNegativeCases) {
    test(`${id}: rejects invalid login credentials`, async ({ loginPage }) => {
      await loginPage.login(username, password);

      await expect(loginPage.page).toHaveURL(/\/$/);
      await expect(loginPage.errorMessage).toContainText(expectedError);
    });
  }
});

test.describe('Regression — Login @regression @mutating', () => {
  test('TC-L3-FUNC-001: standard_user logs in successfully', async ({
    loginPage,
    header,
    inventoryPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(credentials.standardUser, credentials.password);

    await expect(loginPage.page).toHaveURL(/inventory\.html/);
    await expect(header.title).toHaveText('Products');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });
});
