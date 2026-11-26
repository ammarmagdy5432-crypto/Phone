import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useRouter } from '../lib/router';
import { useBag } from '../context/BagContext';
import { AppleLogo, Icon } from './Icons';
import SearchOverlay from './SearchOverlay';

const NAV_LINKS = [
  { name: 'Overview', to: '/#hero', section: 'hero' },
  { name: 'Features', to: '/#features', section: 'features' },
  { name: 'Performance', to: '/#power', section: 'power' },
  { name: 'Finishes', to: '/#colors', section: 'colors' },
  { name: 'Tech Specs', to: '/specs' },
  { name: 'Accessories', to: '/accessories' },
  { name: 'Support', to: '/support' },
];

const HOME_SECTIONS = NAV_LINKS.filter((l) => l.section).map((l) => l.section);

export default function Navbar() {
  const { pathname } = useRouter();
  const { count } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const isHome = pathname === '/';

  // Background change + scroll-spy for the home page sections.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      if (!isHome) return;
      const probe = window.innerHeight * 0.4;
      let current = HOME_SECTIONS[0];
      HOME_SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      });
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Close the mobile menu on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  // Keyboard shortcuts: Esc closes menu, ⌘K / Ctrl+K / "/" opens search.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
      if ((e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isLinkActive = (link) => (link.section ? isHome && activeSection === link.section : pathname === link.to);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <nav className={`apple-nav ${scrolled || menuOpen ? 'scrolled' : ''}`} aria-label="Primary">
        <div className="nav-container">
          <Link to="/" className="nav-logo" aria-label="iPhone 15 Pro home">
            <AppleLogo size={18} />
          </Link>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link to={link.to} className={isLinkActive(link) ? 'is-active' : undefined}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button type="button" className="nav-icon" aria-label="Search (Ctrl+K)" onClick={() => setSearchOpen(true)}>
              <Icon name="search" size={17} />
            </button>

            <Link to="/bag" className="nav-icon nav-bag" aria-label={`Shopping bag, ${count} item${count === 1 ? '' : 's'}`}>
              <Icon name="bag" size={17} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    className="nav-bag-count"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link to="/buy" className="nav-cta-pill">
              Buy
            </Link>

            <button
              type="button"
              className={`mobile-toggle ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'calc(100dvh - var(--nav-height))' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } } }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.li
                    key={link.name}
                    variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <Link
                      to={link.to}
                      className={isLinkActive(link) ? 'is-active' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.name}
                      <Icon name="chevron-right" size={18} />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mobile-menu-actions">
                <Link to="/buy" className="btn btn-primary btn-block" onClick={() => setMenuOpen(false)}>
                  Buy iPhone 15 Pro
                </Link>
                <Link to="/bag" className="btn btn-secondary btn-block" onClick={() => setMenuOpen(false)}>
                  View bag{count > 0 ? ` (${count})` : ''}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
