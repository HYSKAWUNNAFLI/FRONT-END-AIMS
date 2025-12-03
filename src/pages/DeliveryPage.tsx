import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useCart } from "../context/CartContext";
import type { DeliveryInfo } from "../types";
import orderService from "../services/orderService";

const baseDeliveryFee = 10;

const DeliveryPage = () => {
  const navigate = useNavigate();
  const { subtotal, lines } = useCart();
  const [form, setForm] = useState<DeliveryInfo>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    note: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const deliveryFee = useMemo(
    () => (subtotal > 100 ? 0 : baseDeliveryFee),
    [subtotal]
  );
  const total = subtotal + deliveryFee;

  const onContinue = async () => {
    setTouched({
      fullName: true,
      phone: true,
      address: true,
      city: true,
      state: true,
    });

    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state
    ) {
      return;
    }

    setIsCreatingOrder(true);

    try {
      // Create order with delivery info and cart items
      const order = await orderService.createOrder({
        customerEmail: "customer@example.com", // TODO: Get from auth context if available
        customerName: form.fullName,
        phone: form.phone,
        addressLine: form.address,
        city: form.city,
        province: form.state,
        postalCode: "00000", // TODO: Add postal code field if needed
        shippingFee: deliveryFee,
        items: lines.map((line) => ({
          productId: Number(line.productId),
          productTitle: line.product.title,
          quantity: line.qty,
          price: line.product.price,
        })),
      });

      // Navigate to payment with order ID
      navigate("/checkout/payment", {
        state: {
          orderId: order.id,
          deliveryInfo: form,
          deliveryFee,
          total,
        },
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (lines.length === 0) {
    return (
      <main className="checkout-shell">
        <div className="checkout-topbar">
          <Link to="/cart" className="back-link">
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
            Back to Cart
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

  return (
    <main className="checkout-shell">
      <div className="checkout-topbar">
        <Link to="/cart" className="back-link">
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
          Back to Cart
        </Link>
      </div>

      <h1 style={{ margin: "0 0 18px" }}>Delivery Information</h1>
      <div className="checkout-layout">
        <section className="panel">
          <h3>Shipping Address</h3>
          <div className="input-group">
            <label>Full Name *</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
              placeholder="John Doe"
            />
            {touched.fullName && !form.fullName && (
              <span className="warning">Bắt buộc nhập</span>
            )}
          </div>
          <div className="input-group">
            <label>Phone Number *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
              placeholder="(555) 123-4567"
            />
            {touched.phone && !form.phone && (
              <span className="warning">Bắt buộc nhập</span>
            )}
          </div>
          <div className="input-group">
            <label>Street Address *</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
              placeholder="123 Main St"
            />
            {touched.address && !form.address && (
              <span className="warning">Bắt buộc nhập</span>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 12,
            }}
          >
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>City *</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
                placeholder="New York"
              />
              {touched.city && !form.city && (
                <span className="warning">Bắt buộc nhập</span>
              )}
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>State/Province *</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                onBlur={() => setTouched((prev) => ({ ...prev, state: true }))}
                placeholder="NY"
              />
              {touched.state && !form.state && (
                <span className="warning">Bắt buộc nhập</span>
              )}
            </div>
          </div>
          <div className="input-group" style={{ marginTop: 12 }}>
            <label>Delivery Instructions (Optional)</label>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Leave at front door, ring bell, etc."
            />
          </div>
        </section>

        <aside className="panel">
          <h3>Delivery Summary</h3>
          <div className="summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="muted small">
                Free delivery on orders over $100
              </span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span className="price">${total.toFixed(2)}</span>
            </div>
            <button
              className="btn primary block"
              type="button"
              onClick={onContinue}
              disabled={isCreatingOrder}
            >
              {isCreatingOrder ? "Creating Order..." : "Continue to Payment"}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default DeliveryPage;
