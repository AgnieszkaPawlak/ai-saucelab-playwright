import { type Locator, type Page } from '@playwright/test';

export class SidebarComponent {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly resetAppStateLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async open(): Promise<void> {
    await this.menuButton.click();
  }

  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetAppStateLink.click();
  }

  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }
}
