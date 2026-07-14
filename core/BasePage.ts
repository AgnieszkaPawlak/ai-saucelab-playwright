import { type Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForUrl(urlPattern: RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }
}
