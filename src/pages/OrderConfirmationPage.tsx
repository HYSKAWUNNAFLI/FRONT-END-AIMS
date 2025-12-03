import { Link } from 'react-router-dom';
import './Checkout.css';

const OrderConfirmationPage = () => (
  <main className="checkout-shell">
    <div className="panel" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
      <h1>Order Confirmed</h1>
      <p className="muted">Trạng thái: Pending Processing. Chúng tôi đã gửi email thông tin đơn hàng cho bạn.</p>
      <p className="muted">Mã giao dịch: TXN-{Math.floor(Math.random() * 1000000)}</p>
      <div style={{ marginTop: 14 }}>
        <Link className="btn primary" to="/products">
          Quay lại cửa hàng
        </Link>
      </div>
    </div>
  </main>
);

export default OrderConfirmationPage;
