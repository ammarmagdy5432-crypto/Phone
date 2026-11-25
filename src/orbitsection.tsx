import { useState } from 'react';
import { motion } from 'framer-motion';
import download from './iphone.webp';
import PhoneModell from './PhoneOrbit';

const colors = [
  { name: 'Natural', finish: 'Natural Titanium', hex: '#8f8a81' },
  { name: 'Gray', finish: 'Space Titanium', hex: '#6e6e73' },
  { name: 'White', finish: 'White Titanium', hex: '#f2f2f2' },
  { name: 'Black', finish: 'Black Titanium', hex: '#1c1c1e' },
];

export default function ColorPickerSection({ previewImage = download }) {
  const [phoneColor, setPhoneColor] = useState(colors[0].hex);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: -36 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const activeColor = colors.find((c) => c.hex === phoneColor) || colors[0];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      style={{ width: '100%' }}
    >
      <div className="orbit-section">
        <div className="orbit-inner">
          <motion.div variants={fadeInUp} className="orbit-header">
            <span className="orbit-eyebrow">360&deg; Interactive Finish</span>
            <h2 className="st">Choose your favorite Color</h2>
            <p className="orbit-subtitle">
              Currently viewing <strong>{activeColor.finish}</strong> — select a finish or drag the model to inspect every angle.
            </p>
          </motion.div>

          <div className="color-picker-columns">
            <motion.div
              className="color-buttons-col"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {colors.map((color) => {
                const isActive = phoneColor === color.hex;
                return (
                  <motion.button
                    key={color.hex}
                    type="button"
                    variants={fadeInRight}
                    onClick={() => setPhoneColor(color.hex)}
                    className={`color-btn ${isActive ? 'active' : ''}`}
                    aria-pressed={isActive}
                  >
                    <span
                      className="color-swatch"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span className="color-meta">
                      <span className="color-name">{color.name}</span>
                      <span className="color-finish">{color.finish}</span>
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.div variants={scaleUp} className="phone-preview-col">
              <div className="phone-preview-stage" data-fallback={previewImage}>
                <div className="phone-preview-3d">
                  <PhoneModell phoneColor={phoneColor} />
                </div>
              </div>
              <div className="orbit-hint" aria-hidden="true">
                <span>Drag to rotate 360&deg;</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}