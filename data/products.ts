export type Product = {
  id: string;
  name: string;
};

export const SAUCE_LABS_BACKPACK = 'sauce-labs-backpack';

export const PRODUCTS = {
  backpack: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
  },
  bikeLight: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
  },
  boltTShirt: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
  },
  fleeceJacket: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
  },
  onesie: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
  },
  allTheThings: {
    id: 'test-allthethings-t-shirt-red',
    name: 'Test.allTheThings() T-Shirt (Red)',
  },
} as const satisfies Record<string, Product>;

export const SORT_OPTIONS = {
  nameAsc: 'Name (A to Z)',
  nameDesc: 'Name (Z to A)',
  priceLowHigh: 'Price (low to high)',
  priceHighLow: 'Price (high to low)',
} as const;
