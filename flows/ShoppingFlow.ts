import { HeaderComponent } from '../components/HeaderComponent';
import { InventoryPage } from '../pages/InventoryPage';

export class ShoppingFlow {
  private readonly inventoryPage: InventoryPage;
  private readonly header: HeaderComponent;

  constructor(inventoryPage: InventoryPage, header: HeaderComponent) {
    this.inventoryPage = inventoryPage;
    this.header = header;
  }

  async addProductToCart(productId: string): Promise<void> {
    const addButton = this.inventoryPage.productAddToCartButton(productId);
    if (await addButton.isVisible()) {
      await addButton.click();
      return;
    }

    const removeButton = this.inventoryPage.productRemoveButton(productId);
    if (await removeButton.isVisible()) {
      return;
    }

    throw new Error(`Product "${productId}" not found on inventory page`);
  }

  async getCartItemCount(): Promise<number> {
    return this.header.getCartItemCount();
  }
}
