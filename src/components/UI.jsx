import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from '../lib/router';
import { Icon } from './Icons';

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/** Fades its children in once they scroll into view. */
export function Reveal({ children, className, delay = 0, as = 'div', ...rest }) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: fadeUp.hidden,
        visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay } },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label}>
            <Icon name="chevron-right" size={12} />
            {item.to && i < items.length - 1 ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Consistent hero/header block for secondary pages. */
export function PageHeader({ eyebrow, title, description, breadcrumbs, children, align = 'left' }) {
  return (
    <header className={`page-header page-header-${align}`}>
      <div className="container">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          {eyebrow && (
            <motion.span variants={fadeUp} className="eyebrow">
              {eyebrow}
            </motion.span>
          )}
          <motion.h1 variants={fadeUp} className="page-title">
            {title}
          </motion.h1>
          {description && (
            <motion.p variants={fadeUp} className="page-lede">
              {description}
            </motion.p>
          )}
          {children && <motion.div variants={fadeUp}>{children}</motion.div>}
        </motion.div>
      </div>
    </header>
  );
}

export function EmptyState({ icon = 'bag', title, description, headingAs: Heading = 'h2', children }) {
  return (
    <motion.div className="empty-state" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <span className="empty-state-icon">
        <Icon name={icon} size={28} />
      </span>
      <Heading className="empty-state-title">{title}</Heading>
      {description && <p>{description}</p>}
      {children && <div className="empty-state-actions">{children}</div>}
    </motion.div>
  );
}

export function AccordionItem({ question, children, defaultOpen = false, id }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div className={`accordion-item ${open ? 'is-open' : ''}`} id={id}>
      <h3>
        <button
          type="button"
          className="accordion-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{question}</span>
          <span className="accordion-icon" aria-hidden="true">
            <Icon name="plus" size={18} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            className="accordion-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="accordion-content">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Spinner({ size = 16 }) {
  return <span className="spinner" style={{ width: size, height: size }} aria-hidden="true" />;
}

/** Quantity stepper with bounds. */
export function QuantityStepper({ value, min = 1, max = 10, onChange, label = 'Quantity' }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="stepper-btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="stepper-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="stepper-btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
