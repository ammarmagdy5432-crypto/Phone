import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useDocumentTitle } from '../lib/router';
import { SHIPPING_METHODS, TAX_RATE, formatPrice } from '../lib/catalog';
import { useBag } from '../context/BagContext';
import { useToast } from '../context/ToastContext';
import { Field, focusFirstError, validate, validators } from '../components/Form';
import { Breadcrumbs, EmptyState, Spinner } from '../components/UI';
import { Icon } from '../components/Icons';
import { ItemThumb, OrderSummary } from './BagPage';

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'United Arab Emirates', 'Egypt', 'Saudi Arabia', 'Australia', 'Japan'];

const INITIAL = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postal: '',
  country: '',
  shipping: 'standard',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const luhn = (num) => {
  const digits = num.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return digits.length >= 13 && sum % 10 === 0;
};

const expiryValid = (v) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return 'Use the format MM/YY.';
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return 'Enter a valid month.';
  const now = new Date();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth < now ? 'This card has expired.' : null;
};

const SCHEMA = {
  email: [validators.required('Enter your email address.'), validators.email],
  phone: [
    validators.required('Enter a phone number for delivery updates.'),
    validators.pattern(/^\+?[\d\s()-]{7,}$/, 'Enter a valid phone number.'),
  ],
  firstName: [validators.required('Enter your first name.')],
  lastName: [validators.required('Enter your last name.')],
  address: [validators.required('Enter your street address.'), validators.minLength(5, 'Address')],
  city: [validators.required('Enter your city.')],
  postal: [validators.required('Enter your postal code.'), validators.pattern(/^[A-Za-z0-9\s-]{3,10}$/, 'Enter a valid postal code.')],
  country: [validators.required('Select a country.')],
  cardName: [validators.required('Enter the name on your card.')],
  cardNumber: [validators.required('Enter your card number.'), (v) => (luhn(v) ? null : 'Enter a valid card number.')],
  expiry: [validators.required('Enter the expiry date.'), expiryValid],
  cvc: [validators.required('Enter the security code.'), validators.pattern(/^\d{3,4}$/, 'Enter 3 or 4 digits.')],
};

const formatCard = (v) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (v, prev) => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  if (digits.length === 2 && prev.length < v.length) return `${digits}/`;
  return digits;
};

