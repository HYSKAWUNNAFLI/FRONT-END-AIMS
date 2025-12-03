import type { FC } from 'react';
import './Layout.css';

const Footer: FC = () => (
  <footer className="footer">
    <div>(c) 2025 Bookverse</div>
    <div className="footer__links">
      <a href="/terms">Terms</a>
      <a href="/privacy">Privacy</a>
      <a href="/support">Support</a>
    </div>
  </footer>
);

export default Footer;
