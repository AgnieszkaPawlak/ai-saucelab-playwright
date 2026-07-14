import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
  }

  productAddToCartButton(productTestId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productTestId}"]`);
  }

  productRemoveButton(productTestId: string): Locator {
    return this.page.locator(`[data-test="remove-${productTestId}"]`);
  }

  async addProductToCart(productTestId: string): Promise<void> {
    await this.productAddToCartButton(productTestId).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }
}
