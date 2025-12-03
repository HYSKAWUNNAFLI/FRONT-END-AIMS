import { Navigate, Route, Routes } from 'react-router-dom';
import './components/Layout.css';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import ViewProductDetail from './pages/ViewProductDetail';
import ContactPage from './pages/ContactPage';
import DeliveryPage from './pages/DeliveryPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route element={<MainLayout />}>
      <Route path="/home" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ViewProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout/delivery" element={<DeliveryPage />} />
      <Route path="/checkout/payment" element={<PaymentPage />} />
      <Route path="/checkout/confirmation" element={<OrderConfirmationPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);

export default App;
