/* Static editorial content shared between pages and site search. */

export const FAQ_TOPICS = [
  { id: 'orders', label: 'Orders & delivery', icon: 'truck' },
  { id: 'returns', label: 'Returns & refunds', icon: 'refresh' },
  { id: 'applecare', label: 'Repairs & AppleCare+', icon: 'shield' },
  { id: 'setup', label: 'Setup & transfer', icon: 'display' },
];

export const FAQS = [
  {
    id: 'delivery-time',
    topic: 'orders',
    q: 'How long does delivery take?',
    a: 'Standard delivery is free and arrives in 3–5 business days. Express delivery arrives in 1–2 business days for $15. You will see the estimated date at checkout.',
  },
  {
    id: 'track-order',
    topic: 'orders',
    q: 'How do I track my order?',
    a: 'Use the Order Status tool on the Support page with the order number from your confirmation screen (it starts with “W”). You can also find it in your confirmation email.',
  },
  {
    id: 'change-order',
    topic: 'orders',
    q: 'Can I change or cancel my order?',
    a: 'Orders can be changed or cancelled until they enter the shipping stage. Contact us with your order number and we will take care of it.',
  },
  {
    id: 'return-window',
    topic: 'returns',
    q: 'What is the return policy?',
    a: 'You can return eligible products within 14 days of delivery for a full refund. Items must be returned in their original condition with all accessories.',
  },
  {
    id: 'refund-time',
    topic: 'returns',
    q: 'When will I receive my refund?',
    a: 'Refunds are issued to your original payment method within 5–10 business days after we receive and inspect your return.',
  },
  {
    id: 'applecare-cover',
    topic: 'applecare',
    q: 'What does AppleCare+ cover?',
    a: 'AppleCare+ includes unlimited repairs for accidental damage (with a service fee), battery service, and 24/7 priority access to experts for two years.',
  },
  {
    id: 'battery-service',
    topic: 'applecare',
    q: 'Is battery replacement covered?',
    a: 'If your battery retains less than 80% of its original capacity, AppleCare+ covers a replacement at no additional cost.',
  },
  {
    id: 'transfer-data',
    topic: 'setup',
    q: 'How do I move my data to a new iPhone?',
    a: 'Place your old iPhone next to your new one and follow Quick Start. You can also restore from an iCloud backup or transfer directly over USB-C.',
  },
  {
    id: 'usb-c',
    topic: 'setup',
    q: 'Does iPhone 15 Pro use USB-C?',
    a: 'Yes. iPhone 15 Pro features a USB-C connector with USB 3 support for transfer speeds up to 20x faster than USB 2.',
  },
];

export const SPEC_SECTIONS = [
  {
    id: 'chip',
    icon: 'cpu',
    title: 'A17 Pro chip',
    summary: 'The first 3-nanometer chip in a smartphone.',
    points: [
      'New 6-core CPU with 2 performance and 4 efficiency cores',
      'Pro-class 6-core GPU, up to 20% faster with hardware ray tracing',
      '16-core Neural Engine — up to 2x faster for machine learning',
      'Dedicated AV1 decoder and USB 3 controller',
    ],
  },
  {
    id: 'display',
    icon: 'display',
    title: 'Super Retina XDR display',
    summary: 'ProMotion and Always-On, with up to 2000 nits peak brightness.',
    points: [
      'ProMotion technology with adaptive refresh rates up to 120Hz',
      'Always-On display with Dynamic Island',
      '2,000,000:1 contrast ratio and HDR',
      'Ceramic Shield front, tougher than any smartphone glass',
    ],
  },
  {
    id: 'camera',
    icon: 'camera',
    title: 'Pro camera system',
    summary: 'A 48MP Main camera and up to 5x optical zoom.',
    points: [
      '48MP Main: 24 mm, ƒ/1.78 aperture, second-generation sensor-shift OIS',
      '12MP Ultra Wide: 13 mm, ƒ/2.2 aperture, 120° field of view',
      '3x Telephoto on iPhone 15 Pro, 5x tetraprism Telephoto on Pro Max',
      'Spatial video, ProRes and Log encoding up to 4K60',
    ],
  },
  {
    id: 'battery',
    icon: 'battery',
    title: 'All-day battery life',
    summary: 'Up to 29 hours of video playback on iPhone 15 Pro Max.',
    points: [
      'iPhone 15 Pro: up to 23 hours of video playback',
      'iPhone 15 Pro Max: up to 29 hours of video playback',
      'Fast-charge up to 50% in around 30 minutes with a 20W adapter',
      'MagSafe and Qi2 wireless charging up to 15W',
    ],
  },
  {
    id: 'intelligence',
    icon: 'sparkles',
    title: 'Apple Intelligence',
    summary: 'Personal intelligence that helps you write, express yourself and get things done.',
    points: [
      'Writing Tools to rewrite, proofread and summarize text system-wide',
      'Priority notifications and smart summaries',
      'A more natural, more capable Siri',
      'Private Cloud Compute keeps your data private',
    ],
  },
  {
    id: 'design',
    icon: 'design',
    title: 'Titanium design',
    summary: 'Aerospace-grade titanium — our lightest Pro models ever.',
    points: [
      'Grade 5 titanium band with brushed texture',
      'Customizable Action button replaces the ring/silent switch',
      'Thinnest borders ever on iPhone',
      'IP68 water and dust resistance (6 meters up to 30 minutes)',
    ],
  },
];

export const COMPARE_ROWS = [
  { label: 'Display', pro: '6.1″ Super Retina XDR', max: '6.7″ Super Retina XDR' },
  { label: 'Chip', pro: 'A17 Pro', max: 'A17 Pro' },
  { label: 'Optical zoom', pro: '3x Telephoto', max: '5x Telephoto' },
  { label: 'Main camera', pro: '48MP Main', max: '48MP Main' },
  { label: 'Video playback', pro: 'Up to 23 hours', max: 'Up to 29 hours' },
  { label: 'Weight', pro: '187 grams', max: '221 grams' },
  { label: 'Storage', pro: '128GB – 1TB', max: '256GB – 1TB' },
  { label: 'Connector', pro: 'USB-C (USB 3)', max: 'USB-C (USB 3)' },
  { label: 'Starting price', pro: '$999', max: '$1,199' },
];
