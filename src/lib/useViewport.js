import { useState, useEffect } from 'react';

/**
 * useViewport
 * Tracks window width/height and exposes simple breakpoint flags.
 * Needed because the 3D scene (react-three-fiber) uses JS values (camera
 * position, keyframe offsets) that CSS media queries can't reach —
 * everything else should prefer plain CSS.
 *
 * Breakpoints match index.css:
 *   mobile  : <= 640px
 *   tablet  : <= 1024px
 *   desktop : > 1024px
 */
export default function useViewport() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    let raf = null;
    const handleResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return {
    width: size.width,
    height: size.height,
    isMobile: size.width <= 640,
    isTablet: size.width > 640 && size.width <= 1024,
    isDesktop: size.width > 1024,
  };
}
