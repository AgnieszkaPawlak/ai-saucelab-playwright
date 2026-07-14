export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutCustomerBuilder {
  private firstName = 'Test';
  private lastName = 'User';
  private postalCode = '12345';

  withFirstName(firstName: string): this {
    this.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.lastName = lastName;
    return this;
  }

  withPostalCode(postalCode: string): this {
    this.postalCode = postalCode;
    return this;
  }

  build(): CheckoutCustomer {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      postalCode: this.postalCode,
    };
  }
}

export function checkoutCustomer(): CheckoutCustomerBuilder {
  return new CheckoutCustomerBuilder();
}

export const DEFAULT_CUSTOMER = checkoutCustomer().build();
