import { useState, useMemo } from 'react'
import { FISH, FISH_TYPES } from './data/fish'
import { useIsMobile } from './useIsMobile'

const SEASON_COLORS = {
  Spring: { bg: '#c8f0a0', text: '#1a5c00', border: '#4a7c2f' },
  Summer: { bg: '#ffe080', text: '#7a4800', border: '#c8900a' },
  Fall:   { bg: '#f4a460', text: '#5c2000', border: '#a0522d' },
  Winter: { bg: '#b8d8f8', text: '#003880', border: '#5b8dd9' },
}

const WEATHER_ICONS = { Sun: '☀', Rain: '🌧', Any: '☀/🌧' }

const DIFFICULTY_COLORS = {
  Easy:       { bg: '#dff0c8', border: '#4a7c2f', text: '#1a5c00' },
  Medium:     { bg: '#fff3c0', border: '#c8900a', text: '#7a4800' },
  Hard:       { bg: '#fde0c0', border: '#c05020', text: '#5c1800' },
  'Very Hard':{ bg: '#f8c8c8', border: '#c03030', text: '#5c0000' },
  Legendary:  { bg: '#ecdcf8', border: '#8040c0', text: '#3c0080' },
  'Crab Pot': { bg: '#d8f0f8', border: '#3080a0', text: '#003858' },
}

function SeasonBadge({ season }) {
  const c = SEASON_COLORS[season]
  return (
    <span style={{
      background: c.bg, color: c.text, border: `2px solid ${c.border}`,
      fontSize: '6px', padding: '2px 6px', fontFamily: 'inherit',
    }}>
      {season}
    </span>
  )
}

function FishCard({ fish }) {
  const diff = DIFFICULTY_COLORS[fish.difficulty] || DIFFICULTY_COLORS['Medium']
  const isLegendary = fish.type === 'Legendary'
  const isCrabPot = fish.type === 'Crab Pot'

  return (
    <div className="fish-card" style={{ borderColor: isLegendary ? '#8040c0' : isCrabPot ? '#3080a0' : undefined }}>
      {/* Header */}
      <div className="fish-card-header" style={{ background: isLegendary ? '#3c1860' : isCrabPot ? '#003858' : undefined }}>
        <img src={fish.sprite} alt={fish.name} className="fish-card-sprite" onError={e => { e.target.style.opacity = 0 }} />
        <div className="fish-card-title-block">
          <h2 className="fish-card-name">{fish.name}</h2>
          <span className="fish-card-type">{fish.type}</span>
        </div>
        <div className="fish-card-diff" style={{ background: diff.bg, color: diff.text, border: `2px solid ${diff.border}` }}>
          {fish.difficulty}
        </div>
      </div>

      <div className="fish-card-body">
        {/* Price table */}
        <div className="fish-stat-section">
          <div className="fish-stat-label">Sell Price</div>
          <div className="fish-price-row">
            <div className="fish-price-cell">
              <div className="fish-price-tag">Base</div>
              <div className="fish-price-val">
                <img src="/sprites/Money.png" alt="g" style={{ width: 14, height: 14, imageRendering: 'pixelated', verticalAlign: 'middle' }} />
                {' '}{fish.price}g
              </div>
            </div>
            <div className="fish-price-cell">
              <div className="fish-price-tag">Fisher (+25%)</div>
              <div className="fish-price-val" style={{ color: '#c8900a' }}>
                <img src="/sprites/Money.png" alt="g" style={{ width: 14, height: 14, imageRendering: 'pixelated', verticalAlign: 'middle' }} />
                {' '}{fish.priceFisher}g
              </div>
            </div>
            <div className="fish-price-cell">
              <div className="fish-price-tag">Angler (+50%)</div>
              <div className="fish-price-val" style={{ color: '#c03030' }}>
                <img src="/sprites/Money.png" alt="g" style={{ width: 14, height: 14, imageRendering: 'pixelated', verticalAlign: 'middle' }} />
                {' '}{fish.priceAngler}g
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="fish-stats-grid">
          <div className="fish-stat-block">
            <div className="fish-stat-label">Season</div>
            <div className="fish-stat-badges">
              {fish.seasons.map(s => <SeasonBadge key={s} season={s} />)}
            </div>
          </div>
          <div className="fish-stat-block">
            <div className="fish-stat-label">Weather</div>
            <div className="fish-stat-value">{WEATHER_ICONS[fish.weather] || fish.weather} {fish.weather}</div>
          </div>
          <div className="fish-stat-block">
            <div className="fish-stat-label">Time</div>
            <div className="fish-stat-value">🕐 {fish.time}</div>
          </div>
          <div className="fish-stat-block">
            <div className="fish-stat-label">XP</div>
            <div className="fish-stat-value">⭐ {fish.xp} XP</div>
          </div>
        </div>

        {/* Locations */}
        <div className="fish-stat-section">
          <div className="fish-stat-label">Location</div>
          <div className="fish-tag-list">
            {fish.locations.map(loc => (
              <span key={loc} className="fish-tag fish-tag-loc">📍 {loc}</span>
            ))}
          </div>
        </div>

        {/* Bundles */}
        {fish.bundles.length > 0 && (
          <div className="fish-stat-section">
            <div className="fish-stat-label">Community Center</div>
            <div className="fish-tag-list">
              {fish.bundles.map(b => (
                <span key={b} className="fish-tag fish-tag-bundle">🏠 {b}</span>
              ))}
            </div>
          </div>
        )}

        {/* Cooking */}
        {fish.cooking.length > 0 && (
          <div className="fish-stat-section">
            <div className="fish-stat-label">Used in Cooking</div>
            <div className="fish-tag-list">
              {fish.cooking.map(r => (
                <span key={r} className="fish-tag fish-tag-cook">🍳 {r}</span>
              ))}
            </div>
          </div>
        )}

        {/* Quests */}
        {fish.quests.length > 0 && (
          <div className="fish-stat-section">
            <div className="fish-stat-label">Quests</div>
            <div className="fish-tag-list">
              {fish.quests.map(q => (
                <span key={q} className="fish-tag fish-tag-quest">📜 {q}</span>
              ))}
            </div>
          </div>
        )}

        {/* Special note */}
        {fish.note && (
          <div className="fish-note">⚠ {fish.note}</div>
        )}
      </div>
    </div>
  )
}

