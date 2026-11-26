import { Link, useDocumentTitle } from '../lib/router';
import { PageHeader } from '../components/UI';

const SECTIONS = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body: [
      'This iPhone 15 Pro showcase runs entirely in your browser. We do not collect, transmit or sell personal data to any server.',
      'Your shopping bag and demo order history are stored locally in your browser’s localStorage so your selections persist across refreshes. You can clear them at any time from your bag or browser settings.',
      'Information entered in checkout or support forms is validated client-side for demonstration purposes only and is never sent over the network.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Use',
    body: [
      'This website is an independent interactive product showcase built with React, Three.js and React Three Fiber. It is not affiliated with, endorsed by or sponsored by Apple Inc.',
      'Apple, iPhone, AppleCare+, AirPods, Apple Watch and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries.',
      'All product specifications, pricing and availability figures are shown for illustrative purposes only.',
    ],
  },
  {
    id: 'sales',
    title: 'Sales & Refunds',
    body: [
      'No real transactions are processed on this site. Checkout simulates an end-to-end purchase flow including promo codes (try TITANIUM10), shipping methods and order confirmation.',
      'In a real retail environment, eligible devices may be returned within 14 calendar days of delivery in original condition for a full refund to the original payment method.',
      'Standard delivery is complimentary on all orders; Express delivery arrives in 1–2 business days for $15.',
    ],
  },
];

export default function LegalPage() {
  useDocumentTitle('Legal & Privacy');

  return (
    <div className="page legal-page">
      <PageHeader
        breadcrumbs={[{ label: 'Legal & Privacy' }]}
        eyebrow="Policies"
        title="Legal & Privacy."
        description="Plain-language information about privacy, demo checkout behavior and trademarks."
      >
        <div className="anchor-pills">
          {SECTIONS.map((s) => (
            <Link key={s.id} to={`/legal#${s.id}`} className="chip">
              {s.title}
            </Link>
          ))}
        </div>
      </PageHeader>

      <div className="container container-narrow legal-stack">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="legal-section card">
            <h2>{s.title}</h2>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}

        <div className="legal-foot">
          <p>Questions about these policies?</p>
          <Link to="/support#contact" className="btn btn-secondary">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
