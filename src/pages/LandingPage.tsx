import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => (
  <main className="landing__hero">
    <div className="landing__card">
      <div className="landing__icon">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
          <path d="M6 2h12a2 2 0 0 1 2 2v16l-8-3-8 3V4a2 2 0 0 1 2-2Z" />
        </svg>
      </div>
      <h1>AIMS Store</h1>
      <p>Your one-stop shop for books, newspapers, CDs, and DVDs</p>
      <Link className="btn primary" to="/products">
        Start Shopping
      </Link>
    </div>
  </main>
);

export default LandingPage;
