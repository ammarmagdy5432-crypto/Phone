import { motion } from 'framer-motion';

export default function PowerSection() {
  const fadeInVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const features = [
    {
      src: '/images-removebg-preview (5).png',
      alt: 'All-day Battery Performance',
      label: 'All-Day Battery',
    },
    {
      src: '/34-347603_white-apple-logo-transparent-removebg-preview.png',
      alt: 'Apple Silicon A17 Pro',
      label: 'A17 Pro Architecture',
    },
    {
      src: '/ios-icon-logo-software-phone-apple-symbol-name-white-design-mobile-illustration-with-black-background-free-vector-removebg-preview.png',
      alt: 'iOS & Apple Intelligence',
      label: 'Apple Intelligence',
    },
  ];

  return (
    <div className="power-section-wrapper">
      <div className="power-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: false,
            amount: 0.2,
          }}
          transition={{ staggerChildren: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <motion.span variants={fadeInVariant} className="power-eyebrow">
            Performance &amp; Intelligence
          </motion.span>

          <motion.h2 variants={fadeInVariant} className="power-title">
            New dimensions in power
          </motion.h2>

          <motion.h3 variants={fadeInVariant} className="power-subtitle">
            Battery life. All-time high.
          </motion.h3>

          <motion.p variants={fadeInVariant} className="power-description">
            Apple Intelligence — effortlessly helpful every day, built right into the core of iOS.
          </motion.p>

          <motion.div variants={fadeInVariant} className="power-icons">
            {features.map((item, index) => (
              <div key={index} className="power-icon-card">
                <img src={item.src} alt={item.alt} />
                <span className="power-icon-label">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}