function OrderConfirmation({ order }) {
  return (
    <motion.div className="confirmation" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <motion.span
        className="confirmation-check"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
      >
        <Icon name="check" size={32} strokeWidth={2} />
      </motion.span>
      <h1 className="page-title">Thank you, {order.firstName}.</h1>
      <p className="page-lede">
        Your order <strong>{order.number}</strong> has been placed. A confirmation has been sent to{' '}
        <strong>{order.email}</strong>.
      </p>

      <div className="card confirmation-card">
        <div className="confirmation-meta">
          <div>
            <span>Order number</span>
            <strong>{order.number}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>{order.shippingLabel}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>
        <ul className="confirmation-items">
          {order.items.map((item) => (
            <li key={item.key}>
              <ItemThumb item={item} size="sm" />
              <span>
                {item.name} <small>× {item.qty}</small>
              </span>
              <strong>{formatPrice(item.price * item.qty)}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="confirmation-actions">
        <Link to="/support#order-status" className="btn btn-secondary">
          <Icon name="package" size={16} /> Track order
        </Link>
        <Link to="/" className="btn btn-primary">
          Continue exploring
        </Link>
      </div>
      <p className="demo-note">
        <Icon name="info" size={14} /> This is a demo store — no payment was taken and nothing will ship.
      </p>
    </motion.div>
  );
}

export default function CheckoutPage() {
  useDocumentTitle('Checkout');
  const { items, subtotal, discount, promo, clear, recordOrder } = useBag();
  const toast = useToast();
  const formRef = useRef(null);
  const [values, setValues] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  const errors = validate(values, SCHEMA);
  const visibleError = (name) => (touched[name] ? errors[name] : undefined);
  const shipping = SHIPPING_METHODS.find((s) => s.id === values.shipping);
  const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
  const total = subtotal - discount + shipping.price + tax;

  const set = (name) => (e) => {
    let { value } = e.target;
    if (name === 'cardNumber') value = formatCard(value);
    if (name === 'expiry') value = formatExpiry(value, values.expiry);
    if (name === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setValues((v) => ({ ...v, [name]: value }));
  };
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));

  const input = (name, props = {}) => (a11y) => (
    <input
      {...a11y}
      className="input"
      name={name}
      value={values[name]}
      onChange={set(name)}
      onBlur={blur(name)}
      {...props}
    />
  );

  const onSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) {
      setTouched(Object.fromEntries(Object.keys(SCHEMA).map((k) => [k, true])));
      window.setTimeout(() => focusFirstError(formRef.current), 0);
      toast({
        title: 'Please check your details',
        description: `${Object.keys(errors).length} field${Object.keys(errors).length > 1 ? 's need' : ' needs'} attention.`,
        tone: 'error',
      });
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      const placed = {
        number: `W${Math.floor(100000000 + Math.random() * 899999999)}`,
        date: new Date().toISOString(),
        email: values.email.trim(),
        firstName: values.firstName.trim(),
        shippingLabel: shipping.label,
        items,
        total,
        status: 'Processing',
      };
      recordOrder(placed);
      clear();
      setOrder(placed);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1500);
  };

  if (order) {
    return (
      <div className="page checkout-page">
        <div className="container container-narrow">
          <OrderConfirmation order={order} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page checkout-page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Bag', to: '/bag' }, { label: 'Checkout' }]} />
          <EmptyState icon="bag" title="There’s nothing to check out" description="Your bag is empty. Add an item to continue.">
            <Link to="/buy" className="btn btn-primary">
              Buy iPhone 15 Pro
            </Link>
            <Link to="/accessories" className="btn btn-secondary">
              Browse accessories
            </Link>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Bag', to: '/bag' }, { label: 'Checkout' }]} />
        <h1 className="page-title">Checkout</h1>
        <p className="page-lede">
          <Icon name="lock" size={14} /> Secure demo checkout — no real payment is processed.
        </p>

        <div className="checkout-layout">
          <form ref={formRef} className="checkout-form" onSubmit={onSubmit} noValidate>
            <fieldset className="form-section" disabled={submitting}>
              <legend>
                <span className="config-step-num">1</span> Contact information
              </legend>
              <div className="form-grid">
                <Field label="Email" error={visibleError('email')}>
                  {input('email', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com' })}
                </Field>
                <Field label="Phone" error={visibleError('phone')} hint="For delivery updates only.">
                  {input('phone', { type: 'tel', autoComplete: 'tel', placeholder: '+1 555 123 4567' })}
                </Field>
              </div>
            </fieldset>

            <fieldset className="form-section" disabled={submitting}>
              <legend>
                <span className="config-step-num">2</span> Shipping address
              </legend>
              <div className="form-grid">
                <Field label="First name" error={visibleError('firstName')}>
                  {input('firstName', { autoComplete: 'given-name' })}
                </Field>
                <Field label="Last name" error={visibleError('lastName')}>
                  {input('lastName', { autoComplete: 'family-name' })}
                </Field>
                <Field label="Street address" error={visibleError('address')} className="span-2">
                  {input('address', { autoComplete: 'street-address' })}
                </Field>
                <Field label="City" error={visibleError('city')}>
                  {input('city', { autoComplete: 'address-level2' })}
                </Field>
                <Field label="Postal code" error={visibleError('postal')}>
                  {input('postal', { autoComplete: 'postal-code' })}
                </Field>
                <Field label="Country / region" error={visibleError('country')} className="span-2">
                  {(a11y) => (
                    <select
                      {...a11y}
                      className="input select"
                      value={values.country}
                      onChange={set('country')}
                      onBlur={blur('country')}
                      autoComplete="country-name"
                    >
                      <option value="">Select a country…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
            </fieldset>

            <fieldset className="form-section" disabled={submitting}>
              <legend>
                <span className="config-step-num">3</span> Delivery method
              </legend>
              <div className="option-grid">
                {SHIPPING_METHODS.map((m) => (
                  <label key={m.id} className={`option-card option-card-row ${values.shipping === m.id ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="shipping"
                      value={m.id}
                      checked={values.shipping === m.id}
                      onChange={set('shipping')}
                      className="sr-only"
                    />
                    <span className="option-card-main">
                      <span className="option-card-title">
                        <Icon name="truck" size={16} /> {m.label}
                      </span>
                      <span className="option-card-sub">{m.detail}</span>
                    </span>
                    <span className="option-card-price">{m.price ? formatPrice(m.price) : 'Free'}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="form-section" disabled={submitting}>
              <legend>
                <span className="config-step-num">4</span> Payment
              </legend>
              <div className="form-grid">
                <Field label="Name on card" error={visibleError('cardName')} className="span-2">
                  {input('cardName', { autoComplete: 'cc-name' })}
                </Field>
                <Field
                  label="Card number"
                  error={visibleError('cardNumber')}
                  hint="Demo: use 4242 4242 4242 4242."
                  className="span-2"
                >
                  {input('cardNumber', {
                    inputMode: 'numeric',
                    autoComplete: 'cc-number',
                    placeholder: '1234 5678 9012 3456',
                  })}
                </Field>
                <Field label="Expiry" error={visibleError('expiry')}>
                  {input('expiry', { inputMode: 'numeric', autoComplete: 'cc-exp', placeholder: 'MM/YY' })}
                </Field>
                <Field label="Security code" error={visibleError('cvc')}>
                  {input('cvc', { inputMode: 'numeric', autoComplete: 'cc-csc', placeholder: 'CVC' })}
                </Field>
              </div>
            </fieldset>

            <button type="submit" className={`btn btn-primary btn-lg btn-block ${submitting ? 'is-loading' : ''}`} disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner /> Placing order…
                </>
              ) : (
                <>
                  <Icon name="lock" size={16} /> Place order · {formatPrice(total)}
                </>
              )}
            </button>
            <Link to="/bag" className="btn btn-ghost btn-block">
              <Icon name="arrow-left" size={16} /> Back to bag
            </Link>
          </form>

          <aside className="checkout-summary card">
            <h2 className="card-title">In your bag</h2>
            <ul className="summary-items">
              {items.map((item) => (
                <li key={item.key}>
                  <ItemThumb item={item} size="sm" />
                  <span className="summary-item-name">
                    {item.name}
                    <small>
                      {item.details?.join(' · ')} · Qty {item.qty}
                    </small>
                  </span>
                  <strong>{formatPrice(item.price * item.qty)}</strong>
                </li>
              ))}
            </ul>
            <OrderSummary subtotal={subtotal} discount={discount} promo={promo} shipping={shipping.price} showTax />
            <Link to="/bag" className="link-btn">
              Edit bag
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
