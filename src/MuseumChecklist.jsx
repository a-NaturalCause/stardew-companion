import { useState, useEffect, useMemo } from 'react'
import { MUSEUM_ITEMS, MUSEUM_SECTIONS, ARTIFACT_COUNT, MINERAL_COUNT } from './data/museum'

const STORAGE_KEY = 'stardew_museum_progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const TYPE_STYLES = {
  Artifact: { bg: '#f5ead0', border: '#a0522d', accent: '#7a3800', badge: '#f4a460', badgeText: '#5c2000' },
  Mineral:  { bg: '#e8f0ff', border: '#5b8dd9', accent: '#1a3c7a', badge: '#b8d8f8', badgeText: '#003880' },
}

export default function MuseumChecklist() {
  const [donated, setDonated]       = useState(loadProgress)
  const [filter, setFilter]         = useState('All')
  const [query, setQuery]           = useState('')
  const [showArtifacts, setShowArtifacts] = useState(true)
  const [showMinerals, setShowMinerals]   = useState(true)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donated))
  }, [donated])

  function toggleDonated(id) {
    setDonated(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function resetAll() {
    if (window.confirm('Reset all museum progress? This cannot be undone.')) {
      setDonated({})
    }
  }

  const donatedCount   = MUSEUM_ITEMS.filter(i => donated[i.id]).length
  const totalCount     = MUSEUM_ITEMS.length
  const pct            = Math.round((donatedCount / totalCount) * 100)
  const artifactsDone  = MUSEUM_ITEMS.filter(i => i.type === 'Artifact' && donated[i.id]).length
  const mineralsDone   = MUSEUM_ITEMS.filter(i => i.type === 'Mineral'  && donated[i.id]).length

  const filtered = useMemo(() => {
    return MUSEUM_ITEMS.filter(item => {
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Artifacts' && item.type === 'Artifact') ||
        (filter === 'Minerals'  && item.type === 'Mineral') ||
        (filter === 'Missing'   && !donated[item.id])
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [filter, query, donated])

  const filteredArtifacts = filtered.filter(i => i.type === 'Artifact')
  const filteredMinerals  = filtered.filter(i => i.type === 'Mineral')

  return (
    <div className="museum-checklist">
      {/* Overall progress */}
      <div className="overall-progress museum-overall-progress">
        <span className="progress-label">Museum</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-count">{donatedCount}/{totalCount}</span>
      </div>

      {/* Sub-progress pills */}
      <div className="museum-sub-progress">
        <div className="museum-sub-pill" style={{ background: TYPE_STYLES.Artifact.badge, borderColor: TYPE_STYLES.Artifact.border, color: TYPE_STYLES.Artifact.accent }}>
          📜 Artifacts: {artifactsDone}/{ARTIFACT_COUNT}
        </div>
        <div className="museum-sub-pill" style={{ background: TYPE_STYLES.Mineral.badge, borderColor: TYPE_STYLES.Mineral.border, color: TYPE_STYLES.Mineral.accent }}>
          💎 Minerals: {mineralsDone}/{MINERAL_COUNT}
        </div>
        {donatedCount === totalCount && (
          <div className="museum-complete-banner">★ Museum Complete! ★</div>
        )}
      </div>

      {/* Search + filter */}
      <div className="fish-search-bar museum-search-bar">
        <div className="fish-search-wrap">
          <span className="fish-search-icon">🏛</span>
          <input
            className="fish-search-input"
            type="text"
            placeholder="Search artifacts & minerals..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="fish-search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
        <div className="fish-type-filters">
          {MUSEUM_SECTIONS.map(s => (
            <button
              key={s}
              className={`fish-type-pill${filter === s ? ' active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="museum-sections">
        {/* Artifacts */}
        {filteredArtifacts.length > 0 && (
          <div className="museum-section">
            <div
              className="museum-section-header"
              style={{ background: TYPE_STYLES.Artifact.accent, borderColor: TYPE_STYLES.Artifact.border }}
              onClick={() => setShowArtifacts(p => !p)}
            >
              <span className="room-chevron" style={{ transform: showArtifacts ? 'rotate(90deg)' : 'none' }}>▶</span>
              <span className="museum-section-title">📜 Artifacts</span>
              <span className="museum-section-count">
                {MUSEUM_ITEMS.filter(i => i.type === 'Artifact' && donated[i.id]).length}/{ARTIFACT_COUNT}
              </span>
            </div>

            {showArtifacts && (
              <div className="museum-items-grid">
                {filteredArtifacts.map(item => {
                  const isDonated = !!donated[item.id]
                  return (
                    <div
                      key={item.id}
                      className={`museum-item${isDonated ? ' donated' : ''}`}
                      onClick={() => toggleDonated(item.id)}
                    >
                      <div className="museum-item-checkbox">
                        {isDonated && '✓'}
                      </div>
                      <img
                        src={item.sprite}
                        alt={item.name}
                        className="museum-item-sprite"
                        onError={e => { e.target.style.opacity = 0 }}
                      />
                      <div className="museum-item-info">
                        <span className="museum-item-name">{item.name}</span>
                        <span className="museum-item-source">📍 {item.source}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Minerals */}
        {filteredMinerals.length > 0 && (
          <div className="museum-section">
            <div
              className="museum-section-header"
              style={{ background: TYPE_STYLES.Mineral.accent, borderColor: TYPE_STYLES.Mineral.border }}
              onClick={() => setShowMinerals(p => !p)}
            >
              <span className="room-chevron" style={{ transform: showMinerals ? 'rotate(90deg)' : 'none' }}>▶</span>
              <span className="museum-section-title">💎 Minerals</span>
              <span className="museum-section-count">
                {MUSEUM_ITEMS.filter(i => i.type === 'Mineral' && donated[i.id]).length}/{MINERAL_COUNT}
              </span>
            </div>

            {showMinerals && (
              <div className="museum-items-grid">
                {filteredMinerals.map(item => {
                  const isDonated = !!donated[item.id]
                  return (
                    <div
                      key={item.id}
                      className={`museum-item${isDonated ? ' donated' : ''}`}
                      onClick={() => toggleDonated(item.id)}
                    >
                      <div className="museum-item-checkbox">
                        {isDonated && '✓'}
                      </div>
                      <img
                        src={item.sprite}
                        alt={item.name}
                        className="museum-item-sprite"
                        onError={e => { e.target.style.opacity = 0 }}
                      />
                      <div className="museum-item-info">
                        <span className="museum-item-name">{item.name}</span>
                        <span className="museum-item-source">📍 {item.source}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="fish-no-results">No items found for "{query}"</div>
        )}
      </div>

      <button className="reset-btn" onClick={resetAll}>Reset Museum Progress</button>
    </div>
  )
}
