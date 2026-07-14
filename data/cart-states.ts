import { PRODUCTS } from './products';

export type CartState = {
  readonly productIds: readonly string[];
  readonly label: string;
};

export const CART_STATES = {
  empty: {
    productIds: [],
    label: 'empty',
  },
  singleBackpack: {
    productIds: [PRODUCTS.backpack.id],
    label: 'single-backpack',
  },
  backpackAndBikeLight: {
    productIds: [PRODUCTS.backpack.id, PRODUCTS.bikeLight.id],
    label: 'backpack-and-bike-light',
  },
} as const satisfies Record<string, CartState>;

export type CartStateKey = keyof typeof CART_STATES;
