import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useDocumentTitle, useRouter } from '../lib/router';
import { FAQS, FAQ_TOPICS } from '../lib/content';
import { formatPrice } from '../lib/catalog';
import { useBag } from '../context/BagContext';
import { useToast } from '../context/ToastContext';
import { Field, focusFirstError, validate, validators } from '../components/Form';
import { AccordionItem, EmptyState, PageHeader, Spinner } from '../components/UI';
import { Icon } from '../components/Icons';

const DEMO_ORDER = {
  number: 'W150000001',
  date: new Date(Date.now() - 86400000 * 2).toISOString(),
  email: 'alex@example.com',
  firstName: 'Alex',
  shippingLabel: 'Standard delivery',
  status: 'In transit',
  total: 1099,
  items: [{ key: 'demo-1', name: 'iPhone 15 Pro 256GB', qty: 1, price: 1099 }],
};

const CONTACT_SCHEMA = {
  name: [validators.required('Enter your name.')],
  email: [validators.required('Enter your email address.'), validators.email],
  topic: [validators.required('Select a topic.')],
  message: [validators.required('Tell us how we can help.'), validators.minLength(12, 'Message')],
};

function OrderStatusLookup() {
  const { orders } = useBag();
  const [orderNum, setOrderNum] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const allOrders = useMemo(() => [...orders, DEMO_ORDER], [orders]);

  const lookup = (queryStr) => {
    const cleaned = (queryStr ?? orderNum).trim().toUpperCase();
    if (!cleaned) {
      setError('Enter your order number (e.g. W150000001).');
      setResult(null);
      return;
    }
    setError('');
    setSearching(true);
    window.setTimeout(() => {
      const found = allOrders.find((o) => o.number.toUpperCase() === cleaned);
      setSearching(false);
      if (found) {
        setResult(found);
      } else {
        setResult(null);
        setError(`We couldn’t find order “${cleaned}”. Try W150000001 for a demo lookup.`);
      }
    }, 350);
  };

  return (
    <section id="order-status" className="support-section card">
      <div className="support-section-head">
        <span className="spec-icon">
          <Icon name="package" size={22} />
        </span>
        <div>
          <h2>Check order status</h2>
          <p>Enter the order number from your confirmation screen to view delivery progress.</p>
        </div>
      </div>

      <form
        className="order-lookup-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          lookup();
        }}
      >
        <div className={`inline-input ${error ? 'has-error' : ''}`}>
          <input
            type="text"
            className="input"
            placeholder="Order number (e.g. W150000001)"
            value={orderNum}
            onChange={(e) => {
              setOrderNum(e.target.value);
              if (error) setError('');
            }}
            aria-label="Order number"
            aria-invalid={error ? true : undefined}
          />
          <button type="submit" className="btn btn-primary" disabled={searching}>
            {searching ? <Spinner /> : 'Look up'}
          </button>
        </div>
        {error && (
          <p className="field-error">
            <Icon name="alert" size={14} /> {error}
          </p>
        )}
      </form>

      {orders.length > 0 && (
        <div className="recent-orders">
          <span className="recent-orders-label">Your recent orders:</span>
          <div className="chip-row">
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.number}
                type="button"
                className="chip"
                onClick={() => {
                  setOrderNum(o.number);
                  lookup(o.number);
                }}
              >
                {o.number}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <motion.div className="order-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="order-result-head">
            <div>
              <strong>Order {result.number}</strong>
              <span>Placed {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span className="status-badge">
              <Icon name="truck" size={14} /> {result.status}
            </span>
          </div>
          <ul className="order-result-items">
            {result.items.map((item) => (
              <li key={item.key}>
                <span>
                  {item.name} <small>× {item.qty}</small>
                </span>
                <strong>{formatPrice(item.price * item.qty)}</strong>
              </li>
            ))}
          </ul>
          <div className="order-result-foot">
            <span>{result.shippingLabel}</span>
            <strong>Total {formatPrice(result.total)}</strong>
          </div>
        </motion.div>
      )}
    </section>
  );
}

