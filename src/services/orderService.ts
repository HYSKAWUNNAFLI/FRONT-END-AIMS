import { apiClient } from "./api";

/**
 * Order-related types
 */
export interface OrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  customerEmail: string;
  customerName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  shippingFee: number;
  items: OrderItem[];
}

export interface Order {
  id: number;
  orderNumber?: string;
  customerEmail: string;
  customerName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  shippingFee: number;
  subtotal?: number;
  total?: number;
  status?: string;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderResponse {
  order?: Order;
  message?: string;
  orderId?: number;
}

/**
 * Create a new order
 * POST /orders
 *
 * @param orderData - Order details including customer info and items
 * @returns Created order with ID
 *
 * @example
 * const order = await orderService.createOrder({
 *   customerEmail: 'buyer@example.com',
 *   customerName: 'John Doe',
 *   phone: '0123456789',
 *   addressLine: '123 Main St',
 *   city: 'Hanoi',
 *   province: 'HN',
 *   postalCode: '100000',
 *   shippingFee: 2.50,
 *   items: [
 *     { productId: 1, productTitle: 'Book', quantity: 2, price: 20.00 }
 *   ]
 * });
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Create a new order
 * POST /orders
 *
 * @param orderData - Order details including customer info and items
 * @returns Created order with ID
 *
 * @example
 * const order = await orderService.createOrder({
 *   customerEmail: 'buyer@example.com',
 *   customerName: 'John Doe',
 *   phone: '0123456789',
 *   addressLine: '123 Main St',
 *   city: 'Hanoi',
 *   province: 'HN',
 *   postalCode: '100000',
 *   shippingFee: 2.50,
 *   items: [
 *     { productId: 1, productTitle: 'Book', quantity: 2, price: 20.00 }
 *   ]
 * });
 */
export async function createOrder(
  orderData: CreateOrderRequest
): Promise<Order> {
  const response = await apiClient.post<ApiResponse<Order>>("/orders", orderData);
  return response.data.data;
}

/**
 * Get order by ID
 * GET /orders/{id}
 *
 * @param orderId - Order ID
 * @returns Order details
 *
 * @example
 * const order = await orderService.getOrder(123);
 */
export async function getOrder(orderId: number | string): Promise<Order> {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
}

/**
 * Cancel an order
 * POST /orders/{id}/cancel
 *
 * @param orderId - Order ID to cancel
 * @returns Cancelled order or confirmation
 *
 * @example
 * await orderService.cancelOrder(123);
 */
export async function cancelOrder(
  orderId: number | string
): Promise<Order | void> {
  const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
  return response.data.data;
}

/**
 * Get user's order history (if backend supports it)
 * This endpoint may need to be added to your backend
 * GET /orders?userId={userId} or GET /orders/my-orders
 *
 * @param userId - Optional user ID filter
 * @returns List of orders
 */
export async function getOrderHistory(
  userId?: number | string
): Promise<Order[]> {
  const response = await apiClient.get<Order[]>("/orders", {
    params: userId ? { userId } : undefined,
  });
  return response.data;
}

// Export as default object
const orderService = {
  createOrder,
  getOrder,
  cancelOrder,
  getOrderHistory,
};

export default orderService;
