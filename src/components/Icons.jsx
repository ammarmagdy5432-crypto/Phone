/* Inline SVG icon set — 24px grid, stroke-based, inherits currentColor. */

const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12.2a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.5v.01" />
    </>
  ),
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'chevron-left': <path d="m15 6-6 6 6 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'arrow-right': <path d="M5 12h14m-6-6 6 6-6 6" />,
  'arrow-left': <path d="M19 12H5m6-6-6 6 6 6" />,
  'arrow-up': <path d="M12 19V5m-6 6 6-6 6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l.8 12a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9l.8-12" />
      <path d="M10 11v5.5M14 11v5.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6.5h11v10H3zM14 10h3.8l3.2 3.2v3.3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </>
  ),
  refresh: (
    <>
      <path d="M19.5 9A8 8 0 0 0 5 7.5M4.5 15A8 8 0 0 0 19 16.5" />
      <path d="M19.5 4.5V9H15M4.5 19.5V15H9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6l7-2.5Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  chat: <path d="M5 5.5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4.5 3.5v-3.5H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  package: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="7.5" width="16" height="9" rx="2" />
      <path d="M21 10.5v3M6 10.5v3M9 10.5v3M12 10.5v3" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3.5 12.6 8 17 9.5l-4.4 1.6L11 15.5l-1.6-4.4L5 9.5 9.4 8 11 3.5Z" />
      <path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="6.5" width="18" height="13" rx="2.5" />
      <circle cx="12" cy="13" r="3.6" />
      <path d="M8.5 6.5 10 4h4l1.5 2.5" />
    </>
  ),
  display: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 5h3" />
    </>
  ),
  design: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <rect x="8.5" y="4.5" width="4" height="4" rx="1.2" />
    </>
  ),
  case: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <rect x="8" y="4.5" width="4.5" height="4.5" rx="1.3" />
      <circle cx="12" cy="14" r="2.4" />
    </>
  ),
  puck: (
    <>
      <circle cx="12" cy="10" r="6" />
      <circle cx="12" cy="10" r="2" />
      <path d="M12 16v5" />
    </>
  ),
  adapter: (
    <>
      <rect x="6.5" y="7" width="11" height="13" rx="2.5" />
      <path d="M10 7V3.5M14 7V3.5M10.5 15.5h3" />
    </>
  ),
  cable: (
    <>
      <path d="M7 3.5v4M17 16.5v4" />
      <rect x="5.5" y="7.5" width="3" height="4" rx="1" />
      <rect x="15.5" y="12.5" width="3" height="4" rx="1" />
      <path d="M7 11.5c0 6 10-5 10 1" />
    </>
  ),
  earbuds: (
    <>
      <path d="M7.5 4a3.5 3.5 0 0 1 3.5 3.5V9a3 3 0 0 1-2 2.8V19a1.5 1.5 0 0 1-3 0V10.5A3.5 3.5 0 0 1 4 7.5 3.5 3.5 0 0 1 7.5 4Z" />
      <path d="M16.5 4A3.5 3.5 0 0 0 13 7.5V9a3 3 0 0 0 2 2.8V19a1.5 1.5 0 0 0 3 0V10.5a3.5 3.5 0 0 0 2-3A3.5 3.5 0 0 0 16.5 4Z" />
    </>
  ),
  watch: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="3.5" />
      <path d="M8.5 6 9.5 2.5h5L15.5 6M8.5 18l1 3.5h5l1-3.5M18 10.5h1.2" />
    </>
  ),
  tag: (
    <>
      <circle cx="12" cy="13" r="7" />
      <circle cx="12" cy="13" r="2.5" />
    </>
  ),
  home: <path d="m4 11 8-6.5 8 6.5M6 9.5V20h12V9.5" />,
  map: (
    <>
      <path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5l-6-2Z" />
      <path d="M9 4.5v13M15 6.5v13" />
    </>
  ),
  document: (
    <>
      <path d="M7 3.5h7l4 4v13H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
    </>
  ),
  rotate: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
  ruler: (
    <>
      <path d="m3.5 15.5 12-12 5 5-12 12-5-5Z" />
      <path d="m7.5 11.5 2 2M10.5 8.5l2 2M13.5 5.5l2 2" />
    </>
  ),
};

export function Icon({ name, size = 20, strokeWidth = 1.6, className, title }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {content}
    </svg>
  );
}

export function AppleLogo({ size = 18 }) {
  return (
    <svg width={size * 0.82} height={size} viewBox="0 0 14 17" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M11.62 9.03c-.02-1.83 1.5-2.71 1.57-2.76-.86-1.25-2.19-1.42-2.66-1.44-1.13-.11-2.21.67-2.79.67-.58 0-1.46-.65-2.4-.63-1.24.02-2.38.72-3.02 1.83-1.29 2.23-.33 5.54.93 7.35.61.89 1.34 1.88 2.3 1.84.92-.04 1.27-.59 2.38-.59 1.11 0 1.43.59 2.4.58.99-.02 1.62-.9 2.22-1.79.7-1.03.99-2.03 1.01-2.08-.02-.01-1.94-.75-1.94-2.98ZM9.8 3.66c.51-.62.85-1.47.76-2.33-.73.03-1.62.49-2.15 1.1-.47.54-.88 1.42-.77 2.25.82.06 1.65-.41 2.16-1.02Z"
      />
    </svg>
  );
}
