import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  private readonly header: HeaderComponent;

  constructor(page: Page, header: HeaderComponent) {
    this.page = page;
    this.header = header;
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
    await this.header.openCart();
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }
}
