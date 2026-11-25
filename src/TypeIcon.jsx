const officialTypes = new Set([
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost',
  'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon',
  'dark', 'fairy',
])

export default function TypeIcon({ type }) {
  if (officialTypes.has(type)) {
    return <img className="type-icon" src={`/type-icons/${type}.png`} alt="" aria-hidden="true" />
  }

  return <span className="type-icon type-icon-all" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" /><path d="M4 12h16" /><circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none" />
    </svg>
  </span>
}
