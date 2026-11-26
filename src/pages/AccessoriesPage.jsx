import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDocumentTitle, useRouter } from '../lib/router';
import { ACCESSORIES, ACCESSORY_CATEGORIES, accessoryToBagItem, formatPrice, getAccessory } from '../lib/catalog';
import { MAX_QTY, useBag } from '../context/BagContext';
import { useToast } from '../context/ToastContext';
import { EmptyState, PageHeader, QuantityStepper } from '../components/UI';
import { Modal } from '../components/Modal';
import { Icon } from '../components/Icons';
import { ItemThumb } from './BagPage';

const SORTS = {
  featured: { label: 'Featured', fn: () => 0 },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
};

function QuickLook({ product, onClose }) {
  const { addItem, items } = useBag();
  const { navigate } = useRouter();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const inBag = product ? items.find((i) => i.key === `acc-${product.id}`) : null;

  useEffect(() => setQty(1), [product]);

  return (
    <Modal open={Boolean(product)} onClose={onClose} size="md" labelledBy="quicklook-title">
      {product && (
        <div className="quicklook">
          <ItemThumb item={product} size="lg" />
          <div className="quicklook-body">
            <span className="eyebrow">{product.category}</span>
            <h2 id="quicklook-title" className="modal-title">
              {product.name}
            </h2>
            <p className="modal-description">{product.description}</p>
            <ul className="check-list">
              <li>
                <Icon name="check" size={16} /> Designed for iPhone 15 Pro
              </li>
              <li>
                <Icon name="truck" size={16} /> Free delivery
              </li>
              <li>
                <Icon name="refresh" size={16} /> Free 14-day returns
              </li>
            </ul>
            <div className="quicklook-buy">
              <strong className="quicklook-price">{formatPrice(product.price * qty)}</strong>
              <QuantityStepper value={qty} max={MAX_QTY} onChange={setQty} />
            </div>
            {inBag && (
              <p className="field-hint">
                <Icon name="bag" size={14} /> {inBag.qty} already in your bag.
              </p>
            )}
            <div className="modal-footer modal-footer-start">
              <button
                type="button"
                className="btn btn-primary"
                data-autofocus
                onClick={() => {
                  addItem(accessoryToBagItem(product), qty);
                  toast({
                    title: 'Added to your bag',
                    description: `${product.name}${qty > 1 ? ` × ${qty}` : ''}`,
                    action: { label: 'View bag', onClick: () => navigate('/bag') },
                  });
                  onClose();
                }}
              >
                Add to Bag
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Keep browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function AccessoriesPage() {
  useDocumentTitle('Accessories');
  const { query } = useRouter();
  const { items, addItem } = useBag();
  const toast = useToast();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [quickLook, setQuickLook] = useState(() => getAccessory(query.get('item')) || null);

  // Open the quick-look when arriving from site search (?item=...).
  useEffect(() => {
    const fromQuery = getAccessory(query.get('item'));
    if (fromQuery) setQuickLook(fromQuery);
  }, [query]);

  const closeQuickLook = () => {
    setQuickLook(null);
    if (query.get('item')) window.history.replaceState(window.history.state, '', '/accessories');
  };

  const products = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ACCESSORIES.filter((a) => category === 'All' || a.category === category)
      .filter((a) => !term || `${a.name} ${a.description} ${a.category}`.toLowerCase().includes(term))
      .sort(SORTS[sort].fn);
  }, [category, search, sort]);

  const resetFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('featured');
  };

  return (
    <div className="page accessories-page">
      <PageHeader
        breadcrumbs={[{ label: 'Accessories' }]}
        eyebrow="Accessories"
        title="Made for iPhone 15 Pro."
        description="Cases, MagSafe chargers, audio and more — everything designed to work beautifully together."
      />

      <div className="container">
        <div className="toolbar">
          <div className="chip-row" role="tablist" aria-label="Filter by category">
            {ACCESSORY_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={category === c}
                className={`chip ${category === c ? 'is-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="toolbar-controls">
            <label className="search-field">
              <Icon name="search" size={16} />
              <input
                type="search"
                className="input"
                placeholder="Search accessories"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search accessories"
              />
            </label>
            <select className="input select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
              {Object.entries(SORTS).map(([id, s]) => (
                <option key={id} value={id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="result-count" aria-live="polite">
          {products.length} product{products.length === 1 ? '' : 's'}
        </p>

        {products.length === 0 ? (
          <EmptyState icon="search" title="No accessories found" description={`Nothing matches “${search}” in ${category}.`}>
            <button type="button" className="btn btn-secondary" onClick={resetFilters}>
              Clear filters
            </button>
          </EmptyState>
        ) : (
          <motion.ul layout className="product-grid">
            <AnimatePresence initial={false}>
              {products.map((p) => {
                const line = items.find((i) => i.key === `acc-${p.id}`);
                return (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="product-card"
                  >
                    <button type="button" className="product-card-media" onClick={() => setQuickLook(p)} aria-label={`Quick look: ${p.name}`}>
                      <ItemThumb item={p} size="lg" />
                      <span className="product-card-quicklook">Quick look</span>
                    </button>
                    <div className="product-card-body">
                      <span className="product-card-cat">{p.category}</span>
                      <h2 className="product-card-name">
                        <button type="button" className="link-reset" onClick={() => setQuickLook(p)}>
                          {p.name}
                        </button>
                      </h2>
                      <p className="product-card-desc">{p.description}</p>
                      <div className="product-card-foot">
                        <strong>{formatPrice(p.price)}</strong>
                        <button
                          type="button"
                          className={`btn btn-sm ${line ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => {
                            addItem(accessoryToBagItem(p));
                            toast({ title: 'Added to your bag', description: p.name });
                          }}
                          disabled={line?.qty >= MAX_QTY}
                        >
                          {line ? (
                            <>
                              <Icon name="check" size={14} /> In bag ({line.qty}) · Add
                            </>
                          ) : (
                            'Add to Bag'
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <QuickLook product={quickLook} onClose={closeQuickLook} />
    </div>
  );
}
