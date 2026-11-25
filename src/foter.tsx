import React, { useState } from 'react';

const footerColumns = [
  {
    title: 'Shop and Learn',
    links: ['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'AirPods', 'TV & Home', 'Accessories'],
  },
  {
    title: 'Apple Wallet',
    links: ['Wallet', 'Apple Card', 'Apple Pay', 'Apple Cash'],
  },
  {
    title: 'Account',
    links: ['Manage Your Apple ID', 'Apple Store Account', 'iCloud.com'],
  },
  {
    title: 'Entertainment',
    links: ['Apple One', 'Apple TV+', 'Apple Music', 'Apple Arcade', 'Apple Podcasts'],
  },
  {
    title: 'About Apple',
    links: ['Newsroom', 'Apple Leadership', 'Career Opportunities', 'Investors', 'Contact Apple'],
  },
];

export default function AppleFooter() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleColumn = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <footer className="apple-footer">
      <div className="footer-container">
        <div className="footer-disclaimer">
          <p>
            1. Trade-in values will vary based on the condition, year, and configuration of your
            eligible trade-in device.
          </p>
          <p>
            2. Apple Intelligence is available in beta on all iPhone 15 Pro models with iOS
            updates.
          </p>
        </div>

        <div className="footer-separator" />

        <div className="footer-directory">
          {footerColumns.map((col, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={col.title} className={`directory-col ${isOpen ? 'is-open' : ''}`}>
                <div
                  className="col-title"
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleColumn(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleColumn(idx);
                    }
                  }}
                >
                  <span>{col.title}</span>
                  <span className="mobile-chevron">+</span>
                </div>
                <ul className="col-links">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#hero">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="footer-separator" />

        <div className="footer-buy-info">
          More ways to shop: <a href="#colors">Find an Apple Store</a> or{' '}
          <a href="#colors">other retailer</a> near you.
        </div>

        <div className="footer-legal">
          <span>Copyright &copy; {new Date().getFullYear()} Apple Inc. All rights reserved.</span>
          <div className="legal-links">
            <a href="#hero">Privacy Policy</a>
            <a href="#hero">Terms of Use</a>
            <a href="#hero">Sales and Refunds</a>
            <a href="#hero">Legal</a>
            <a href="#hero">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
}