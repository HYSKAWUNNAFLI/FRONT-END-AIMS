import { Link } from 'react-router-dom';
import './CartPage.css';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { lines, updateQty, removeItem, subtotal, totalItems } = useCart();

  return (
    <main className="cart-shell">
      <div className="cart-topbar">
        <Link to="/products" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Products
        </Link>
      </div>

      {lines.length === 0 && (
        <div className="panel empty-cart">
          <div style={{ fontSize: 48, color: '#cbd5e1' }}>👜</div>
          <div style={{ color: '#0f172a', fontSize: 18 }}>Your cart is empty</div>
          <p className="muted">Add some products to get started!</p>
          <Link className="btn primary" to="/products">
            Continue Shopping
          </Link>
        </div>
      )}

      <div className="cart-grid">
        <section className="cart-left">
          <h1>Shopping Cart</h1>
          {lines.length === 0 && <p className="muted">Your cart is empty.</p>}
          {lines.map(line => (
            <article key={line.productId} className="cart-card">
              <div className="cart-item">
                <img src={line.product.image} alt={line.product.title} />
                <div className="cart-info">
                  <h3>
                    <Link to={`/product/${line.product.id}`}>{line.product.title}</Link>
                  </h3>
                  <p>{line.product.genre}</p>
                  <p className="muted">Stock: {line.product.stock}</p>
                  {line.qty >= line.product.stock && (
                    <p className="warning">Only {line.product.stock} items available for this product.</p>
                  )}
                </div>
              </div>
              <div className="cart-actions">
                <div className="qty-control">
                  <button type="button" onClick={() => updateQty(line.productId, line.qty - 1)}>
                    -
                  </button>
                  <span>{line.qty}</span>
                  <button type="button" onClick={() => updateQty(line.productId, line.qty + 1)}>
                    +
                  </button>
                </div>
                <div className="cart-price">
                  <span className="muted">${line.product.price.toFixed(2)} each</span>
                  <span className="price">${(line.product.price * line.qty).toFixed(2)}</span>
                </div>
                <button className="trash" type="button" aria-label="Remove" onClick={() => removeItem(line.productId)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span className="price">${subtotal.toFixed(2)}</span>
          </div>
          <p className="muted small">Delivery fee will be calculated at checkout</p>
          <Link to="/checkout/delivery" className="btn primary block" style={{ textAlign: 'center' }}>
            Proceed to Delivery
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
