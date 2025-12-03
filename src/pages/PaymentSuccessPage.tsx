import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import paymentService from "../services/paymentService";
import "./Checkout.css";

/**
 * PayPal Success Callback Page
 * This page is called after user approves payment on PayPal
 * URL: /payment/success?orderId={orderId}&token={paypalToken}&PayerID={payerId}
 */
const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clear } = useCart();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("orderId");
  const paypalToken = searchParams.get("token"); // PayPal order ID
  const payerId = searchParams.get("PayerID");

  useEffect(() => {
    const capturePayment = async () => {
      if (!orderId || !paypalToken) {
        setError("Missing payment information");
        setIsProcessing(false);
        return;
      }

      try {
        // Capture the payment with PayPal reference
        await paymentService.capturePayment(Number(orderId), paypalToken);

        // Clear cart
        clear();

        // Wait a moment then redirect to confirmation
        setTimeout(() => {
          navigate("/checkout/confirmation", {
            state: { orderId: Number(orderId) },
          });
        }, 2000);
      } catch (err) {
        console.error("Failed to capture payment:", err);
        setError("Failed to complete payment. Please contact support.");
        setIsProcessing(false);
      }
    };

    capturePayment();
  }, [orderId, paypalToken, payerId, navigate, clear]);

  if (error) {
    return (
      <main className="checkout-shell">
        <div
          className="panel"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}
        >
          <div style={{ fontSize: 64, color: "#ef4444" }}>✗</div>
          <h1>Payment Failed</h1>
          <p className="muted">{error}</p>
          <p className="muted">Order ID: {orderId}</p>
          <div style={{ marginTop: 24 }}>
            <Link className="btn primary" to="/cart">
              Return to Cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-shell">
      <div
        className="panel"
        style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}
      >
        <div style={{ fontSize: 64, color: "#10b981" }}>⏳</div>
        <h1>Processing Payment</h1>
        <p className="muted">
          {isProcessing
            ? "Please wait while we confirm your payment..."
            : "Redirecting to confirmation page..."}
        </p>
        <p className="muted" style={{ marginTop: 12 }}>
          Do not close this page
        </p>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;
