import { type Locator, type Page } from '@playwright/test';
import { SELECTORS } from '../core/selectors';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(SELECTORS.login.username);
    this.passwordInput = page.locator(SELECTORS.login.password);
    this.loginButton = page.locator(SELECTORS.login.loginButton);
    this.errorMessage = page.locator(SELECTORS.login.error);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
