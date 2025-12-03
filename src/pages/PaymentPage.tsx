import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useCart } from "../context/CartContext";
import paymentService from "../services/paymentService";
import { QRCodeCanvas } from "qrcode.react";

type PaymentMethod = "vietqr" | "paypal";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { orderId?: number; deliveryFee?: number; total?: number };
  };
  const orderId = location.state?.orderId;
  const deliveryFee = location.state?.deliveryFee ?? 10;
  const total = location.state?.total ?? 0;
  const { lines, subtotal, clear } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("vietqr");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculatedTotal = useMemo(
    () => total || subtotal + deliveryFee,
    [total, subtotal, deliveryFee]
  );

  if (lines.length === 0) {
    return (
      <main className="checkout-shell">
        <div className="checkout-topbar">
          <Link to="/products" className="back-link">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Products
          </Link>
        </div>
        <div className="panel empty-cart">
          <div style={{ fontSize: 48, color: "#cbd5e1" }}>👜</div>
          <div>Your cart is empty</div>
          <Link className="btn primary" to="/products">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentLinkId, setPaymentLinkId] = useState<string | null>(null);

  // Fetch VietQR code when method is selected
  useEffect(() => {
    if (method === "vietqr" && orderId && !qrCodeUrl) {
      const fetchQr = async () => {
        setIsProcessing(true);
        try {
          // Use the new VietQR endpoint
          const payment = await paymentService.createVietQRPayment({
            orderId,
            provider: "VIETQR",
            amount: calculatedTotal,
            currency: "VND", // VietQR usually requires VND
            successReturnUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
            cancelReturnUrl: `${window.location.origin}/payment/cancel`,
          });

          if (payment.qrCode) {
            setQrCodeUrl(payment.qrCode);
          }
          if (payment.paymentLinkId) {
            setPaymentLinkId(payment.paymentLinkId);
          }
        } catch (error) {
          console.error("Failed to create VietQR payment:", error);
        } finally {
          setIsProcessing(false);
        }
      };
      fetchQr();
    }
  }, [method, orderId, calculatedTotal, qrCodeUrl]);

  const handlePay = async (simulateSuccess: boolean) => {
    if (!orderId) {
      alert("No order found. Please start from delivery page.");
      return;
    }

    setIsProcessing(true);

    try {
      if (method === "paypal") {
        // Create PayPal payment
        const payment = await paymentService.createPayment({
          orderId,
          provider: "PAYPAL",
          amount: calculatedTotal,
          currency: "USD",
          successReturnUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
          cancelReturnUrl: `${window.location.origin}/payment/cancel`,
        });

        // Redirect to PayPal for approval
        if (payment.approvalUrl) {
          window.location.href = payment.approvalUrl;
        } else {
          throw new Error("No approval URL received from payment provider");
        }
      } else {
        // VietQR - Check status
        if (simulateSuccess) {
          // "Tôi đã thanh toán" button clicked
          if (!paymentLinkId) {
            alert("Không tìm thấy mã thanh toán. Vui lòng thử lại.");
            return;
          }

          const statusResponse = await paymentService.checkPayOSPaymentStatus(paymentLinkId);
          
          if (statusResponse.data.status === "PAID") {
            setShowSuccess(true);
            setShowFail(false);
            // Clear cart and navigate to home as requested
            setTimeout(() => {
              clear();
              navigate("/");
            }, 1200);
          } else {
            // Still PENDING or other status
            alert("Chắc chưa được bạn chờ tí rồi thử lại");
          }
        } else {
          setShowFail(true);
          setShowSuccess(false);
        }
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setShowFail(true);
      setShowSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="checkout-shell">
      <div className="checkout-topbar">
        <button
          className="back-link"
          type="button"
          onClick={() => navigate("/checkout/delivery")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Delivery
        </button>
      </div>
      <h1 style={{ margin: "0 0 18px" }}>Payment</h1>
      <div className="checkout-layout">
        <section className="panel">
          <div className="input-group" style={{ marginBottom: 10 }}>
            <label>Chọn phương thức thanh toán</label>
            <div className="payment-tabs">
              <button
                type="button"
                className={`payment-tab ${method === "vietqr" ? "active" : ""}`}
                onClick={() => setMethod("vietqr")}
              >
                <span role="img" aria-label="qr">
                  📱
                </span>
                VietQR
              </button>
              <button
                type="button"
                className={`payment-tab ${method === "paypal" ? "active" : ""}`}
                onClick={() => setMethod("paypal")}
              >
                <span role="img" aria-label="card">
                  💳
                </span>
                PayPal
              </button>
            </div>
          </div>

          <div className="payment-body">
            {method === "vietqr" ? (
              <>
                <div className="qr-box">
                  {qrCodeUrl ? (
                    <div style={{ background: "white", padding: "10px", borderRadius: "8px" }}>
                      <QRCodeCanvas value={qrCodeUrl} size={250} />
                    </div>
                  ) : (
                    <div style={{ fontSize: 64, color: "#4f46e5" }}>
                      {isProcessing ? "..." : "▢▢"}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>Quét mã để thanh toán</div>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    Mở app ngân hàng, quét mã VietQR và hoàn tất thanh toán.
                  </p>
                </div>
                <div className="price">${calculatedTotal.toFixed(2)}</div>
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => handlePay(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Tôi đã thanh toán"}
                </button>
                <button
                  className="btn light"
                  type="button"
                  onClick={() => navigate("/")}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div style={{ width: "100%" }}>
                  <div className="input-group">
                    <label>Paypal Email</label>
                    <input placeholder="name@example.com" />
                  </div>
                  <div className="input-group">
                    <label>Ghi chú (tuỳ chọn)</label>
                    <input placeholder="Order note" />
                  </div>
                </div>
                <div className="price">${calculatedTotal.toFixed(2)}</div>
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => handlePay(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Redirecting..." : "Pay with Paypal"}
                </button>
                <button
                  className="btn light"
                  type="button"
                  onClick={() => handlePay(false)}
                  disabled={isProcessing}
                >
                  Giả lập lỗi
                </button>
              </>
            )}
          </div>
        </section>

        <aside className="panel order-mini">
          <h3>Order Summary</h3>
          <div className="summary">
            {lines.map((line) => (
              <div key={line.productId} className="summary-row">
                <span>
                  {line.product.title} x {line.qty}
                </span>
                <span>${(line.product.price * line.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span className="price">${calculatedTotal.toFixed(2)}</span>
            </div>
            <button
              className="btn light"
              type="button"
              onClick={() => navigate("/cart")}
            >
              Thay đổi sản phẩm
            </button>
          </div>
        </aside>
      </div>

      {showSuccess && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Payment Success</h2>
            <p>Thanh toán thành công. Cảm ơn bạn!</p>
          </div>
        </div>
      )}

      {showFail && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Payment Failed</h2>
            <p>Thanh toán thất bại hoặc hết thời gian. Vui lòng thử lại.</p>
            <button
              className="btn primary"
              type="button"
              onClick={() => setShowFail(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PaymentPage;
