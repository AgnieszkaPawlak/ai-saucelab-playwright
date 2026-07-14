import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
