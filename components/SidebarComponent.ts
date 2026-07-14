import { type Locator, type Page } from '@playwright/test';
import { SELECTORS } from '../core/selectors';

export class SidebarComponent {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly resetAppStateLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator(SELECTORS.sidebar.menuButton);
    this.resetAppStateLink = page.locator(SELECTORS.sidebar.resetAppState);
    this.logoutLink = page.locator(SELECTORS.sidebar.logout);
  }

  async open(): Promise<void> {
    const isMenuOpen = await this.page.locator(SELECTORS.sidebar.menuWrap).getAttribute('aria-hidden');
    if (isMenuOpen === 'false') {
      return;
    }
    await this.menuButton.click();
  }

  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetAppStateLink.evaluate((element) => element.click());
  }

  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.evaluate((element) => element.click());
  }
}
