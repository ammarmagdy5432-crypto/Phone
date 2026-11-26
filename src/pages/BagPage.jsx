import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useDocumentTitle, useRouter } from '../lib/router';
import { ACCESSORIES, TAX_RATE, accessoryToBagItem, formatPrice } from '../lib/catalog';
import { MAX_QTY, useBag } from '../context/BagContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs, EmptyState, QuantityStepper } from '../components/UI';
import { ConfirmDialog } from '../components/Modal';
import { Icon } from '../components/Icons';

export function ItemThumb({ item, size = 'md' }) {
  return (
    <span className={`item-thumb item-thumb-${size}`} style={{ '--tone': item.swatch || item.tone || '#3a3a3c' }}>
      <Icon name={item.icon || 'bag'} size={size === 'sm' ? 20 : 28} />
    </span>
  );
}

export function OrderSummary({ subtotal, discount, promo, shipping = 0, showTax = false, children }) {
  const tax = showTax ? Math.round((subtotal - discount) * TAX_RATE * 100) / 100 : 0;
  const total = subtotal - discount + shipping + tax;
  return (
    <div className="summary-lines">
      <div className="summary-line">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="summary-line summary-discount">
          <span>Promo ({promo?.code})</span>
          <span>−{formatPrice(discount)}</span>
        </div>
      )}
      <div className="summary-line">
        <span>Shipping</span>
        <span>{shipping ? formatPrice(shipping) : 'Free'}</span>
      </div>
      <div className="summary-line">
        <span>Estimated tax</span>
        <span>{showTax ? formatPrice(tax) : 'Calculated at checkout'}</span>
      </div>
      {children}
      <div className="summary-line summary-total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

function PromoForm() {
  const { promo, applyPromo, removePromo } = useBag();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  if (promo) {
    return (
      <div className="promo-applied">
        <span>
          <Icon name="check" size={14} /> <strong>{promo.code}</strong> — {promo.label}
        </span>
        <button type="button" className="link-btn" onClick={removePromo}>
          Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="link-btn promo-toggle" onClick={() => setOpen(true)}>
        Have a promo code?
      </button>
    );
  }

  return (
    <form
      className="promo-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return setError('Enter a promo code.');
        if (applyPromo(code)) {
          setError('');
          toast({ title: 'Promo code applied', description: code.trim().toUpperCase() });
        } else {
          setError('That code isn’t valid. Try TITANIUM10.');
        }
        return undefined;
      }}
    >
      <div className={`inline-input ${error ? 'has-error' : ''}`}>
        <input
          className="input"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          placeholder="Promo code"
          aria-label="Promo code"
          aria-invalid={error ? true : undefined}
          autoFocus
        />
        <button type="submit" className="btn btn-secondary btn-sm">
          Apply
        </button>
      </div>
      {error && (
        <p className="field-error">
          <Icon name="alert" size={14} /> {error}
        </p>
      )}
    </form>
  );
}

export default function BagPage() {
  useDocumentTitle('Bag');
  const { navigate } = useRouter();
  const { items, count, subtotal, discount, promo, updateQty, removeItem, clear, addItem } = useBag();
  const toast = useToast();
  const [pendingRemove, setPendingRemove] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const suggestions = ACCESSORIES.filter((a) => !items.some((i) => i.key === `acc-${a.id}`)).slice(0, 3);

  return (
    <div className="page bag-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Bag' }]} />

        {items.length === 0 ? (
          <EmptyState
            icon="bag"
            title="Your bag is empty"
            description="Configure your iPhone 15 Pro or browse accessories to get started."
          >
            <Link to="/buy" className="btn btn-primary">
              Buy iPhone 15 Pro
            </Link>
            <Link to="/accessories" className="btn btn-secondary">
              Browse accessories
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="bag-head">
              <div>
                <h1 className="page-title">Review your bag.</h1>
                <p className="page-lede">
                  {count} item{count === 1 ? '' : 's'} · Free delivery and free returns.
                </p>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(true)}>
                <Icon name="trash" size={16} /> Clear bag
              </button>
            </div>

            <div className="bag-layout">
              <ul className="bag-items">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                      className="bag-item"
                    >
                      <ItemThumb item={item} />
                      <div className="bag-item-info">
                        <Link to={item.href || '/accessories'} className="bag-item-name">
                          {item.name}
                        </Link>
                        {item.details?.map((d) => (
                          <span key={d} className="bag-item-detail">
                            {d}
                          </span>
                        ))}
                        <span className="bag-item-unit">{formatPrice(item.price)} each</span>
                      </div>
                      <div className="bag-item-controls">
                        <QuantityStepper value={item.qty} max={MAX_QTY} onChange={(q) => updateQty(item.key, q)} />
                        <strong className="bag-item-total">{formatPrice(item.price * item.qty)}</strong>
                        <button type="button" className="link-btn link-btn-danger" onClick={() => setPendingRemove(item)}>
                          Remove
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <aside className="bag-summary card">
                <h2 className="card-title">Order summary</h2>
                <OrderSummary subtotal={subtotal} discount={discount} promo={promo} />
                <PromoForm />
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/checkout')}>
                  <Icon name="lock" size={16} /> Check out
                </button>
                <Link to="/accessories" className="btn btn-ghost btn-block">
                  Continue shopping
                </Link>
              </aside>
            </div>

            {suggestions.length > 0 && (
              <section className="bag-suggestions">
                <h2 className="section-title section-title-sm">Complete your setup</h2>
                <div className="mini-product-grid">
                  {suggestions.map((a) => (
                    <div key={a.id} className="mini-product card">
                      <ItemThumb item={a} size="sm" />
                      <div>
                        <strong>{a.name}</strong>
                        <span>{formatPrice(a.price)}</span>
                      </div>
                      <button
                        type="button"
                        className="icon-btn icon-btn-filled"
                        aria-label={`Add ${a.name} to bag`}
                        onClick={() => {
                          addItem(accessoryToBagItem(a));
                          toast({ title: 'Added to your bag', description: a.name });
                        }}
                      >
                        <Icon name="plus" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title="Remove item?"
        description={pendingRemove ? `“${pendingRemove.name}” will be removed from your bag.` : ''}
        confirmLabel="Remove"
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          const removed = pendingRemove;
          removeItem(removed.key);
          setPendingRemove(null);
          toast({
            title: 'Item removed',
            description: removed.name,
            tone: 'info',
            action: { label: 'Undo', onClick: () => addItem({ ...removed, qty: undefined }, removed.qty) },
          });
        }}
      />
      <ConfirmDialog
        open={confirmClear}
        title="Clear your bag?"
        description="All items and any applied promo code will be removed. This can’t be undone."
        confirmLabel="Clear bag"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clear();
          setConfirmClear(false);
          toast({ title: 'Bag cleared', tone: 'info' });
        }}
      />
    </div>
  );
}
