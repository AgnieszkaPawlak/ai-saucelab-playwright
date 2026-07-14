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
}
