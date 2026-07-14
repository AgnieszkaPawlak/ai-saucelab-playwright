import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { addToCartSelector, removeFromCartSelector, SELECTORS } from '../core/selectors';

export class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  private readonly header: HeaderComponent;

  constructor(page: Page, header: HeaderComponent) {
    this.page = page;
    this.header = header;
    this.sortDropdown = page.locator(SELECTORS.inventory.sortDropdown);
    this.inventoryItems = page.locator(SELECTORS.inventory.item);
    this.inventoryItemNames = page.locator(SELECTORS.inventory.itemName);
    this.inventoryItemPrices = page.locator(SELECTORS.inventory.itemPrice);
  }

  productAddToCartButton(productTestId: string): Locator {
    return this.page.locator(addToCartSelector(productTestId));
  }

  productRemoveButton(productTestId: string): Locator {
    return this.page.locator(removeFromCartSelector(productTestId));
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

  async getProductNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  firstProductName(): Locator {
    return this.inventoryItemNames.first();
  }

  firstProductPrice(): Locator {
    return this.inventoryItemPrices.first();
  }
}
