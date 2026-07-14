export const SELECTORS = {
  login: {
    username: '#user-name',
    password: '#password',
    loginButton: '#login-button',
    error: '[data-test="error"]',
  },
  header: {
    title: '[data-test="title"]',
    cartLink: '.shopping_cart_link',
    cartBadge: '.shopping_cart_badge',
  },
  inventory: {
    sortDropdown: '[data-test="product-sort-container"]',
    item: '.inventory_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
  },
  cart: {
    title: '[data-test="title"]',
    item: '.cart_item',
    checkout: '[data-test="checkout"]',
    continueShopping: '[data-test="continue-shopping"]',
  },
  checkout: {
    stepOne: {
      firstName: '[data-test="firstName"]',
      lastName: '[data-test="lastName"]',
      postalCode: '[data-test="postalCode"]',
      continue: '[data-test="continue"]',
      cancel: '[data-test="cancel"]',
      error: '[data-test="error"]',
    },
    overview: {
      finish: '[data-test="finish"]',
      cancel: '[data-test="cancel"]',
      subtotal: '[data-test="subtotal-label"]',
      tax: '[data-test="tax-label"]',
      total: '[data-test="total-label"]',
    },
    complete: {
      header: '[data-test="complete-header"]',
      backToProducts: '[data-test="back-to-products"]',
    },
  },
  sidebar: {
    menuButton: '#react-burger-menu-btn',
    menuWrap: '.bm-menu-wrap',
    allItems: '#inventory_sidebar_link',
    about: '#about_sidebar_link',
    resetAppState: '#reset_sidebar_link',
    logout: '#logout_sidebar_link',
  },
} as const;

export function addToCartSelector(productId: string): string {
  return `[data-test="add-to-cart-${productId}"]`;
}

export function removeFromCartSelector(productId: string): string {
  return `[data-test="remove-${productId}"]`;
}
