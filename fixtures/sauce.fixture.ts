import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { SidebarComponent } from '../pages/SidebarComponent';
import { credentials } from '../config/credentials';

type SauceFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  sidebar: SidebarComponent;
  loginAsStandardUser: () => Promise<void>;
};

export const test = base.extend<SauceFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
  loginAsStandardUser: async ({ loginPage }, use) => {
    await use(async () => {
      await loginPage.goto();
      await loginPage.login(credentials.standardUser, credentials.standardPassword);
    });
  },
});

export { expect } from '@playwright/test';
