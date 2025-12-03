import { apiClient } from "./api";
import type { Paginated, Product } from "../types";

/**
 * Admin-related types
 */
export interface User {
  id: number;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roles: string[];
}

export interface CreateProductRequest {
  productType: "BOOK" | "CD" | "DVD" | "NEWSPAPER";
  status: "ACTIVE" | "INACTIVE";
  barcode: string;
  title: string;
  category: string;
  conditionLabel?: string;
  dominantColor?: string;
  returnPolicy?: string;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  originalValue: number;
  currentPrice: number;
  stock: number;
  // Product-specific details (add based on product type)
  bookDetail?: any;
  cdDetail?: any;
  dvdDetail?: any;
  newspaperDetail?: any;
}

/**
 * USER MANAGEMENT
 */

/**
 * Create a new user (admin only)
 * POST /admin/users
 *
 * @param userData - User details
 * @returns Created user
 *
 * @example
 * const user = await adminService.createUser({
 *   email: 'admin@example.com',
 *   password: 'admin123',
 *   status: 'ACTIVE',
 *   roles: ['ADMIN']
 * });
 */
export async function createUser(userData: CreateUserRequest): Promise<User> {
  const response = await apiClient.post<User>("/admin/users", userData);
  return response.data;
}

/**
 * List all users with pagination
 * GET /admin/users?page={page}&size={size}
 *
 * @param page - Page number (0-based for backend)
 * @param size - Items per page
 * @returns Paginated user list
 *
 * @example
 * const users = await adminService.listUsers(0, 20);
 */
export async function listUsers(page = 0, size = 20): Promise<Paginated<User>> {
  const response = await apiClient.get<Paginated<User>>("/admin/users", {
    params: { page, size },
  });
  return response.data;
}

/**
 * Get user by ID
 * GET /admin/users/{id}
 *
 * @param userId - User ID
 * @returns User details
 *
 * @example
 * const user = await adminService.getUser(123);
 */
export async function getUser(userId: number | string): Promise<User> {
  const response = await apiClient.get<User>(`/admin/users/${userId}`);
  return response.data;
}

/**
 * Update user (if backend supports)
 * PUT /admin/users/{id}
 *
 * @param userId - User ID
 * @param userData - Updated user data
 * @returns Updated user
 */
export async function updateUser(
  userId: number | string,
  userData: Partial<CreateUserRequest>
): Promise<User> {
  const response = await apiClient.put<User>(
    `/admin/users/${userId}`,
    userData
  );
  return response.data;
}

/**
 * Delete user (if backend supports)
 * DELETE /admin/users/{id}
 *
 * @param userId - User ID to delete
 */
export async function deleteUser(userId: number | string): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}`);
}

/**
 * PRODUCT MANAGEMENT
 */

/**
 * Create a new product (admin only)
 * POST /admin/products
 *
 * @param productData - Product details
 * @returns Created product
 *
 * @example
 * const product = await adminService.createProduct({
 *   productType: 'BOOK',
 *   status: 'ACTIVE',
 *   barcode: '1234567890123',
 *   title: 'Sample Book',
 *   category: 'Books',
 *   conditionLabel: 'New',
 *   dominantColor: 'Blue',
 *   returnPolicy: '30 days',
 *   height: 20.0,
 *   width: 13.0,
 *   length: 2.0,
 *   weight: 0.5,
 *   originalValue: 25.00,
 *   currentPrice: 20.00,
 *   stock: 100,
 *   bookDetail: null
 * });
 */
export async function createProduct(
  productData: CreateProductRequest
): Promise<Product> {
  const response = await apiClient.post<Product>(
    "/admin/products",
    productData
  );
  return response.data;
}

/**
 * Update product (if backend supports)
 * PUT /admin/products/{id}
 *
 * @param productId - Product ID
 * @param productData - Updated product data
 * @returns Updated product
 */
export async function updateProduct(
  productId: number | string,
  productData: Partial<CreateProductRequest>
): Promise<Product> {
  const response = await apiClient.put<Product>(
    `/admin/products/${productId}`,
    productData
  );
  return response.data;
}

/**
 * Delete product (if backend supports)
 * DELETE /admin/products/{id}
 *
 * @param productId - Product ID to delete
 */
export async function deleteProduct(productId: number | string): Promise<void> {
  await apiClient.delete(`/admin/products/${productId}`);
}

// Export as default object
const adminService = {
  // User management
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  // Product management
  createProduct,
  updateProduct,
  deleteProduct,
};

export default adminService;
