import { apiClient } from "./api";

/**
 * Auth response types based on backend API
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  status?: string;
  roles?: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

/**
 * Login with email and password
 * POST /auth/login
 *
 * Backend should set an HTTP-only cookie with the auth token.
 * The cookie will be automatically included in subsequent requests
 * via axios withCredentials: true configuration.
 *
 * @param email - User email
 * @param password - User password
 * @returns Login response with user info
 *
 * @example
 * const result = await authService.login('user@example.com', 'password123');
 * // Cookie is automatically set by backend and managed by browser
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  if (response.data.success && response.data.data?.id) {
    localStorage.setItem("userId", String(response.data.data.id));
  }

  return response.data;
}

/**
 * Change user password
 * POST /auth/change-password?userId={userId}
 *
 * Requires authentication cookie to be present (set during login).
 *
 * @param userId - User ID
 * @param oldPassword - Current password
 * @param newPassword - New password
 * @returns Success response
 *
 * @example
 * await authService.changePassword(1, 'oldPass123', 'newPass123');
 */
export async function changePassword(
  userId: number | string,
  oldPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> {
  const response = await apiClient.post<ChangePasswordResponse>(
    "/auth/change-password",
    {
      oldPassword,
      newPassword,
    },
    {
      params: { userId },
    }
  );

  return response.data;
}

/**
 * Logout - call backend logout endpoint to clear auth cookie
 * Add this endpoint to your backend if it doesn't exist yet
 */
export async function logout(): Promise<void> {
  try {
    // If you have a logout endpoint on backend:
    // await apiClient.post('/auth/logout');

    // For now, just redirect to login
    // Backend cookie will expire or can be cleared server-side
    localStorage.removeItem("userId");
    window.location.href = "/login";
  } catch (err) {
    // Even if logout fails, redirect to login
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }
}

/**
 * Check if user is authenticated
 * This should ideally call a backend endpoint to verify the session cookie
 * For now, you can implement a /auth/me or /auth/status endpoint
 */
export async function checkAuth(): Promise<boolean> {
  try {
    // Call a backend endpoint to verify auth status
    // Example: await apiClient.get('/auth/me');
    // For now, return true if no error
    return true;
  } catch (err) {
    return false;
  }
}

// Export as default object for convenience
const authService = {
  login,
  changePassword,
  logout,
  checkAuth,
};

export default authService;
