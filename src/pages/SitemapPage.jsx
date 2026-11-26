import { Link, useDocumentTitle } from '../lib/router';
import { PageHeader, Reveal } from '../components/UI';
import { Icon } from '../components/Icons';

const GROUPS = [
  {
    title: 'Explore iPhone 15 Pro',
    icon: 'sparkles',
    links: [
      { label: 'Overview', to: '/#hero', desc: 'Interactive 3D hero experience' },
      { label: 'Features', to: '/#features', desc: 'Screen, Camera and Titanium Design story' },
      { label: 'Performance', to: '/#power', desc: 'Battery life, A17 Pro and Apple Intelligence' },
      { label: '360° Finishes', to: '/#colors', desc: 'Inspect all four titanium colors' },
      { label: 'Tech Specs', to: '/specs', desc: 'Full hardware specifications' },
      { label: 'Compare Models', to: '/specs#compare', desc: 'iPhone 15 Pro vs. iPhone 15 Pro Max' },
    ],
  },
  {
    title: 'Shop',
    icon: 'bag',
    links: [
      { label: 'Buy iPhone 15 Pro', to: '/buy?model=pro', desc: 'Configure 6.1-inch model' },
      { label: 'Buy iPhone 15 Pro Max', to: '/buy?model=pro-max', desc: 'Configure 6.7-inch model' },
      { label: 'Accessories', to: '/accessories', desc: 'Cases, MagSafe chargers, audio and wearables' },
      { label: 'Your Bag', to: '/bag', desc: 'Review items and apply promo codes' },
      { label: 'Checkout', to: '/checkout', desc: 'Complete your demo order' },
    ],
  },
  {
    title: 'Support & Policies',
    icon: 'shield',
    links: [
      { label: 'Help Center & FAQs', to: '/support#faq', desc: 'Answers on delivery, returns and setup' },
      { label: 'Order Status', to: '/support#order-status', desc: 'Track an order by number' },
      { label: 'Contact Support', to: '/support#contact', desc: 'Send a message to our team' },
      { label: 'Privacy Policy', to: '/legal#privacy', desc: 'How local data is handled' },
      { label: 'Terms of Use', to: '/legal#terms', desc: 'Showcase terms and trademarks' },
      { label: 'Sales & Refunds', to: '/legal#sales', desc: 'Delivery and 14-day return info' },
    ],
  },
];

export default function SitemapPage() {
  useDocumentTitle('Site Map');

  return (
    <div className="page sitemap-page">
      <PageHeader
        breadcrumbs={[{ label: 'Site Map' }]}
        eyebrow="Directory"
        title="Site Map."
        description="Every page and section available across the iPhone 15 Pro experience."
      />

      <div className="container">
        <div className="sitemap-grid">
          {GROUPS.map((g, idx) => (
            <Reveal key={g.title} delay={idx * 0.06} className="sitemap-card card">
              <div className="sitemap-card-head">
                <span className="spec-icon">
                  <Icon name={g.icon} size={20} />
                </span>
                <h2>{g.title}</h2>
              </div>
              <ul className="sitemap-list">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>
                      <span>
                        <strong>{l.label}</strong>
                        <small>{l.desc}</small>
                      </span>
                      <Icon name="chevron-right" size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
