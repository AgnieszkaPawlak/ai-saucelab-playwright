import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  cartItemByName(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  removeButton(productTestId: string): Locator {
    return this.page.locator(`[data-test="remove-${productTestId}"]`);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
