const drawings = {
  all: <><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none"/></>,
  normal: <><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/></>,
  fire: <path d="M12 21c-4 0-7-2.8-7-6.5 0-2.7 1.7-4.8 3.7-6.7-.3 2.5 1 3.2 1.7 3.5C10 7.7 12.6 5.3 14 3c.2 3.5 4.9 5.9 4.9 11.5C18.9 18.2 16 21 12 21Z"/>,
  water: <path d="M12 3c-2.5 4-6.5 8.3-6.5 12a6.5 6.5 0 0 0 13 0C18.5 11.3 14.5 7 12 3Z"/>,
  electric: <path d="m13.7 2-8 11h5.5L10.3 22l8-11h-5.5L13.7 2Z"/>,
  grass: <><path d="M20 4C11 4 5 7 5 14a6 6 0 0 0 6 6c7 0 10-6 9-16Z"/><path d="M6 19c3-4 6-7 11-10M11 14l-1-4M13 12l3 1"/></>,
  ice: <><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 5l3-3 3 3M9 19l3 3 3-3"/></>,
  fighting: <><path d="M5 11V7a2 2 0 0 1 4 0v2-4a2 2 0 0 1 4 0v4-3a2 2 0 0 1 4 0v4a2 2 0 0 1 3 1.7V15c0 3-2.5 5-5.5 5H11c-3.5 0-6-2.7-6-6v-3Z"/></>,
  poison: <><path d="M9 3h6M10 3v6l-5 8a2.5 2.5 0 0 0 2.1 4h9.8a2.5 2.5 0 0 0 2.1-4l-5-8V3M7.5 16h9"/><circle cx="11" cy="18" r=".7" fill="currentColor" stroke="none"/></>,
  ground: <><path d="M3 20 9 7l4 7 2-3 6 9H3ZM7 20l3-5 2 2"/></>,
  flying: <><path d="M4 19c4-8 9-13 16-14-1 7-6 12-14 14H4ZM7 17l8-8M10 13l-1-4"/></>,
  psychic: <><path d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/></>,
  bug: <><path d="M8 9a4 4 0 0 1 8 0v5a4 4 0 0 1-8 0V9ZM12 5V3M5 9h3M16 9h3M4 14h4M16 14h4M7 19l2-3M17 19l-2-3M9 11h6"/></>,
  rock: <path d="m3 18 4-10 5-4 7 4 2 10-9 3-9-3ZM7 8l5 4 7-4M12 12v9"/>,
  ghost: <><path d="M5 20V10a7 7 0 0 1 14 0v10l-3-2-4 2-4-2-3 2Z"/><path d="M9 12h1M14 12h1"/></>,
  dragon: <><path d="M5 19c1-7 5-11 12-12l2-4 2 7-4 1c-2 6-6 9-12 8ZM7 11 4 7l5 1M15 12h1M11 18l-1-4"/></>,
  dark: <path d="M17 3a9 9 0 1 0 4 16A9 9 0 0 1 17 3Z"/>,
  steel: <><path d="m8 3 8 0 5 9-5 9H8l-5-9 5-9Z"/><circle cx="12" cy="12" r="3.2"/></>,
  fairy: <><path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3L12 2ZM18 3v3M16.5 4.5h3"/></>,
}

export default function TypeIcon({ type }) {
  return <span className={`type-icon type-icon-${type}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{drawings[type] || drawings.all}</svg></span>
}
