import { useState } from 'react';
import { Link } from '../lib/router';
import { useToast } from '../context/ToastContext';
import { Icon } from './Icons';
import { Spinner } from './UI';

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Buy iPhone 15 Pro', to: '/buy' },
      { label: 'Buy iPhone 15 Pro Max', to: '/buy?model=pro-max' },
      { label: 'Accessories', to: '/accessories' },
      { label: 'Your Bag', to: '/bag' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Overview', to: '/#hero' },
      { label: 'Features', to: '/#features' },
      { label: 'Performance', to: '/#power' },
      { label: 'Finishes', to: '/#colors' },
      { label: 'Tech Specs', to: '/specs' },
      { label: 'Compare Models', to: '/specs#compare' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/support' },
      { label: 'Order Status', to: '/support#order-status' },
      { label: 'Contact Us', to: '/support#contact' },
      { label: 'Returns & Refunds', to: '/legal#sales' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/legal#privacy' },
      { label: 'Terms of Use', to: '/legal#terms' },
      { label: 'Sales & Refunds', to: '/legal#sales' },
      { label: 'Site Map', to: '/sitemap' },
    ],
  },
];

function Newsletter() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setStatus('loading');
    window.setTimeout(() => {
      setStatus('done');
      toast({ title: 'You’re subscribed', description: `Updates will be sent to ${email.trim()}.` });
    }, 700);
  };

  if (status === 'done') {
    return (
      <div className="newsletter newsletter-done">
        <span className="newsletter-check">
          <Icon name="check" size={16} />
        </span>
        <div>
          <strong>Thanks for subscribing!</strong>
          <p>We’ll only email you about launches and offers.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="newsletter" onSubmit={submit} noValidate>
      <label htmlFor="newsletter-email" className="newsletter-title">
        Stay in the loop
      </label>
      <p className="newsletter-copy">Get launch news, offers and tips for your iPhone.</p>
      <div className={`newsletter-row ${error ? 'has-error' : ''}`}>
        <input
          id="newsletter-email"
          type="email"
          className="input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'newsletter-error' : undefined}
          autoComplete="email"
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? <Spinner /> : 'Subscribe'}
        </button>
      </div>
      {error && (
        <p className="field-error" id="newsletter-error">
          <Icon name="alert" size={14} /> {error}
        </p>
      )}
    </form>
  );
}

export default function Footer() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <footer className="apple-footer">
      <div className="footer-container">
        <div className="footer-top">
          <Newsletter />
          <div className="footer-cta">
            <p>Ready when you are.</p>
            <div className="footer-cta-actions">
              <Link to="/buy" className="btn btn-primary btn-sm">
                Buy now
              </Link>
              <Link to="/specs#compare" className="btn btn-secondary btn-sm">
                Compare models
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-separator" />

        <div className="footer-directory">
          {FOOTER_COLUMNS.map((col, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={col.title} className={`directory-col ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="col-title"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                >
                  <span>{col.title}</span>
                  <span className="mobile-chevron" aria-hidden="true">
                    <Icon name="plus" size={14} />
                  </span>
                </button>
                <ul className="col-links">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="footer-separator" />

        <div className="footer-disclaimer">
          <p>
            Prices shown in USD and include free standard delivery. Battery life varies by use and configuration.
            Apple Intelligence features may vary by language and region.
          </p>
          <p>
            This is an independent concept showcase and is not affiliated with Apple Inc. Apple, iPhone and the Apple
            logo are trademarks of Apple Inc. No real orders are placed or payments processed.
          </p>
        </div>

        <div className="footer-legal">
          <span>© {new Date().getFullYear()} iPhone 15 Pro Concept Experience.</span>
          <div className="legal-links">
            <Link to="/legal#privacy">Privacy</Link>
            <Link to="/legal#terms">Terms</Link>
            <Link to="/legal#sales">Sales &amp; Refunds</Link>
            <Link to="/sitemap">Site Map</Link>
          </div>
          <button
            type="button"
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top <Icon name="arrow-up" size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
