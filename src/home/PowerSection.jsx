import { motion } from 'framer-motion';
import { Link } from '../lib/router';
import { Icon } from '../components/Icons';

const fadeInVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FEATURES = [
  {
    src: '/images-removebg-preview (5).png',
    alt: 'All-day battery performance',
    label: 'All-Day Battery',
    stat: 'Up to 29 hrs',
    detail: 'video playback',
    to: '/specs#battery',
  },
  {
    src: '/34-347603_white-apple-logo-transparent-removebg-preview.png',
    alt: 'Apple silicon A17 Pro',
    label: 'A17 Pro Architecture',
    stat: '3nm',
    detail: 'first in a smartphone',
    to: '/specs#chip',
  },
  {
    src: '/ios-icon-logo-software-phone-apple-symbol-name-white-design-mobile-illustration-with-black-background-free-vector-removebg-preview.png',
    alt: 'iOS and Apple Intelligence',
    label: 'Apple Intelligence',
    stat: 'Built in',
    detail: 'private by design',
    to: '/specs#intelligence',
  },
];

export default function PowerSection() {
  return (
    <div className="power-section-wrapper">
      <div className="power-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.12 }}
          className="power-stack"
        >
          <motion.span variants={fadeInVariant} className="eyebrow eyebrow-blue">
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
            {FEATURES.map((item) => (
              <Link key={item.label} to={item.to} className="power-icon-card">
                <img src={item.src} alt={item.alt} loading="lazy" />
                <span className="power-stat">{item.stat}</span>
                <span className="power-icon-label">
                  {item.label}
                  <small>{item.detail}</small>
                </span>
                <span className="power-card-link">
                  Learn more <Icon name="chevron-right" size={14} />
                </span>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
