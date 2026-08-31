import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// تسجيل إضافة ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function TextScrollPure() {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);

  const items = [
    { title: "Screen", text: "The latest iPhone models come packed with innovative features. Apple Intelligence, the personal intelligence system that helps you write, express yourself, and get things done effortlessly.", head: "Magic Pro" },
    { title: "Camera", text: "Across the iPhone 15 Pro camera system, you’ll find innovation that goes to great lengths. The telephoto features the next generation of our tetraprism design and a 56 percent larger sensor.", head: "Smile.Snap" },
    { title: "Design", text: "Introducing iPhone 15 Pro and iPhone 15 Pro Max, designed from the inside out to be the most powerful iPhone models ever made. At the core of the new design is a heat-forged aluminum enclosure.", head: "Unique look" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelsRef.current;

      // إنشاء التتابع الزمني للتنقل بين النصوص
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",      // يبدأ التثبيت عندما يصل أعلى الحاوية لأعلى الشاشة
          end: "+=350%",         // طول المسافة التي سيظل فيها النص مثبتاً (يمكنك زيادتها لبطء أكثر)
          scrub: 1,              // يربط الحركة بالسكرول بنعومة (Smooth Scrubbing)
          pin: true,             // تثبيت الحاوية بالكامل أثناء السكرول
          anticipatePin: 1
        }
      });

      // ضبط الحالة الأولية: النص الأول ظاهر، والبقية مختفية وتحت الشاشة قليلاً
      panels.forEach((panel, i) => {
        if (i !== 0) {
          gsap.set(panel, { opacity: 0, y: 40 });
        }
      });

      // تحريك النصوص بالتوالي
      panels.forEach((panel, i) => {
        if (i < panels.length - 1) {
          const nextPanel = panels[i + 1];

          tl.to(panel, { opacity: 0, y: -10, duration: 0.05}) // خروج النص الحالي
            .to(nextPanel, { opacity: 1, y: 0, duration: 0.05 }, "<"); // دخول النص التالي في نفس الوقت
        }
      });
    }, containerRef);

    return () => ctx.revert(); // تنظيف الأقترانات عند تدمير المكون
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        backgroundColor: '#030303', 
        color: 'white', 
        height: '100vh', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'left', 
        justifyContent: 'left',
        position: 'relative'
      }}
    >
      <div  className='text' style={{ position: 'relative', width: '100%', maxWidth: '800px', height: 'auto' }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            ref={(el) => (panelsRef.current[idx] = el)}
            style={{
              position: 'absolute',
              top: '10px',
              left: 0,
              width: '90%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <h1 className="scroll-item-title">{item.title}</h1>
            <p className="scroll-item-text">{item.text}</p>
            <h1 className="scroll-item-head">{item.head}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}