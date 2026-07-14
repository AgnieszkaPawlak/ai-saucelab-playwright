import { test as base } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { SidebarComponent } from '../components/SidebarComponent';
import { credentials } from '../config/credentials';
import { CheckoutFlow } from '../flows/CheckoutFlow';
import { ShoppingFlow } from '../flows/ShoppingFlow';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

type SauceFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  header: HeaderComponent;
  sidebar: SidebarComponent;
  shoppingFlow: ShoppingFlow;
  checkoutFlow: CheckoutFlow;
  loginAsStandardUser: () => Promise<void>;
  resetAppState: () => Promise<void>;
};

export const test = base.extend<SauceFixtures>({
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page, header }, use) => {
    await use(new InventoryPage(page, header));
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
  shoppingFlow: async ({ inventoryPage, header }, use) => {
    await use(new ShoppingFlow(inventoryPage, header));
  },
  checkoutFlow: async ({ shoppingFlow, header, cartPage, checkoutPage }, use) => {
    await use(new CheckoutFlow(shoppingFlow, header, cartPage, checkoutPage));
  },
  loginAsStandardUser: async ({ loginPage }, use) => {
    await use(async () => {
      await loginPage.goto();
      await loginPage.login(credentials.standardUser, credentials.standardPassword);
    });
  },
  resetAppState: async ({ sidebar }, use) => {
    await use(async () => {
      await sidebar.resetAppState();
    });
  },
});

export { expect } from '@playwright/test';
