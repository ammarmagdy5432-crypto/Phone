import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Minimal client-side router built on the History API.
 * The site only needs a handful of static routes + hash scrolling, so a
 * dedicated dependency (react-router) would be overkill.
 */

const RouterContext = createContext(null);

const readLocation = () => ({
  pathname: normalizePath(window.location.pathname),
  search: window.location.search,
  hash: window.location.hash,
  key: Math.random().toString(36).slice(2),
});

function normalizePath(path) {
  if (!path) return '/';
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Smoothly scroll to an element id, retrying while lazy content mounts. */
export function scrollToHash(hash, { behavior = 'smooth', attempts = 30 } = {}) {
  const id = decodeURIComponent((hash || '').replace(/^#/, ''));
  if (!id) return;
  let tries = 0;
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior, block: 'start' });
      return;
    }
    if (tries++ < attempts) window.setTimeout(attempt, 60);
  };
  attempt();
}

export function RouterProvider({ children }) {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const onPop = () => setLocation(readLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = new URL(to, window.location.origin);
    const nextPath = normalizePath(url.pathname);
    const samePage =
      nextPath === normalizePath(window.location.pathname) && url.search === window.location.search;

    const href = `${nextPath}${url.search}${url.hash}`;
    window.history[replace ? 'replaceState' : 'pushState']({}, '', href);

    if (samePage) {
      // Same page: only scroll, avoid re-mounting the page.
      if (url.hash) scrollToHash(url.hash);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      setLocation((prev) => ({ ...prev, hash: url.hash }));
      return;
    }
    setLocation(readLocation());
  }, []);

  const value = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return { ...location, query, navigate };
  }, [location, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}

/** Scrolls to top (or to the hash target) whenever the page changes. */
export function ScrollManager() {
  const { pathname, search, key, hash } = useRouter();

  useEffect(() => {
    if (hash) {
      // Give the newly mounted page (and GSAP pin spacers) a moment to lay out.
      const t = window.setTimeout(() => scrollToHash(hash), 180);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search, key]);

  return null;
}

/** Drop-in replacement for <a> that performs client-side navigation. */
export function Link({ to, onClick, children, className, activeClassName, exact = false, ...rest }) {
  const { navigate, pathname } = useRouter();
  const isExternal = /^(https?:|mailto:|tel:)/.test(to);

  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      isExternal ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  const toPath = isExternal ? null : normalizePath(to.split(/[?#]/)[0] || '/');
  const isActive =
    toPath && !to.includes('#') && (exact ? pathname === toPath : pathname === toPath || pathname.startsWith(`${toPath}/`));

  const classes = [className, isActive && activeClassName].filter(Boolean).join(' ') || undefined;

  return (
    <a
      href={to}
      onClick={handleClick}
      className={classes}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Keeps document.title in sync with the current page. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · iPhone 15 Pro` : 'iPhone 15 Pro — Titanium. So strong. So light. So Pro.';
  }, [title]);
}
