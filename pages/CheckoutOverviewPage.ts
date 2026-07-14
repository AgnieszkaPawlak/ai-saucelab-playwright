import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';
import { SELECTORS } from '../core/selectors';

export class CheckoutOverviewPage extends BasePage {
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.locator(SELECTORS.checkout.overview.finish);
    this.cancelButton = page.locator(SELECTORS.checkout.overview.cancel);
    this.subtotalLabel = page.locator(SELECTORS.checkout.overview.subtotal);
    this.taxLabel = page.locator(SELECTORS.checkout.overview.tax);
    this.totalLabel = page.locator(SELECTORS.checkout.overview.total);
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
