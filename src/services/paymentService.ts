import { apiClient } from "./api";

/**
 * Payment-related types
 */
export type PaymentProvider = "PAYPAL" | "VIETQR";

export interface CreatePaymentRequest {
  orderId: number;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  successReturnUrl: string;
  cancelReturnUrl: string;
}

export interface Payment {
  id: number;
  orderId: number;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status?: string;
  providerReference?: string;
  approvalUrl?: string; // PayPal redirect URL
  createdAt?: string;
  updatedAt?: string;
}

export interface CapturePaymentResponse {
  success: boolean;
  message?: string;
  payment?: Payment;
}

export interface RefundRequest {
  transactionId: number;
  amount: number;
}

export interface RefundResponse {
  success: boolean;
  message?: string;
  refundId?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Create a payment (initialize payment with provider)
 * POST /payments
 *
 * @param paymentData - Payment details including orderId, provider, amount
 * @returns Payment object with approval URL (for PayPal) or payment info
 *
 * @example
 * const payment = await paymentService.createPayment({
 *   orderId: 123,
 *   provider: 'PAYPAL',
 *   amount: 40.00,
 *   currency: 'USD',
 *   successReturnUrl: 'http://localhost:3000/payment/success',
 *   cancelReturnUrl: 'http://localhost:3000/payment/cancel'
 * });
 *
 * // Redirect user to PayPal
 * if (payment.approvalUrl) {
 *   window.location.href = payment.approvalUrl;
 * }
 */
export async function createPayment(
  paymentData: CreatePaymentRequest
): Promise<Payment> {
  const response = await apiClient.post<ApiResponse<Payment>>("/payments", paymentData);
  return response.data.data;
}

/**
 * Capture/complete a payment after user approval
 * POST /payments/{id}/capture?providerReference={providerReference}
 *
 * Called after user returns from PayPal (or other provider)
 *
 * @param paymentId - Payment ID from createPayment
 * @param providerReference - Provider's order/transaction ID (from query params)
 * @returns Capture result
 *
 * @example
 * // After PayPal redirect to success URL with ?token=...&PayerID=...
 * const result = await paymentService.capturePayment(123, 'PAYPAL_ORDER_ID');
 */
export async function capturePayment(
  paymentId: number | string,
  providerReference: string
): Promise<CapturePaymentResponse> {
  const response = await apiClient.post<ApiResponse<CapturePaymentResponse>>(
    `/payments/${paymentId}/capture`,
    null,
    {
      params: { providerReference },
    }
  );
  return response.data.data;
}

/**
 * Refund a payment (full or partial)
 * POST /payments/{id}/refund
 *
 * @param paymentId - Payment ID to refund
 * @param refundData - Transaction ID and refund amount
 * @returns Refund result
 *
 * @example
 * await paymentService.refundPayment(123, {
 *   transactionId: 456,
 *   amount: 10.00
 * });
 */
export async function refundPayment(
  paymentId: number | string,
  refundData: RefundRequest
): Promise<RefundResponse> {
  const response = await apiClient.post<ApiResponse<RefundResponse>>(
    `/payments/${paymentId}/refund`,
    refundData
  );
  return response.data.data;
}

/**
 * Get payment details by ID (if backend supports)
 * GET /payments/{id}
 *
 * @param paymentId - Payment ID
 * @returns Payment details
 */
export async function getPayment(paymentId: number | string): Promise<Payment> {
  const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${paymentId}`);
  return response.data.data;
}

// Export as default object
const paymentService = {
  createPayment,
  capturePayment,
  refundPayment,
  getPayment,
};

export default paymentService;
