/* ============================================================
   Product catalog — single source of truth for models, finishes,
   storage tiers, accessories and pricing used across the site.
   ============================================================ */

export const FINISHES = [
  { id: 'natural', name: 'Natural', finish: 'Natural Titanium', hex: '#8f8a81' },
  { id: 'blue', name: 'Blue', finish: 'Blue Titanium', hex: '#3f4a5a' },
  { id: 'white', name: 'White', finish: 'White Titanium', hex: '#f2f2f2' },
  { id: 'black', name: 'Black', finish: 'Black Titanium', hex: '#1c1c1e' },
];

export const MODELS = [
  {
    id: 'pro',
    name: 'iPhone 15 Pro',
    display: '6.1-inch display',
    tagline: 'Pro power in a perfectly pocketable size.',
    storage: [
      { id: '128', label: '128GB', price: 999 },
      { id: '256', label: '256GB', price: 1099 },
      { id: '512', label: '512GB', price: 1299 },
      { id: '1tb', label: '1TB', price: 1499 },
    ],
  },
  {
    id: 'pro-max',
    name: 'iPhone 15 Pro Max',
    display: '6.7-inch display',
    tagline: 'The biggest screen and 5x optical zoom.',
    storage: [
      { id: '256', label: '256GB', price: 1199 },
      { id: '512', label: '512GB', price: 1399 },
      { id: '1tb', label: '1TB', price: 1599 },
    ],
  },
];

export const APPLECARE = [
  { id: 'none', label: 'No AppleCare+ coverage', price: 0, detail: 'Standard one-year limited warranty.' },
  {
    id: 'applecare',
    label: 'AppleCare+',
    price: 199,
    detail: 'Unlimited repairs for accidental damage and 24/7 priority support for two years.',
  },
];

export const ACCESSORIES = [
  { id: 'finewoven-case', name: 'FineWoven Case with MagSafe', category: 'Cases', price: 59, icon: 'case', tone: '#5b4a3a', description: 'Durable micro-twill with a soft, suede-like feel.' },
  { id: 'silicone-case', name: 'Silicone Case with MagSafe', category: 'Cases', price: 49, icon: 'case', tone: '#3c4a63', description: 'Silky, soft-touch finish with a microfiber lining.' },
  { id: 'clear-case', name: 'Clear Case with MagSafe', category: 'Cases', price: 49, icon: 'case', tone: '#6b7280', description: 'Shows off your titanium finish while protecting it.' },
  { id: 'magsafe-charger', name: 'MagSafe Charger (1 m)', category: 'Charging', price: 39, icon: 'puck', tone: '#4b5563', description: 'Perfectly aligned magnets for fast wireless charging.' },
  { id: 'usb-c-adapter', name: '20W USB-C Power Adapter', category: 'Charging', price: 19, icon: 'adapter', tone: '#525866', description: 'Fast, efficient charging at home, in the office or on the go.' },
  { id: 'usb-c-cable', name: '240W USB-C Charge Cable (2 m)', category: 'Charging', price: 29, icon: 'cable', tone: '#4a4f5a', description: 'Woven design for charging and USB 3 data transfer.' },
  { id: 'airpods-pro', name: 'AirPods Pro (2nd gen) with USB-C', category: 'Audio', price: 249, icon: 'earbuds', tone: '#4b5a6b', description: 'Adaptive Audio, Active Noise Cancellation and Personalized Spatial Audio.' },
  { id: 'apple-watch', name: 'Apple Watch Series 9', category: 'Wearables', price: 399, icon: 'watch', tone: '#5a3f4a', description: 'Smarter, brighter and mightier — with the magical double tap gesture.' },
  { id: 'airtag', name: 'AirTag', category: 'Wearables', price: 29, icon: 'tag', tone: '#4f5562', description: 'Keep track of your keys, wallet, luggage and more in Find My.' },
];

export const ACCESSORY_CATEGORIES = ['All', ...Array.from(new Set(ACCESSORIES.map((a) => a.category)))];

export const PROMO_CODES = {
  TITANIUM10: { label: '10% off your order', rate: 0.1 },
};

export const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard delivery', detail: 'Delivers in 3–5 business days', price: 0 },
  { id: 'express', label: 'Express delivery', detail: 'Delivers in 1–2 business days', price: 15 },
];

export const TAX_RATE = 0.08;

export const getModel = (id) => MODELS.find((m) => m.id === id);
export const getFinish = (id) => FINISHES.find((f) => f.id === id);
export const getAccessory = (id) => ACCESSORIES.find((a) => a.id === id);
export const startingPrice = (modelId) => getModel(modelId)?.storage[0].price ?? 0;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatPrice = (value) => currency.format(value);
export const monthly = (value, months = 24) => currency.format(value / months);

/** Normalises an accessory into a bag line item. */
export const accessoryToBagItem = (a) => ({
  key: `acc-${a.id}`,
  type: 'accessory',
  name: a.name,
  details: [a.category],
  price: a.price,
  icon: a.icon,
  tone: a.tone,
  href: `/accessories?item=${a.id}`,
});