export default function FishingGuide() {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedFish, setSelectedFish] = useState(null)
  const isMobile = useIsMobile()

  const results = useMemo(() => {
    return FISH.filter(f => {
      const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase())
      const matchesType = selectedType === 'All' || f.type === selectedType
      return matchesQuery && matchesType
    })
  }, [query, selectedType])

  function handleSelect(fish) {
    setSelectedFish(prev => prev?.id === fish.id ? null : fish)
  }

  function handleSearchChange(e) {
    setQuery(e.target.value)
    setSelectedFish(null)
  }

  return (
    <div className="fishing-guide">
      {/* Search bar */}
      <div className="fish-search-bar">
        <div className="fish-search-wrap">
          <span className="fish-search-icon">🎣</span>
          <input
            className="fish-search-input"
            type="text"
            placeholder="Search for a fish..."
            value={query}
            onChange={handleSearchChange}
          />
          {query && (
            <button className="fish-search-clear" onClick={() => { setQuery(''); setSelectedFish(null) }}>✕</button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="fish-type-filters">
          {FISH_TYPES.map(type => (
            <button
              key={type}
              className={`fish-type-pill${selectedType === type ? ' active' : ''}`}
              onClick={() => { setSelectedType(type); setSelectedFish(null) }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="fish-layout">
        {/* Results list */}
        <div className="fish-results-list">
          {results.length === 0 ? (
            <div className="fish-no-results">No fish found for "{query}"</div>
          ) : (
            results.map(fish => (
              <div
                key={fish.id}
                className={`fish-result-row${selectedFish?.id === fish.id ? ' selected' : ''}`}
                onClick={() => handleSelect(fish)}
              >
                <img src={fish.sprite} alt={fish.name} className="fish-result-sprite" onError={e => { e.target.style.opacity = 0 }} />
                <span className="fish-result-name">{fish.name}</span>
                <span className="fish-result-price">{fish.price}g</span>
                <span className="fish-result-type">{fish.type}</span>
              </div>
            ))
          )}
        </div>

        {/* Fish detail card — desktop sidebar */}
        <div className="fish-detail-panel">
          {selectedFish ? (
            <FishCard fish={selectedFish} />
          ) : (
            <div className="fish-detail-empty">
              <div className="fish-detail-empty-icon">🎣</div>
              <div className="fish-detail-empty-text">Select a fish to see its details</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for mobile only */}
      {isMobile && selectedFish && (
        <div className="detail-modal-overlay" onClick={() => setSelectedFish(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="detail-modal-close" onClick={() => setSelectedFish(null)}>✕</button>
            <FishCard fish={selectedFish} />
          </div>
        </div>
      )}
    </div>
  )
}
