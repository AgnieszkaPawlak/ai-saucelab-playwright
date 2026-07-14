import { LoginPage } from '../pages/LoginPage';
import { type DemoUser } from '../data/users';

export class AuthFlow {
  private readonly loginPage: LoginPage;

  constructor(loginPage: LoginPage) {
    this.loginPage = loginPage;
  }

  async loginAs(user: DemoUser): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(user.username, user.password);
  }

  async loginAsAndExpectInventory(user: DemoUser): Promise<void> {
    await this.loginAs(user);
    await this.loginPage.page.waitForURL(/inventory\.html/);
  }

  async loginAsAndMeasureInventory(user: DemoUser): Promise<number> {
    await this.loginPage.goto();
    const startedAt = Date.now();
    await this.loginPage.login(user.username, user.password);
    await this.loginPage.page.waitForURL(/inventory\.html/);
    return Date.now() - startedAt;
  }
}
