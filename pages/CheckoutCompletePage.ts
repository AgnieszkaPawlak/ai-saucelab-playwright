import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