function ContactForm() {
  const toast = useToast();
  const formRef = useRef(null);
  const [values, setValues] = useState({ name: '', email: '', topic: 'Orders & delivery', orderNumber: '', message: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const errors = validate(values, CONTACT_SCHEMA);
  const err = (k) => (touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) {
      setTouched({ name: true, email: true, topic: true, message: true });
      window.setTimeout(() => focusFirstError(formRef.current), 0);
      return;
    }
    setStatus('sending');
    window.setTimeout(() => {
      setStatus('sent');
      toast({ title: 'Message sent', description: 'A specialist will reply within 24 hours.' });
    }, 800);
  };

  if (status === 'sent') {
    return (
      <section id="contact" className="support-section card">
        <div className="contact-sent">
          <span className="confirmation-check confirmation-check-sm">
            <Icon name="check" size={22} />
          </span>
          <h2>We’ve received your message</h2>
          <p>
            Thanks, {values.name}. We’ll get back to <strong>{values.email}</strong> shortly.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setValues({ name: '', email: '', topic: 'Orders & delivery', orderNumber: '', message: '' });
              setTouched({});
              setStatus('idle');
            }}
          >
            Send another message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="support-section card">
      <div className="support-section-head">
        <span className="spec-icon">
          <Icon name="mail" size={22} />
        </span>
        <div>
          <h2>Contact support</h2>
          <p>Still have a question? Send us a note and we’ll respond within one business day.</p>
        </div>
      </div>

      <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <Field label="Your name" error={err('name')}>
            {(a11y) => <input {...a11y} className="input" value={values.name} onChange={set('name')} onBlur={blur('name')} autoComplete="name" />}
          </Field>
          <Field label="Email" error={err('email')}>
            {(a11y) => <input {...a11y} type="email" className="input" value={values.email} onChange={set('email')} onBlur={blur('email')} autoComplete="email" />}
          </Field>
          <Field label="Topic" error={err('topic')}>
            {(a11y) => (
              <select {...a11y} className="input select" value={values.topic} onChange={set('topic')} onBlur={blur('topic')}>
                {FAQ_TOPICS.map((t) => (
                  <option key={t.id}>{t.label}</option>
                ))}
                <option>Other</option>
              </select>
            )}
          </Field>
          <Field label="Order number" optional>
            {(a11y) => <input {...a11y} className="input" placeholder="W150000001" value={values.orderNumber} onChange={set('orderNumber')} />}
          </Field>
          <Field
            label="Message"
            error={err('message')}
            className="span-2"
            counter={<span className="field-counter">{values.message.length}/500</span>}
          >
            {(a11y) => (
              <textarea
                {...a11y}
                className="input textarea"
                rows={4}
                maxLength={500}
                placeholder="Describe your question or issue…"
                value={values.message}
                onChange={set('message')}
                onBlur={blur('message')}
              />
            )}
          </Field>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            'Send message'
          )}
        </button>
      </form>
    </section>
  );
}

export default function SupportPage() {
  useDocumentTitle('Support');
  const { query } = useRouter();
  const initialFaq = query.get('faq');
  const [topic, setTopic] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (initialFaq) {
      setTopic('all');
      setSearch('');
    }
  }, [initialFaq]);

  const filteredFaqs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return FAQS.filter((f) => topic === 'all' || f.topic === topic).filter(
      (f) => !term || `${f.q} ${f.a}`.toLowerCase().includes(term)
    );
  }, [topic, search]);

  return (
    <div className="page support-page">
      <PageHeader
        breadcrumbs={[{ label: 'Support' }]}
        eyebrow="Support"
        title="How can we help?"
        description="Find quick answers, track an order or get in touch with a specialist."
      >
        <div className="anchor-pills">
          <Link to="/support#faq" className="chip">
            FAQs
          </Link>
          <Link to="/support#order-status" className="chip">
            Order status
          </Link>
          <Link to="/support#contact" className="chip">
            Contact us
          </Link>
        </div>
      </PageHeader>

      <div className="container support-stack">
        {/* FAQs */}
        <section id="faq" className="support-faq" aria-labelledby="faq-title">
          <div className="support-faq-head">
            <h2 id="faq-title" className="section-title section-title-sm">
              Frequently asked questions
            </h2>
            <label className="search-field">
              <Icon name="search" size={16} />
              <input
                type="search"
                className="input"
                placeholder="Search help articles"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search FAQs"
              />
            </label>
          </div>

          <div className="chip-row" role="tablist" aria-label="Filter by topic">
            <button
              type="button"
              role="tab"
              aria-selected={topic === 'all'}
              className={`chip ${topic === 'all' ? 'is-active' : ''}`}
              onClick={() => setTopic('all')}
            >
              All topics
            </button>
            {FAQ_TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={topic === t.id}
                className={`chip ${topic === t.id ? 'is-active' : ''}`}
                onClick={() => setTopic(t.id)}
              >
                <Icon name={t.icon} size={14} /> {t.label}
              </button>
            ))}
          </div>

          {filteredFaqs.length === 0 ? (
            <EmptyState icon="search" title="No matching articles" description={`We couldn’t find anything for “${search}”.`}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setTopic('all');
                  setSearch('');
                }}
              >
                Reset search
              </button>
            </EmptyState>
          ) : (
            <div className="accordion card">
              {filteredFaqs.map((f) => (
                <AccordionItem key={f.id} id={f.id} question={f.q} defaultOpen={initialFaq === f.id}>
                  <p>{f.a}</p>
                </AccordionItem>
              ))}
            </div>
          )}
        </section>

        <OrderStatusLookup />
        <ContactForm />
      </div>
    </div>
  );
}
