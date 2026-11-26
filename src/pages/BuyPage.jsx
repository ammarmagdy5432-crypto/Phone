import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useDocumentTitle, useRouter } from '../lib/router';
import { APPLECARE, FINISHES, MODELS, formatPrice, getFinish, getModel, monthly } from '../lib/catalog';
import { useBag } from '../context/BagContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs, Spinner } from '../components/UI';
import { Icon } from '../components/Icons';
import { SceneErrorBoundary, SceneLoader } from '../home/SceneHelpers';

const PhoneOrbit = lazy(() => import('../home/PhoneOrbit'));

function Step({ number, title, aside, children }) {
  return (
    <section className="config-step" aria-labelledby={`step-${number}`}>
      <div className="config-step-head">
        <h2 id={`step-${number}`}>
          <span className="config-step-num">{number}</span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function BuyPage() {
  useDocumentTitle('Buy');
  const { query, navigate } = useRouter();
  const { addItem } = useBag();
  const toast = useToast();

  const [modelId, setModelId] = useState(() => getModel(query.get('model'))?.id || 'pro');
  const [finishId, setFinishId] = useState(() => getFinish(query.get('finish'))?.id || FINISHES[0].id);
  const [storageId, setStorageId] = useState(null);
  const [careId, setCareId] = useState('none');
  const [status, setStatus] = useState('idle'); // idle | adding | added
  const [showHint, setShowHint] = useState(false);

  const model = getModel(modelId);
  const finish = getFinish(finishId);
  const storage = model.storage.find((s) => s.id === storageId) || null;
  const care = APPLECARE.find((c) => c.id === careId);

  const total = useMemo(() => (storage ? storage.price : model.storage[0].price) + care.price, [storage, model, care]);

  // Keep the URL shareable without re-rendering the whole route.
  useEffect(() => {
    window.history.replaceState(window.history.state, '', `/buy?model=${modelId}&finish=${finishId}`);
  }, [modelId, finishId]);

  // Reset the "added" confirmation when the configuration changes.
  useEffect(() => {
    setStatus((s) => (s === 'added' ? 'idle' : s));
  }, [modelId, finishId, storageId, careId]);

  const selectModel = (id) => {
    setModelId(id);
    const next = getModel(id);
    if (storageId && !next.storage.some((s) => s.id === storageId)) setStorageId(null);
  };

  const addToBag = () => {
    if (!storage) {
      setShowHint(true);
      document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('adding');
    window.setTimeout(() => {
      addItem({
        key: `iphone-${model.id}-${finish.id}-${storage.id}-${care.id}`,
        type: 'iphone',
        name: `${model.name} ${storage.label}`,
        details: [finish.finish, care.id === 'none' ? null : 'AppleCare+ (2 years)'].filter(Boolean),
        price: total,
        swatch: finish.hex,
        icon: 'design',
        href: `/buy?model=${model.id}&finish=${finish.id}`,
      });
      setStatus('added');
      toast({
        title: 'Added to your bag',
        description: `${model.name} · ${storage.label} · ${finish.finish}`,
        action: { label: 'View bag', onClick: () => navigate('/bag') },
      });
    }, 450);
  };

  return (
    <div className="page buy-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Buy iPhone 15 Pro' }]} />
        <div className="buy-intro">
          <div>
            <span className="eyebrow">Configure</span>
            <h1 className="page-title">Buy {model.name}</h1>
            <p className="page-lede">
              From {formatPrice(model.storage[0].price)} or {monthly(model.storage[0].price)}/mo. for 24 mo.
            </p>
          </div>
          <Link to="/specs#compare" className="btn btn-ghost">
            <Icon name="ruler" size={16} /> Compare models
          </Link>
        </div>

        <div className="buy-layout">
          {/* Preview */}
          <div className="buy-preview">
            <div className="buy-preview-stage" style={{ '--finish': finish.hex }}>
              <SceneErrorBoundary>
                <Suspense fallback={null}>
                  <PhoneOrbit phoneColor={finish.hex} />
                </Suspense>
              </SceneErrorBoundary>
              <SceneLoader label="Loading preview" />
              <span className="buy-preview-tag">
                <span className="color-swatch color-swatch-sm" style={{ backgroundColor: finish.hex }} />
                {finish.finish}
              </span>
            </div>
            <p className="buy-preview-hint">
              <Icon name="rotate" size={14} /> Drag to rotate
            </p>
          </div>

          {/* Options */}
          <div className="buy-options">
            <Step number={1} title="Model.">
              <div className="option-grid option-grid-2" role="radiogroup" aria-label="Model">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={modelId === m.id}
                    className={`option-card ${modelId === m.id ? 'is-selected' : ''}`}
                    onClick={() => selectModel(m.id)}
                  >
                    <span className="option-card-title">{m.name}</span>
                    <span className="option-card-sub">{m.display}</span>
                    <span className="option-card-price">From {formatPrice(m.storage[0].price)}</span>
                  </button>
                ))}
              </div>
            </Step>

            <Step number={2} title="Finish." aside={<span className="config-step-aside">{finish.finish}</span>}>
              <div className="swatch-row" role="radiogroup" aria-label="Finish">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={finishId === f.id}
                    aria-label={f.finish}
                    title={f.finish}
                    className={`swatch-btn ${finishId === f.id ? 'is-selected' : ''}`}
                    onClick={() => setFinishId(f.id)}
                  >
                    <span style={{ backgroundColor: f.hex }} />
                  </button>
                ))}
              </div>
            </Step>

            <Step number={3} title="Storage.">
              <div className="option-grid option-grid-2" role="radiogroup" aria-label="Storage" aria-required="true">
                {model.storage.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={storageId === s.id}
                    className={`option-card ${storageId === s.id ? 'is-selected' : ''}`}
                    onClick={() => {
                      setStorageId(s.id);
                      setShowHint(false);
                    }}
                  >
                    <span className="option-card-title">{s.label}</span>
                    <span className="option-card-price">
                      {formatPrice(s.price)}
                      <small> or {monthly(s.price)}/mo.</small>
                    </span>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {showHint && !storage && (
                  <motion.p
                    className="field-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Icon name="alert" size={14} /> Please choose a storage capacity to continue.
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="config-note">
                Photos and 4K ProRes video take up a lot of space. Choose 256GB or more if you shoot often.
              </p>
            </Step>

            <Step number={4} title="AppleCare+ coverage.">
              <div className="option-grid" role="radiogroup" aria-label="AppleCare+">
                {APPLECARE.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={careId === c.id}
                    className={`option-card option-card-row ${careId === c.id ? 'is-selected' : ''}`}
                    onClick={() => setCareId(c.id)}
                  >
                    <span className="option-card-main">
                      <span className="option-card-title">
                        {c.id !== 'none' && <Icon name="shield" size={16} />} {c.label}
                      </span>
                      <span className="option-card-sub">{c.detail}</span>
                    </span>
                    <span className="option-card-price">{c.price ? `+${formatPrice(c.price)}` : 'Included'}</span>
                  </button>
                ))}
              </div>
            </Step>

            <ul className="buy-assurances">
              <li>
                <Icon name="truck" size={18} /> Free delivery
              </li>
              <li>
                <Icon name="refresh" size={18} /> Free 14-day returns
              </li>
              <li>
                <Icon name="lock" size={18} /> Secure checkout
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky summary */}
      <div className="buy-summary-bar">
        <div className="container buy-summary-inner">
          <div className="buy-summary-text">
            <span className="buy-summary-name">
              {model.name}
              {storage ? ` · ${storage.label}` : ''} · {finish.name}
            </span>
            <span className="buy-summary-price">
              {storage ? '' : 'From '}
              <strong>{formatPrice(total)}</strong> or {monthly(total)}/mo.
            </span>
          </div>
          <div className="buy-summary-actions">
            {status === 'added' && (
              <Link to="/bag" className="btn btn-secondary">
                Review bag
              </Link>
            )}
            <button
              type="button"
              className={`btn btn-primary btn-lg ${status === 'adding' ? 'is-loading' : ''}`}
              onClick={addToBag}
              disabled={status === 'adding'}
              aria-disabled={!storage}
              data-incomplete={!storage || undefined}
            >
              {status === 'adding' ? (
                <>
                  <Spinner /> Adding…
                </>
              ) : status === 'added' ? (
                <>
                  <Icon name="check" size={16} /> Added
                </>
              ) : storage ? (
                'Add to Bag'
              ) : (
                'Select storage'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
