import { useState } from 'react';
import { Link, useDocumentTitle } from '../lib/router';
import { COMPARE_ROWS, SPEC_SECTIONS } from '../lib/content';
import { FINISHES, MODELS, formatPrice } from '../lib/catalog';
import { PageHeader, Reveal } from '../components/UI';
import { Icon } from '../components/Icons';

export default function SpecsPage() {
  useDocumentTitle('Tech Specs');
  const [highlightDiffs, setHighlightDiffs] = useState(false);

  return (
    <div className="page specs-page">
      <PageHeader
        breadcrumbs={[{ label: 'Tech Specs' }]}
        eyebrow="Technical Specifications"
        title="iPhone 15 Pro & Pro Max."
        description="Every detail of the titanium enclosure, A17 Pro silicon, Pro camera system and all-day battery."
      >
        <div className="anchor-pills" role="navigation" aria-label="Jump to specification">
          {SPEC_SECTIONS.map((s) => (
            <Link key={s.id} to={`/specs#${s.id}`} className="chip">
              {s.title}
            </Link>
          ))}
          <Link to="/specs#compare" className="chip">
            Compare models
          </Link>
        </div>
      </PageHeader>

      <div className="container">
        {/* Finishes strip */}
        <Reveal className="specs-finishes card">
          <div className="specs-finishes-head">
            <h2>Finishes</h2>
            <p>Grade 5 titanium with textured matte glass back and Ceramic Shield front.</p>
          </div>
          <div className="specs-swatch-list">
            {FINISHES.map((f) => (
              <Link key={f.id} to={`/buy?finish=${f.id}`} className="specs-swatch-item">
                <span className="color-swatch" style={{ backgroundColor: f.hex }} />
                <span>{f.finish}</span>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Detailed spec cards */}
        <div className="specs-grid">
          {SPEC_SECTIONS.map((section, idx) => (
            <Reveal key={section.id} id={section.id} delay={idx * 0.04} className="spec-card card">
              <div className="spec-card-head">
                <span className="spec-icon">
                  <Icon name={section.icon} size={22} />
                </span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.summary}</p>
                </div>
              </div>
              <ul className="spec-points">
                {section.points.map((pt) => (
                  <li key={pt}>
                    <Icon name="check" size={15} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Model comparison */}
        <section id="compare" className="compare-section" aria-labelledby="compare-title">
          <div className="compare-head">
            <div>
              <span className="eyebrow">Side by side</span>
              <h2 id="compare-title" className="section-title">
                Compare Pro models
              </h2>
            </div>
            <label className="toggle-control">
              <input
                type="checkbox"
                checked={highlightDiffs}
                onChange={(e) => setHighlightDiffs(e.target.checked)}
              />
              <span>Highlight differences</span>
            </label>
          </div>

          <div className="compare-table-wrap card">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {MODELS.map((m) => (
                    <th scope="col" key={m.id}>
                      <div className="compare-col-head">
                        <strong>{m.name}</strong>
                        <span>From {formatPrice(m.storage[0].price)}</span>
                        <Link to={`/buy?model=${m.id}`} className="btn btn-primary btn-sm">
                          Buy
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => {
                  const isDiff = row.pro !== row.max;
                  return (
                    <tr key={row.label} className={highlightDiffs && isDiff ? 'is-diff' : undefined}>
                      <th scope="row">{row.label}</th>
                      <td>{row.pro}</td>
                      <td>{row.max}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA */}
        <Reveal className="specs-cta card">
          <div>
            <h2>Ready to make it yours?</h2>
            <p>Choose your size, titanium finish and storage capacity — with free delivery.</p>
          </div>
          <div className="specs-cta-actions">
            <Link to="/buy" className="btn btn-primary btn-lg">
              Buy iPhone 15 Pro
            </Link>
            <Link to="/#colors" className="btn btn-secondary btn-lg">
              Inspect in 360°
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
