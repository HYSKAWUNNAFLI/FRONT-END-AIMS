import { apiClient } from "./api";

/**
 * Cart-related types
 */
export interface CartItem {
  id?: number;
  productId: number;
  productTitle?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id?: number;
  sessionKey: string;
  items: CartItem[];
  subtotal?: number;
  totalItems?: number;
}

export interface AddItemRequest {
  productId: number;
  quantity: number;
  price: number;
}

export interface UpdateItemRequest {
  productId: number;
  quantity: number;
  price: number;
}

/**
 * Get or create cart for a session
 * GET /cart?sessionKey={sessionKey}
 *
 * @param sessionKey - Unique session identifier (stored in localStorage)
 * @returns Cart object with items
 *
 * @example
 * const cart = await cartService.getCart('session-123');
 */
export async function getCart(sessionKey: string): Promise<Cart> {
  const response = await apiClient.get<Cart>("/cart", {
    params: { sessionKey },
  });
  return response.data;
}

/**
 * Add item to cart
 * POST /cart/items?sessionKey={sessionKey}
 *
 * @param sessionKey - Session identifier
 * @param item - Item to add (productId, quantity, price)
 * @returns Updated cart
 *
 * @example
 * await cartService.addItem('session-123', {
 *   productId: 1,
 *   quantity: 2,
 *   price: 20.00
 * });
 */
export async function addItem(
  sessionKey: string,
  item: AddItemRequest
): Promise<Cart> {
  const response = await apiClient.post<Cart>("/cart/items", item, {
    params: { sessionKey },
  });
  return response.data;
}

/**
 * Update cart item quantity/price
 * PATCH /cart/items?sessionKey={sessionKey}
 *
 * @param sessionKey - Session identifier
 * @param item - Updated item data
 * @returns Updated cart
 *
 * @example
 * await cartService.updateItem('session-123', {
 *   productId: 1,
 *   quantity: 3,
 *   price: 19.50
 * });
 */
export async function updateItem(
  sessionKey: string,
  item: UpdateItemRequest
): Promise<Cart> {
  const response = await apiClient.patch<Cart>("/cart/items", item, {
    params: { sessionKey },
  });
  return response.data;
}

/**
 * Remove item from cart
 * DELETE /cart/items/{cartItemId}?sessionKey={sessionKey}
 *
 * @param sessionKey - Session identifier
 * @param cartItemId - ID of cart item to remove
 * @returns Updated cart or void
 *
 * @example
 * await cartService.removeItem('session-123', 5);
 */
export async function removeItem(
  sessionKey: string,
  cartItemId: number
): Promise<void> {
  await apiClient.delete(`/cart/items/${cartItemId}`, {
    params: { sessionKey },
  });
}

/**
 * Get or create session key for cart
 * Stores in localStorage for persistence across page reloads
 */
export function getSessionKey(): string {
  const STORAGE_KEY = "cartSessionKey";
  let sessionKey = localStorage.getItem(STORAGE_KEY);

  if (!sessionKey) {
    // Generate UUID-like session key
    sessionKey = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, sessionKey);
  }

  return sessionKey;
}

/**
 * Clear session key (useful after checkout)
 */
export function clearSessionKey(): void {
  localStorage.removeItem("cartSessionKey");
}

// Export as default object
const cartService = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  getSessionKey,
  clearSessionKey,
};

export default cartService;
