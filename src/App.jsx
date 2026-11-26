import { lazy, Suspense } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { RouterProvider, ScrollManager, useRouter } from './lib/router';
import { BagProvider } from './context/BagContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Spinner } from './components/UI';

const HomePage = lazy(() => import('./pages/HomePage'));
const BuyPage = lazy(() => import('./pages/BuyPage'));
const BagPage = lazy(() => import('./pages/BagPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AccessoriesPage = lazy(() => import('./pages/AccessoriesPage'));
const SpecsPage = lazy(() => import('./pages/SpecsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export const ROUTES = {
  '/': HomePage,
  '/buy': BuyPage,
  '/bag': BagPage,
  '/checkout': CheckoutPage,
  '/accessories': AccessoriesPage,
  '/specs': SpecsPage,
  '/support': SupportPage,
  '/legal': LegalPage,
  '/sitemap': SitemapPage,
};

function PageLoader() {
  return (
    <div className="page-loader" role="status">
      <Spinner size={22} />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

function Routes() {
  const { pathname } = useRouter();
  const Page = ROUTES[pathname] || NotFoundPage;

  return (
    <Suspense fallback={<PageLoader />}>
      {/* Opacity-only transition: transforms would break fixed / pinned 3D layers. */}
      <motion.main
        id="main"
        key={pathname}
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Page />
      </motion.main>
    </Suspense>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <ToastProvider>
          <BagProvider>
            <ScrollManager />
            <Navbar />
            <Routes />
            <Footer />
          </BagProvider>
        </ToastProvider>
      </RouterProvider>
    </MotionConfig>
  );
}
