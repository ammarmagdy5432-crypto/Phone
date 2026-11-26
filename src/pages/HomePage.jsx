import { motion } from 'framer-motion';
import { Link, useDocumentTitle } from '../lib/router';
import HeroScene from '../home/HeroScene';
import StoryScroll from '../home/StoryScroll';
import PowerSection from '../home/PowerSection';
import FinishSection from '../home/FinishSection';
import BuyBand from '../home/BuyBand';
import { formatPrice, monthly, startingPrice } from '../lib/catalog';

export default function HomePage() {
  useDocumentTitle(null);

  return (
    <div className="home">
      <HeroScene />

      {/* ===================== Hero ===================== */}
      <section id="hero" className="h1Text">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hero-copy"
        >
          <span className="hero-eyebrow">Titanium · A17 Pro</span>
          <h1 className="hero-title">iPhone 15</h1>
          <p className="hero-subtitle" aria-hidden="true">
            Pro
          </p>
          <span className="sr-only">Pro</span>
          <p className="hero-tagline">
            Forged in titanium. Powered by the groundbreaking A17 Pro chip with a customizable Action button and
            pro-class camera system.
          </p>
          <div className="hero-actions">
            <Link to="/buy" className="btn btn-primary btn-lg">
              Buy now
            </Link>
            <Link to="/#colors" className="btn btn-secondary btn-lg">
              Explore finishes
            </Link>
          </div>
          <p className="hero-price">
            From {formatPrice(startingPrice('pro'))} or {monthly(startingPrice('pro'))}/mo. for 24 mo.
          </p>
        </motion.div>

        <Link to="/#features" className="hero-scroll-hint" aria-label="Scroll to features">
          <span>Scroll to explore</span>
          <span className="hero-scroll-line" />
        </Link>
      </section>

      {/* ===================== Story ===================== */}
      <section id="features" aria-label="Features">
        <StoryScroll />
      </section>

      {/* ===================== Performance ===================== */}
      <section id="power" aria-label="Performance">
        <PowerSection />
      </section>

      {/* ===================== Finishes / 360° ===================== */}
      <section id="colors" aria-label="Finishes">
        <FinishSection />
      </section>

      <BuyBand />
    </div>
  );
}
