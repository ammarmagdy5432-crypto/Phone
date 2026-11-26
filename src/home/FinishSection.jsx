import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '../lib/router';
import { FINISHES, formatPrice, monthly, startingPrice } from '../lib/catalog';
import { Icon } from '../components/Icons';
import { SceneErrorBoundary, SceneLoader } from './SceneHelpers';

const PhoneOrbit = lazy(() => import('./PhoneOrbit'));

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const fadeInRight = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const scaleUp = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

/** Reusable finish selector + 360° viewer (used on the home page). */
export default function FinishSection() {
  const [finishId, setFinishId] = useState(FINISHES[0].id);
  const active = FINISHES.find((f) => f.id === finishId) || FINISHES[0];

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} style={{ width: '100%' }}>
      <div className="orbit-section">
        <div className="orbit-inner">
          <motion.div variants={fadeInUp} className="orbit-header">
            <span className="eyebrow">360° Interactive Finish</span>
            <h2 className="section-title">Choose your favorite color</h2>
            <p className="orbit-subtitle">
              Currently viewing <strong>{active.finish}</strong> — select a finish or drag the model to inspect every
              angle.
            </p>
          </motion.div>

          <div className="color-picker-columns">
            <motion.div
              className="color-buttons-col"
              role="radiogroup"
              aria-label="Titanium finish"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {FINISHES.map((color) => {
                const isActive = finishId === color.id;
                return (
                  <motion.button
                    key={color.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    variants={fadeInRight}
                    onClick={() => setFinishId(color.id)}
                    className={`color-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="color-swatch" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                    <span className="color-meta">
                      <span className="color-name">{color.name}</span>
                      <span className="color-finish">{color.finish}</span>
                    </span>
                    {isActive && <Icon name="check" size={16} className="color-check" />}
                  </motion.button>
                );
              })}

              <motion.div variants={fadeInRight} className="finish-cta">
                <p>
                  From <strong>{formatPrice(startingPrice('pro'))}</strong> or {monthly(startingPrice('pro'))}/mo.
                </p>
                <Link to={`/buy?finish=${active.id}`} className="btn btn-primary btn-block">
                  Buy in {active.name}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={scaleUp} className="phone-preview-col">
              <div className="phone-preview-stage">
                <div className="phone-preview-3d">
                  <SceneErrorBoundary>
                    <Suspense fallback={null}>
                      <PhoneOrbit phoneColor={active.hex} />
                    </Suspense>
                  </SceneErrorBoundary>
                </div>
                <SceneLoader label="Preparing 360° view" />
              </div>
              <div className="orbit-hint" aria-hidden="true">
                <Icon name="rotate" size={14} /> Drag to rotate 360°
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
