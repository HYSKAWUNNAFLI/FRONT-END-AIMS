import { useEffect, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products as mockProducts } from '../data/products';
import { getProductById } from '../services/productService';
import type { Product } from '../types';
import './ProductDetail.css';
import { useCart } from '../context/CartContext';

const fallback = mockProducts[0];

const ViewProductDetail: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product>(fallback);

  useEffect(() => {
    if (!id) return;
    getProductById(id).then(res => {
      if (res) setProduct(res);
    });
  }, [id]);
  const [qty, setQty] = useState<number>(1);
  const total = (product.price * qty).toFixed(2);

  const changeQty = (delta: number) => {
    setQty(current => Math.max(1, Math.min(99, current + delta)));
  };

  const addToCart = () => {
    addItem(product.id, qty);
    alert(`Added ${qty} of "${product.title}" to cart.`);
  };

  const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const typeSpecific = () => {
    const entries = product.details ? Object.entries(product.details) : [];
    if (!entries.length) return null;
    return entries.map(([key, value]) => (
      <div className="detail-row" key={key}>
        <span>{formatKey(key)}:</span>
        <span>{value}</span>
      </div>
    ));
  };

  return (
    <div className="content">
      <div className="back-row">
        <button className="back-link" type="button" onClick={() => navigate(-1)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Back to Products</span>
        </button>
      </div>

      <div className="product-shell">
        <div className="product__image-card">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product__info-card">
          <span className="pill">{product.category}</span>
          <h1 className="title">{product.title}</h1>
          <p className="category">{product.genre}</p>
          <div className="price-main">${product.price.toFixed(2)}</div>
          <p className="stock">Stock available: {product.stock} units</p>
          <p className="desc muted">{product.shortDesc}</p>

          <div className="details-card">
            <h3>Product Details</h3>
            {typeSpecific()}
          </div>

          <div className="cart-card">
            <h3>Add to Cart</h3>
            <div className="cart-row">
              <div className="qty-control">
                <button onClick={() => changeQty(-1)} aria-label="Decrease quantity" type="button">
                  -
                </button>
                <span>{qty}</span>
                <button onClick={() => changeQty(1)} aria-label="Increase quantity" type="button">
                  +
                </button>
              </div>
              <div className="total">Total: ${total}</div>
            </div>
            <button className="btn primary block cart-button" onClick={addToCart} type="button">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l1.68 10.06a2 2 0 0 0 2 1.69h7.72a2 2 0 0 0 2-1.69l.6-4.06H6" />
              </svg>
              Add to Cart
            </button>
            <div className="action-row">
              <button className="btn light" type="button" onClick={() => navigate('/products')}>
                Back to list
              </button>
              <button className="btn light" type="button" onClick={() => navigate('/cart')}>
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetail;
