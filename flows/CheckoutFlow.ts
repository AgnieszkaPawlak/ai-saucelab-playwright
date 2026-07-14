import { HeaderComponent } from '../components/HeaderComponent';
import { type CartState } from '../data/cart-states';
import { type CheckoutCustomer } from '../data/checkout-data';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { ShoppingFlow } from './ShoppingFlow';

export class CheckoutFlow {
  private readonly shoppingFlow: ShoppingFlow;
  private readonly header: HeaderComponent;
  private readonly cartPage: CartPage;
  private readonly checkoutStepOne: CheckoutStepOnePage;
  private readonly checkoutOverview: CheckoutOverviewPage;
  private readonly checkoutComplete: CheckoutCompletePage;

  constructor(
    shoppingFlow: ShoppingFlow,
    header: HeaderComponent,
    cartPage: CartPage,
    checkoutStepOne: CheckoutStepOnePage,
    checkoutOverview: CheckoutOverviewPage,
    checkoutComplete: CheckoutCompletePage,
  ) {
    this.shoppingFlow = shoppingFlow;
    this.header = header;
    this.cartPage = cartPage;
    this.checkoutStepOne = checkoutStepOne;
    this.checkoutOverview = checkoutOverview;
    this.checkoutComplete = checkoutComplete;
  }

  async completeCheckout(productId: string, customer: CheckoutCustomer): Promise<void> {
    await this.shoppingFlow.addProductToCart(productId);
    await this.header.openCart();
    await this.cartPage.proceedToCheckout();
    await this.checkoutStepOne.fillCustomerInfo(
      customer.firstName,
      customer.lastName,
      customer.postalCode,
    );
    await this.checkoutStepOne.continueToOverview();
    await this.checkoutOverview.finishOrder();
  }

  async proceedToOverview(productId: string, customer: CheckoutCustomer): Promise<void> {
    await this.shoppingFlow.addProductToCart(productId);
    await this.proceedToOverviewFromCart(customer);
  }

  async proceedToOverviewForProducts(
    productIds: readonly string[],
    customer: CheckoutCustomer,
  ): Promise<void> {
    await this.shoppingFlow.addProductsToCart(productIds);
    await this.proceedToOverviewFromCart(customer);
  }

  async proceedToOverviewForCartState(
    cartState: CartState,
    customer: CheckoutCustomer,
  ): Promise<void> {
    await this.shoppingFlow.prepareCartState(cartState);
    await this.proceedToOverviewFromCart(customer);
  }

  async startCheckoutForCartState(cartState: CartState): Promise<void> {
    await this.shoppingFlow.prepareCartState(cartState);
    await this.header.openCart();
    await this.cartPage.proceedToCheckout();
  }

  private async proceedToOverviewFromCart(customer: CheckoutCustomer): Promise<void> {
    await this.header.openCart();
    await this.cartPage.proceedToCheckout();
    await this.checkoutStepOne.fillCustomerInfo(
      customer.firstName,
      customer.lastName,
      customer.postalCode,
    );
    await this.checkoutStepOne.continueToOverview();
  }

  async startCheckout(productId: string): Promise<void> {
    await this.shoppingFlow.addProductToCart(productId);
    await this.header.openCart();
    await this.cartPage.proceedToCheckout();
  }

  async cancelFromStepOne(): Promise<void> {
    await this.checkoutStepOne.cancel();
  }
}
