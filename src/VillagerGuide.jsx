import { useState, useMemo, useEffect } from 'react'
import { VILLAGERS, VILLAGER_TYPES } from './data/villagers'
import { useIsMobile } from './useIsMobile'

const SEASON_COLORS = {
  Spring: { bg: '#c8f0a0', text: '#1a5c00', border: '#4a7c2f' },
  Summer: { bg: '#ffe080', text: '#7a4800', border: '#c8900a' },
  Fall:   { bg: '#f4a460', text: '#5c2000', border: '#a0522d' },
  Winter: { bg: '#b8d8f8', text: '#003880', border: '#5b8dd9' },
}

const GIFT_TIERS = [
  { key: 'loved',    label: '♥ Loved',    bg: '#ffe0f0', border: '#e0407a', text: '#800040' },
  { key: 'liked',    label: '★ Liked',    bg: '#fff8c0', border: '#c8a000', text: '#604800' },
  { key: 'disliked', label: '✗ Disliked', bg: '#f0f0f0', border: '#909090', text: '#404040' },
  { key: 'hated',    label: '✕ Hated',    bg: '#ffd8d8', border: '#c03030', text: '#5c0000' },
]

function VillagerCard({ villager }) {
  const sc = SEASON_COLORS[villager.birthday.season]

  return (
    <div className="villager-card">
      {/* Header */}
      <div className="villager-card-header">
        <img
          src={villager.sprite}
          alt={villager.name}
          className="villager-card-portrait"
          onError={e => { e.target.style.opacity = 0 }}
        />
        <div className="villager-card-title-block">
          <h2 className="villager-card-name">{villager.name}</h2>
          <span className="villager-card-address">📍 {villager.address}</span>
          {villager.marriageable && (
            <span className="villager-marriageable-badge">💍 Marriageable</span>
          )}
        </div>
      </div>

      <div className="villager-card-body">
        {/* Description */}
        <div className="villager-desc">{villager.description}</div>

        {/* Birthday */}
        <div className="villager-birthday-row">
          <span className="villager-birthday-label">🎂 Birthday</span>
          <span
            className="villager-birthday-badge"
            style={{ background: sc.bg, color: sc.text, border: `2px solid ${sc.border}` }}
          >
            {villager.birthday.season} {villager.birthday.day}
          </span>
        </div>

        {/* Gift tiers */}
        <div className="villager-gifts-section">
          {GIFT_TIERS.map(tier => {
            const items = villager[tier.key]
            if (!items || items.length === 0) return null
            return (
              <div key={tier.key} className="villager-gift-tier">
                <div
                  className="villager-gift-tier-label"
                  style={{ background: tier.bg, color: tier.text, border: `2px solid ${tier.border}` }}
                >
                  {tier.label}
                </div>
                <div className="villager-gift-list">
                  {items.map(item => (
                    <span
                      key={item}
                      className="villager-gift-tag"
                      style={{ background: tier.bg, color: tier.text, border: `1px solid ${tier.border}` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function VillagerGuide({ linkedVillager = null, onClearLink = null }) {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedVillager, setSelectedVillager] = useState(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (linkedVillager) {
      setSelectedVillager(linkedVillager)
      if (onClearLink) onClearLink()
    }
  }, [linkedVillager]) // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    return VILLAGERS.filter(v => {
      const matchesQuery = v.name.toLowerCase().includes(query.toLowerCase())
      const matchesType =
        selectedType === 'All' ||
        (selectedType === 'Marriageable' && v.marriageable) ||
        (selectedType === 'Non-Marriageable' && !v.marriageable)
      return matchesQuery && matchesType
    })
  }, [query, selectedType])

  function handleSelect(v) {
    setSelectedVillager(prev => prev?.id === v.id ? null : v)
  }

  function handleSearchChange(e) {
    setQuery(e.target.value)
    setSelectedVillager(null)
  }

  return (
    <div className="villager-guide">
      {/* Search bar */}
      <div className="fish-search-bar">
        <div className="fish-search-wrap">
          <span className="fish-search-icon">👥</span>
          <input
            className="fish-search-input"
            type="text"
            placeholder="Search for a villager..."
            value={query}
            onChange={handleSearchChange}
          />
          {query && (
            <button className="fish-search-clear" onClick={() => { setQuery(''); setSelectedVillager(null) }}>✕</button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="fish-type-filters">
          {VILLAGER_TYPES.map(type => (
            <button
              key={type}
              className={`fish-type-pill${selectedType === type ? ' active' : ''}`}
              onClick={() => { setSelectedType(type); setSelectedVillager(null) }}
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
            <div className="fish-no-results">No villagers found for "{query}"</div>
          ) : (
            results.map(v => (
              <div
                key={v.id}
                className={`fish-result-row${selectedVillager?.id === v.id ? ' selected' : ''}`}
                onClick={() => handleSelect(v)}
              >
                <img
                  src={v.sprite}
                  alt={v.name}
                  className="villager-result-portrait"
                  onError={e => { e.target.style.opacity = 0 }}
                />
                <span className="fish-result-name">{v.name}</span>
                <span className="fish-result-type" style={{ fontSize: '7px' }}>
                  {v.birthday.season.slice(0, 3)} {v.birthday.day}
                </span>
                {v.marriageable && <span className="villager-list-heart">💍</span>}
              </div>
            ))
          )}
        </div>

        {/* Villager detail card — desktop sidebar */}
        <div className="fish-detail-panel">
          {selectedVillager ? (
            <VillagerCard villager={selectedVillager} />
          ) : (
            <div className="fish-detail-empty">
              <div className="fish-detail-empty-icon">👥</div>
              <div className="fish-detail-empty-text">Select a villager to see their details</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for mobile only */}
      {isMobile && selectedVillager && (
        <div className="detail-modal-overlay" onClick={() => setSelectedVillager(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="detail-modal-close" onClick={() => setSelectedVillager(null)}>✕</button>
            <VillagerCard villager={selectedVillager} />
          </div>
        </div>
      )}
    </div>
  )
}
