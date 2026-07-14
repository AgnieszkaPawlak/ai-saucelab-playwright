import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';
import { SELECTORS } from '../core/selectors';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator(SELECTORS.checkout.complete.header);
    this.backHomeButton = page.locator(SELECTORS.checkout.complete.backToProducts);
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
