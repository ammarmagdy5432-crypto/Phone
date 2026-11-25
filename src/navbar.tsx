import React, { useState, useEffect } from 'react';

export default function AppleNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'Performance', href: '#power' },
    { name: 'Finishes', href: '#colors' },
    { name: 'Mac', href: '#hero' },
    { name: 'iPad', href: '#hero' },
    { name: 'Watch', href: '#hero' },
    { name: 'AirPods', href: '#hero' },
    { name: 'Support', href: '#colors' },
  ];

  return (
    <nav className={`apple-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#hero" className="nav-logo" aria-label="Apple Home">
          <svg height="44" viewBox="0 0 17 44" width="17" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m15.073 26.737c-.047-4.81 3.927-7.117 4.107-7.234-2.238-3.276-5.726-3.725-6.969-3.777-2.972-.301-5.807 1.752-7.315 1.752-1.508 0-3.83-1.708-6.301-1.663-3.247.047-6.241 1.884-7.912 4.792-3.376 5.856-.863 14.52 2.428 19.263 1.61 2.321 3.524 4.922 6.035 4.827 2.417-.095 3.328-1.558 6.248-1.558 2.92 0 3.738 1.558 6.28 1.511 2.593-.047 4.238-2.35 5.831-4.686 1.846-2.695 2.607-5.308 2.651-5.441-.059-.026-5.088-1.953-5.083-7.786z"
              fill="currentColor"
            />
            <path
              d="m11.932 12.339c1.332-1.614 2.23-3.858 1.984-6.104-1.921.077-4.249 1.28-5.626 2.894-1.229 1.423-2.305 3.708-2.015 5.908 2.144.166 4.325-1.084 5.657-2.698z"
              fill="currentColor"
            />
          </svg>
        </a>

        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a href="#features" className="nav-icon" aria-label="Search">
            <svg width="15" height="44" viewBox="0 0 15 44" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="6.5" cy="20.5" r="4.5" />
              <line x1="10" y1="24" x2="13.5" y2="27.5" />
            </svg>
          </a>

          <a href="#colors" className="nav-icon" aria-label="Shopping Bag">
            <svg width="14" height="44" viewBox="0 0 14 44" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M2.5 16.5H11.5V28.5C11.5 29.6046 10.6046 30.5 9.5 30.5H4.5C3.39543 30.5 2.5 29.6046 2.5 28.5V16.5Z" />
              <path d="M4.5 16.5V14.5C4.5 13.1193 5.61929 12 7 12C8.38071 12 9.5 13.1193 9.5 14.5V16.5" />
            </svg>
          </a>

          <a href="#colors" className="nav-cta-pill">
            Customize
          </a>

          <button
            className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}