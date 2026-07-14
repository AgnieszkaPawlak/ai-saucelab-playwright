import { HeaderComponent } from '../components/HeaderComponent';
import { type CheckoutCustomer } from '../data/checkout-data';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ShoppingFlow } from './ShoppingFlow';

export class CheckoutFlow {
  private readonly shoppingFlow: ShoppingFlow;
  private readonly header: HeaderComponent;
  private readonly cartPage: CartPage;
  private readonly checkoutPage: CheckoutPage;

  constructor(
    shoppingFlow: ShoppingFlow,
    header: HeaderComponent,
    cartPage: CartPage,
    checkoutPage: CheckoutPage,
  ) {
    this.shoppingFlow = shoppingFlow;
    this.header = header;
    this.cartPage = cartPage;
    this.checkoutPage = checkoutPage;
  }

  async completeCheckout(productId: string, customer: CheckoutCustomer): Promise<void> {
    await this.shoppingFlow.addProductToCart(productId);
    await this.header.openCart();
    await this.cartPage.proceedToCheckout();
    await this.checkoutPage.fillCustomerInfo(
      customer.firstName,
      customer.lastName,
      customer.postalCode,
    );
    await this.checkoutPage.continueToOverview();
    await this.checkoutPage.finishOrder();
  }
}
