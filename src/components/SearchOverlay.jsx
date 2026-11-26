import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from '../lib/router';
import { searchSite, SEARCH_INDEX } from '../lib/searchIndex';
import { Icon } from './Icons';

const QUICK_LINKS = SEARCH_INDEX.filter((i) =>
  ['/buy', '/specs', '/accessories', '/#colors', '/support#order-status'].includes(i.to)
);

/** Global command-palette style search (⌘K / Ctrl+K or "/"). */
export default function SearchOverlay({ open, onClose }) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => (query.trim() ? searchSite(query) : QUICK_LINKS), [query]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActive(0);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (item) => {
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  let lastGroup = null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="search-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            onKeyDown={onKeyDown}
          >
            <div className="search-input-row">
              <Icon name="search" size={20} />
              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder="Search features, specs, accessories, help…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `search-opt-${active}` : undefined}
                autoComplete="off"
              />
              <kbd className="kbd">Esc</kbd>
            </div>

            <div className="search-results" id="search-results" role="listbox" ref={listRef}>
              {!query.trim() && <p className="search-group-label">Quick links</p>}
              {results.length === 0 && (
                <div className="search-empty">
                  <Icon name="search" size={28} />
                  <p>
                    No results for <strong>“{query}”</strong>
                  </p>
                  <span>Try “camera”, “battery”, “AirPods” or “return”.</span>
                </div>
              )}
              {results.map((item, index) => {
                const showGroup = query.trim() && item.group !== lastGroup;
                lastGroup = item.group;
                return (
                  <div key={`${item.to}-${item.title}`}>
                    {showGroup && <p className="search-group-label">{item.group}</p>}
                    <button
                      type="button"
                      id={`search-opt-${index}`}
                      role="option"
                      aria-selected={index === active}
                      data-index={index}
                      className={`search-result ${index === active ? 'is-active' : ''}`}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(item)}
                    >
                      <span className="search-result-icon">
                        <Icon name={item.icon} size={18} />
                      </span>
                      <span className="search-result-text">
                        <span className="search-result-title">{item.title}</span>
                        <span className="search-result-desc">{item.description}</span>
                      </span>
                      <Icon name="arrow-right" size={16} className="search-result-arrow" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="search-footer">
              <span>
                <kbd className="kbd">↑</kbd>
                <kbd className="kbd">↓</kbd> to navigate
              </span>
              <span>
                <kbd className="kbd">↵</kbd> to open
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
