import { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import Phone from './Phone';
import { SceneErrorBoundary, SceneLoader } from './SceneHelpers';
import useViewport from '../lib/useViewport';

/*
 * The scroll keyframes in Phone.jsx were authored against the full height of
 * the original page (sections + footer). We measure progress up to the end of
 * the #colors section plus that original footer allowance, so new content
 * added below (buy band, redesigned footer) never shifts the choreography.
 */
const ORIGINAL_TAIL = 500;

export default function HeroScene() {
  const progressRef = useRef(0);
  const { isMobile } = useViewport();

  useEffect(() => {
    let raf = null;
    const compute = () => {
      raf = null;
      const end = document.getElementById('colors');
      if (!end) return;
      const endAbs = end.getBoundingClientRect().bottom + window.scrollY;
      const total = endAbs + ORIGINAL_TAIL - window.innerHeight;
      if (total <= 0) return;
      progressRef.current = Math.min(Math.max(window.scrollY / total, 0), 1);
    };
    const schedule = () => {
      if (raf == null) raf = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf != null) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // Fixed layer with pointer-events: none so buttons and links beneath remain clickable.
    <div className="phone" aria-hidden="true">
      <SceneErrorBoundary fallback={null}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, isMobile ? 6.2 : 5], fov: isMobile ? 50 : 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 5, 2]} intensity={1.3} />
          <Suspense fallback={null}>
            <Phone progressRef={progressRef} phoneColor="#1c1c1e" isMobile={isMobile} />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.4, 0]} opacity={0.35} blur={2.5} far={3} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
      <SceneLoader />
    </div>
  );
}
