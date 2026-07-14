export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const DEFAULT_CUSTOMER: CheckoutCustomer = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
};
