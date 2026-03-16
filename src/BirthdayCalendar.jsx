import { VILLAGERS } from './data/villagers'

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter']

const SEASON_STYLES = {
  Spring: {
    header:  { background: '#2d6a1f', borderColor: '#4a7c2f' },
    card:    { background: '#edf9dc', borderColor: '#4a7c2f' },
    day:     { background: '#c8f0a0', color: '#1a5c00', borderColor: '#4a7c2f' },
    title:   { color: '#f5e6c8' },
  },
  Summer: {
    header:  { background: '#8a5c00', borderColor: '#c8900a' },
    card:    { background: '#fffbe8', borderColor: '#c8900a' },
    day:     { background: '#ffe080', color: '#7a4800', borderColor: '#c8900a' },
    title:   { color: '#f5e6c8' },
  },
  Fall: {
    header:  { background: '#7a3800', borderColor: '#a0522d' },
    card:    { background: '#fdf1e4', borderColor: '#a0522d' },
    day:     { background: '#f4a460', color: '#5c2000', borderColor: '#a0522d' },
    title:   { color: '#f5e6c8' },
  },
  Winter: {
    header:  { background: '#1a3c7a', borderColor: '#5b8dd9' },
    card:    { background: '#edf4ff', borderColor: '#5b8dd9' },
    day:     { background: '#b8d8f8', color: '#003880', borderColor: '#5b8dd9' },
    title:   { color: '#f5e6c8' },
  },
}

const SEASON_ICONS = {
  Spring: '🌸',
  Summer: '☀️',
  Fall:   '🍂',
  Winter: '❄️',
}

// Group villagers by season, sorted by day
const birthdaysBySeason = SEASONS.reduce((acc, season) => {
  acc[season] = VILLAGERS
    .filter(v => v.birthday.season === season)
    .sort((a, b) => a.birthday.day - b.birthday.day)
  return acc
}, {})

export default function BirthdayCalendar({ onNavigateToVillager }) {
  return (
    <div className="birthday-calendar">
      <div className="birthday-seasons-grid">
        {SEASONS.map(season => {
          const styles = SEASON_STYLES[season]
          const villagers = birthdaysBySeason[season]

          return (
            <div
              key={season}
              className="birthday-season-card"
              style={{ borderColor: styles.card.borderColor, background: styles.card.background }}
            >
              {/* Season header */}
              <div
                className="birthday-season-header"
                style={{ background: styles.header.background, borderColor: styles.header.borderColor }}
              >
                <span className="birthday-season-icon">{SEASON_ICONS[season]}</span>
                <span className="birthday-season-title" style={styles.title}>{season}</span>
                <span className="birthday-season-count" style={styles.title}>
                  {villagers.length} birthdays
                </span>
              </div>

              {/* Birthday entries */}
              <div className="birthday-entries">
                {villagers.map(v => (
                  <div key={v.id} className="birthday-entry">
                    <div
                      className="birthday-day-badge"
                      style={{
                        background: styles.day.background,
                        color: styles.day.color,
                        borderColor: styles.day.borderColor,
                      }}
                    >
                      {v.birthday.day}
                    </div>
                    <img
                      src={v.sprite}
                      alt={v.name}
                      className="birthday-portrait"
                      onError={e => { e.target.style.opacity = 0 }}
                    />
                    <div className="birthday-info">
                      <button
                        className="birthday-name-btn"
                        onClick={() => onNavigateToVillager && onNavigateToVillager(v)}
                        title="View villager profile"
                      >
                        {v.name} ↗
                      </button>
                      <div className="birthday-loved-gifts">
                        {v.loved.slice(0, 4).map(gift => (
                          <span key={gift} className="birthday-gift-tag">{gift}</span>
                        ))}
                        {v.loved.length > 4 && (
                          <span className="birthday-gift-tag birthday-gift-more">+{v.loved.length - 4}</span>
                        )}
                      </div>
                    </div>
                    {v.marriageable && (
                      <span className="birthday-heart">💍</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
