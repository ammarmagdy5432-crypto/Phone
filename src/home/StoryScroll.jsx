import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    title: 'Screen',
    text: 'The latest iPhone models come packed with innovative features. Apple Intelligence, the personal intelligence system that helps you write, express yourself, and get things done effortlessly.',
    head: 'Magic Pro',
  },
  {
    title: 'Camera',
    text: 'Across the iPhone 15 Pro camera system, you’ll find innovation that goes to great lengths. The telephoto features the next generation of our tetraprism design and a 56 percent larger sensor.',
    head: 'Smile. Snap.',
  },
  {
    title: 'Design',
    text: 'Introducing iPhone 15 Pro and iPhone 15 Pro Max, designed from the inside out to be the most powerful iPhone models ever made. At the core of the new design is an aerospace-grade titanium enclosure.',
    head: 'Unique look',
  },
];

/** Pinned storytelling section — panels cross-fade as the user scrolls. */
export default function StoryScroll() {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelsRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=350%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = self.progress < 0.25 ? 0 : self.progress < 0.75 ? 1 : 2;
            setActive((prev) => (prev === next ? prev : next));
          },
        },
      });

      panels.forEach((panel, i) => {
        if (i !== 0) gsap.set(panel, { opacity: 0, y: 40 });
      });

      panels.forEach((panel, i) => {
        if (i < panels.length - 1) {
          tl.to(panel, { opacity: 0, y: -16, duration: 0.05 }).to(panels[i + 1], { opacity: 1, y: 0, duration: 0.05 }, '<');
        }
      });
    }, containerRef);

    // Layout may shift once fonts / lazy chunks settle.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="scroll-story-section">
      <div className="text">
        {ITEMS.map((item, idx) => (
          <div
            key={item.title}
            ref={(el) => (panelsRef.current[idx] = el)}
            className="scroll-panel"
            aria-hidden={active !== idx}
          >
            <span className="scroll-step-badge">
              {String(idx + 1).padStart(2, '0')} / {String(ITEMS.length).padStart(2, '0')}
            </span>
            <h2 className="scroll-item-title">{item.title}</h2>
            <p className="scroll-item-text">{item.text}</p>
            <h3 className="scroll-item-head">{item.head}</h3>
          </div>
        ))}
      </div>

      <ol className="story-progress" aria-label="Story progress">
        {ITEMS.map((item, idx) => (
          <li key={item.title} className={idx === active ? 'is-active' : idx < active ? 'is-done' : ''}>
            <span className="story-progress-bar" />
            <span className="story-progress-label">{item.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
