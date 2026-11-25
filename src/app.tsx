import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import Phone from './Phone';
import StickyTextScroll from './Text';
import AppleNavbar from './NavBar';
import AppleFooter from './foter';
import PowerSection from './Section';
import ColorPickerSection from './OrbitSection';
import download from './iphone.webp';
import useViewport from './useViewport';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [phoneColor] = useState('#1c1c1e');
  const { isMobile } = useViewport();

  useEffect(() => {
    const handleScroll = () => {
      const totalScrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollableHeight <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max(currentScroll / totalScrollableHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <AppleNavbar />

      {/* الكانفاس ثابت بـ zIndex: 10 مع pointerEvents: none للسماح بالتفاعل مع الأزرار والروابط */}
      <div className="phone" aria-hidden="true">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, isMobile ? 6.2 : 5], fov: isMobile ? 50 : 45 }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 5, 2]} intensity={1.3} />

          <Suspense fallback={null}>
            <Phone
              scrollProgress={scrollProgress}
              phoneColor={phoneColor}
              isMobile={isMobile}
            />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.4, 0]} opacity={0.35} blur={2.5} far={3} />
          </Suspense>
        </Canvas>
      </div>

      {/* ===================== القسم الأول (Hero) ===================== */}
      <section id="hero" className="h1Text">
        <motion.div
          initial={{ opacity: 0, x: -90 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="hero-copy"
        >
          <span className="hero-eyebrow">Titanium &middot; A17 Pro</span>
          <h1 className="hero-title">iPhone 15</h1>
          <h2 className="hero-subtitle">Pro</h2>
          <p className="hero-tagline">
            Forged in titanium. Powered by the groundbreaking A17 Pro chip with a
            customizable Action button and pro-class camera system.
          </p>
          <div className="hero-actions">
            <a href="#colors" className="hero-btn-primary">
              Explore Finishes
            </a>
            <a href="#features" className="hero-btn-secondary">
              Discover Features
            </a>
          </div>
        </motion.div>

        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ===================== قسم النصوص التفاعلي بالسكرول ===================== */}
      <section id="features">
        <StickyTextScroll />
      </section>

      {/* ===================== قسم القوة والمميزات ===================== */}
      <section id="power">
        <PowerSection />
      </section>

      {/* ===================== قسم اختيار اللون والعرض 360° ===================== */}
      <section id="colors">
        <ColorPickerSection previewImage={download} />
      </section>

      <AppleFooter />
    </div>
  );
}