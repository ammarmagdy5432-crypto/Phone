import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextScrollPure() {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);

  const items = [
    {
      step: '01 / 03',
      title: 'Screen',
      text: 'The latest iPhone models come packed with innovative features. Apple Intelligence, the personal intelligence system that helps you write, express yourself, and get things done effortlessly.',
      head: 'Magic Pro',
    },
    {
      step: '02 / 03',
      title: 'Camera',
      text: 'Across the iPhone 15 Pro camera system, you’ll find innovation that goes to great lengths. The telephoto features the next generation of our tetraprism design and a 56 percent larger sensor.',
      head: 'Smile.Snap',
    },
    {
      step: '03 / 03',
      title: 'Design',
      text: 'Introducing iPhone 15 Pro and iPhone 15 Pro Max, designed from the inside out to be the most powerful iPhone models ever made. At the core of the new design is a heat-forged aluminum enclosure.',
      head: 'Unique look',
    },
  ];

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
        },
      });

      panels.forEach((panel, i) => {
        if (i !== 0) {
          gsap.set(panel, { opacity: 0, y: 40 });
        }
      });

      panels.forEach((panel, i) => {
        if (i < panels.length - 1) {
          const nextPanel = panels[i + 1];
          tl.to(panel, { opacity: 0, y: -16, duration: 0.05 })
            .to(nextPanel, { opacity: 1, y: 0, duration: 0.05 }, '<');
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="scroll-story-section">
      <div className="text">
        {items.map((item, idx) => (
          <div
            key={idx}
            ref={(el) => (panelsRef.current[idx] = el)}
            className="scroll-panel"
          >
            <span className="scroll-step-badge">{item.step}</span>
            <h2 className="scroll-item-title">{item.title}</h2>
            <p className="scroll-item-text">{item.text}</p>
            <h3 className="scroll-item-head">{item.head}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}