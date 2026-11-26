import { ACCESSORIES, formatPrice } from './catalog';
import { FAQS, SPEC_SECTIONS } from './content';

/** Flat index powering the global search overlay. */
export const SEARCH_INDEX = [
  { group: 'Pages', title: 'Overview', description: 'Meet iPhone 15 Pro', to: '/#hero', icon: 'home', keywords: 'home start' },
  { group: 'Pages', title: 'Buy iPhone 15 Pro', description: 'Choose model, finish and storage', to: '/buy', icon: 'bag', keywords: 'purchase order configure price' },
  { group: 'Pages', title: 'Tech Specs', description: 'Full specifications and model comparison', to: '/specs', icon: 'ruler', keywords: 'compare specifications pro max' },
  { group: 'Pages', title: 'Accessories', description: 'Cases, chargers, AirPods and more', to: '/accessories', icon: 'case', keywords: 'shop store airpods watch magsafe' },
  { group: 'Pages', title: 'Your Bag', description: 'Review items and check out', to: '/bag', icon: 'bag', keywords: 'cart basket checkout' },
  { group: 'Pages', title: 'Support', description: 'FAQs, order status and contact', to: '/support', icon: 'chat', keywords: 'help contact faq' },
  { group: 'Pages', title: 'Order Status', description: 'Look up an existing order', to: '/support#order-status', icon: 'package', keywords: 'track tracking delivery' },
  { group: 'Pages', title: 'Legal & Privacy', description: 'Privacy, terms, sales and refunds', to: '/legal', icon: 'document', keywords: 'privacy terms refund policy' },
  { group: 'Pages', title: 'Site Map', description: 'Every page on this site', to: '/sitemap', icon: 'map', keywords: 'sitemap index' },
  { group: 'Highlights', title: 'Features', description: 'Screen, camera and design story', to: '/#features', icon: 'sparkles', keywords: 'screen camera design' },
  { group: 'Highlights', title: 'Performance', description: 'Battery, A17 Pro and Apple Intelligence', to: '/#power', icon: 'cpu', keywords: 'battery chip power' },
  { group: 'Highlights', title: 'Finishes', description: 'Explore four titanium finishes in 360°', to: '/#colors', icon: 'rotate', keywords: 'color colour natural blue white black' },
  ...SPEC_SECTIONS.map((s) => ({
    group: 'Specs',
    title: s.title,
    description: s.summary,
    to: `/specs#${s.id}`,
    icon: s.icon,
    keywords: s.points.join(' '),
  })),
  ...ACCESSORIES.map((a) => ({
    group: 'Accessories',
    title: a.name,
    description: `${a.category} · ${formatPrice(a.price)}`,
    to: `/accessories?item=${a.id}`,
    icon: a.icon,
    keywords: a.description,
  })),
  ...FAQS.map((f) => ({
    group: 'Help',
    title: f.q,
    description: f.a,
    to: `/support?faq=${f.id}#faq`,
    icon: 'info',
    keywords: '',
  })),
];

export function searchSite(query) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return SEARCH_INDEX.map((item) => {
    const title = item.title.toLowerCase();
    const haystack = `${title} ${item.description} ${item.keywords}`.toLowerCase();
    if (!terms.every((t) => haystack.includes(t))) return null;
    const score = terms.reduce((s, t) => s + (title.startsWith(t) ? 3 : title.includes(t) ? 2 : 1), 0);
    return { ...item, score };
  })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
