import { test as base } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { SidebarComponent } from '../components/SidebarComponent';
import { type UserPersona } from '../data/users';
import { AuthFlow } from '../flows/AuthFlow';
import { CheckoutFlow } from '../flows/CheckoutFlow';
import { ShoppingFlow } from '../flows/ShoppingFlow';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { getUser, USERS } from '../data/users';

type SauceFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOne: CheckoutStepOnePage;
  checkoutOverview: CheckoutOverviewPage;
  checkoutComplete: CheckoutCompletePage;
  header: HeaderComponent;
  sidebar: SidebarComponent;
  authFlow: AuthFlow;
  shoppingFlow: ShoppingFlow;
  checkoutFlow: CheckoutFlow;
  loginAs: (persona: UserPersona) => Promise<void>;
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
  checkoutStepOne: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutOverview: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutComplete: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
  authFlow: async ({ loginPage }, use) => {
    await use(new AuthFlow(loginPage));
  },
  shoppingFlow: async ({ inventoryPage, header }, use) => {
    await use(new ShoppingFlow(inventoryPage, header));
  },
  checkoutFlow: async (
    { shoppingFlow, header, cartPage, checkoutStepOne, checkoutOverview, checkoutComplete },
    use,
  ) => {
    await use(
      new CheckoutFlow(
        shoppingFlow,
        header,
        cartPage,
        checkoutStepOne,
        checkoutOverview,
        checkoutComplete,
      ),
    );
  },
  loginAs: async ({ authFlow }, use) => {
    await use(async (persona: UserPersona) => {
      await authFlow.loginAsAndExpectInventory(getUser(persona));
    });
  },
  loginAsStandardUser: async ({ authFlow }, use) => {
    await use(async () => {
      await authFlow.loginAsAndExpectInventory(USERS.standard);
    });
  },
  resetAppState: async ({ sidebar }, use) => {
    await use(async () => {
      await sidebar.resetAppState();
    });
  },
});

export { expect } from '@playwright/test';
