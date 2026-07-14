import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';
import { removeFromCartSelector, SELECTORS } from '../core/selectors';

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator(SELECTORS.cart.title);
    this.cartItems = page.locator(SELECTORS.cart.item);
    this.checkoutButton = page.locator(SELECTORS.cart.checkout);
    this.continueShoppingButton = page.locator(SELECTORS.cart.continueShopping);
  }

  cartItemByName(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  removeButton(productTestId: string): Locator {
    return this.page.locator(removeFromCartSelector(productTestId));
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
