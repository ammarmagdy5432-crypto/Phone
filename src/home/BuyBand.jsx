import { Link } from '../lib/router';
import { MODELS, formatPrice, monthly } from '../lib/catalog';
import { Reveal } from '../components/UI';
import { Icon } from '../components/Icons';

const HIGHLIGHTS = {
  pro: ['6.1″ Super Retina XDR', '3x optical zoom', 'Up to 23 hrs video'],
  'pro-max': ['6.7″ Super Retina XDR', '5x optical zoom', 'Up to 29 hrs video'],
};

const PERKS = [
  { icon: 'truck', title: 'Free delivery', text: 'Standard delivery on every order.' },
  { icon: 'refresh', title: '14-day returns', text: 'Change your mind? Send it back.' },
  { icon: 'shield', title: 'AppleCare+', text: 'Two years of accident coverage.' },
];

/** Closing call-to-action on the home page: pick a model. */
export default function BuyBand() {
  return (
    <section className="buy-band" id="buy" aria-labelledby="buy-band-title">
      <div className="container">
        <Reveal className="section-head section-head-center">
          <span className="eyebrow">Which Pro is right for you?</span>
          <h2 id="buy-band-title" className="section-title">
            Two sizes. One pro experience.
          </h2>
        </Reveal>

        <div className="model-grid">
          {MODELS.map((model, i) => (
            <Reveal key={model.id} delay={i * 0.08} className="model-card">
              <span className="model-card-size">{model.display}</span>
              <h3>{model.name}</h3>
              <p className="model-card-tagline">{model.tagline}</p>
              <ul className="check-list">
                {HIGHLIGHTS[model.id].map((h) => (
                  <li key={h}>
                    <Icon name="check" size={16} /> {h}
                  </li>
                ))}
              </ul>
              <p className="model-card-price">
                From {formatPrice(model.storage[0].price)}
                <span> or {monthly(model.storage[0].price)}/mo. for 24 mo.</span>
              </p>
              <div className="model-card-actions">
                <Link to={`/buy?model=${model.id}`} className="btn btn-primary">
                  Buy
                </Link>
                <Link to="/specs#compare" className="btn btn-ghost">
                  Compare <Icon name="chevron-right" size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="perk-row">
          {PERKS.map((perk) => (
            <div key={perk.title} className="perk">
              <span className="perk-icon">
                <Icon name={perk.icon} size={20} />
              </span>
              <div>
                <strong>{perk.title}</strong>
                <span>{perk.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
