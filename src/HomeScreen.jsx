const SECTIONS = [
  {
    id: 'community_center',
    emoji: '🏠',
    label: 'Bundles',
    desc: 'Track Community Center bundle progress',
    color: { bg: '#edf9dc', border: '#4a7c2f', header: '#2d6a1f', text: '#1a5c00' },
  },
  {
    id: 'fishing',
    emoji: '🎣',
    label: 'Fishing',
    desc: 'Fish locations, seasons & weather',
    color: { bg: '#edf4ff', border: '#5b8dd9', header: '#1a3c7a', text: '#003880' },
  },
  {
    id: 'villagers',
    emoji: '👥',
    label: 'Villagers',
    desc: 'Gifts, schedules & relationships',
    color: { bg: '#fce4ec', border: '#e91e63', header: '#880e4f', text: '#5c0030' },
  },
  {
    id: 'birthdays',
    emoji: '🎂',
    label: 'Birthdays',
    desc: 'Birthday calendar with loved gifts',
    color: { bg: '#fff3e0', border: '#ff9800', header: '#e65100', text: '#7a2900' },
  },
  {
    id: 'crops',
    emoji: '🌱',
    label: 'Crops',
    desc: 'Profit planner by season & day',
    color: { bg: '#f1f8e9', border: '#7cb342', header: '#33691e', text: '#1b5e20' },
  },
  {
    id: 'museum',
    emoji: '🏛',
    label: 'Museum',
    desc: 'Artifact & mineral donation checklist',
    color: { bg: '#fdf1e4', border: '#a0522d', header: '#7a3800', text: '#5c2000' },
  },
  {
    id: 'recipes',
    emoji: '🍳',
    label: 'Recipes',
    desc: 'Cooking recipes & learned tracker',
    color: { bg: '#fce4ec', border: '#c2185b', header: '#7b0035', text: '#560027' },
  },
]

export default function HomeScreen({ onNavigate }) {
  return (
    <div className="home-screen">
      {/* Hero */}
      <div className="home-hero">
        <div className="home-logo-star">★</div>
        <h2 className="home-hero-title">Stardew Valley</h2>
        <p className="home-hero-sub">Companion App</p>
        <p className="home-hero-tagline">Your complete farming guide</p>
      </div>

      {/* Section grid */}
      <div className="home-sections-grid">
        {SECTIONS.map(sec => (
          <button
            key={sec.id}
            className="home-section-card"
            style={{
              background: sec.color.bg,
              borderColor: sec.color.border,
            }}
            onClick={() => onNavigate(sec.id)}
          >
            <div
              className="home-section-card-header"
              style={{ background: sec.color.header, borderColor: sec.color.border }}
            >
              <span className="home-section-emoji">{sec.emoji}</span>
              <span className="home-section-label" style={{ color: '#f5e6c8' }}>{sec.label}</span>
            </div>
            <p className="home-section-desc" style={{ color: sec.color.text }}>{sec.desc}</p>
          </button>
        ))}
      </div>

      <div className="home-footer">★ Stardew Companion ★</div>
    </div>
  )
}
