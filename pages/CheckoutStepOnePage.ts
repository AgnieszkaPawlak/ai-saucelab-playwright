import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';
import { SELECTORS } from '../core/selectors';

export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(SELECTORS.checkout.stepOne.firstName);
    this.lastNameInput = page.locator(SELECTORS.checkout.stepOne.lastName);
    this.postalCodeInput = page.locator(SELECTORS.checkout.stepOne.postalCode);
    this.continueButton = page.locator(SELECTORS.checkout.stepOne.continue);
    this.cancelButton = page.locator(SELECTORS.checkout.stepOne.cancel);
    this.errorMessage = page.locator(SELECTORS.checkout.stepOne.error);
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
