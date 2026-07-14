import { type Locator, type Page } from '@playwright/test';
import { SELECTORS } from '../core/selectors';

export class HeaderComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(SELECTORS.header.title);
    this.cartLink = page.locator(SELECTORS.header.cartLink);
    this.cartBadge = page.locator(SELECTORS.header.cartBadge);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartItemCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return parseInt(text ?? '0', 10);
    }
    return 0;
  }

  async getCartLinkClassList(): Promise<string> {
    return (await this.cartLink.getAttribute('class')) ?? '';
  }
}
