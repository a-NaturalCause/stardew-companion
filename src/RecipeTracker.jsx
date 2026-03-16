import { useState, useMemo } from 'react'
import { RECIPES, RECIPE_FILTER_TYPES } from './data/recipes'

const STORAGE_KEY = 'stardew_recipes_learned'

function loadLearned() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const SOURCE_COLORS = {
  default:    { bg: '#e8f5e9', border: '#4caf50', text: '#1b5e20' },
  tv:         { bg: '#e3f2fd', border: '#1976d2', text: '#0d3c75' },
  friendship: { bg: '#fce4ec', border: '#e91e63', text: '#880e4f' },
  event:      { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
  skill:      { bg: '#ede7f6', border: '#7b1fa2', text: '#4a148c' },
}

function SourcePill({ source }) {
  const colors = SOURCE_COLORS[source.type] || SOURCE_COLORS.tv
  return (
    <span
      className="recipe-source-pill"
      style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
    >
      {source.label}
    </span>
  )
}

function RecipeCard({ recipe, learned, onToggle }) {
  const colors = SOURCE_COLORS[recipe.source.type] || SOURCE_COLORS.tv
  return (
    <div className={`recipe-card${learned ? ' recipe-learned' : ''}`}>
      <div className="recipe-card-header" style={{ borderColor: colors.border }}>
        <img
          src={recipe.sprite}
          alt={recipe.name}
          className="recipe-card-icon"
          onError={e => { e.target.style.opacity = 0 }}
        />
        <div className="recipe-card-title-block">
          <h2 className="recipe-card-name">{recipe.name}</h2>
          <SourcePill source={recipe.source} />
        </div>
        <button
          className={`recipe-learn-btn${learned ? ' learned' : ''}`}
          onClick={onToggle}
        >
          {learned ? '✓ Learned' : 'Mark Learned'}
        </button>
      </div>

      <div className="recipe-card-body">
        <div className="recipe-ingredients-label">Ingredients</div>
        <div className="recipe-ingredients-list">
          {recipe.ingredients.map(ing => (
            <span key={ing.item} className="recipe-ingredient-tag">
              {ing.qty > 1 && <span className="recipe-ingredient-qty">{ing.qty}×</span>}
              {ing.item}
            </span>
          ))}
        </div>
        <div className="recipe-sell-price">
          Sells for <span>{recipe.sell}g</span>
        </div>
      </div>
    </div>
  )
}

export default function RecipeTracker() {
  const [learned, setLearned] = useState(loadLearned)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  function toggleLearned(id) {
    setLearned(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const results = useMemo(() => {
    return RECIPES.filter(r => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === 'All' ||
        (filter === 'TV'         && r.source.type === 'tv') ||
        (filter === 'Friendship' && r.source.type === 'friendship') ||
        (filter === 'Skill'      && r.source.type === 'skill') ||
        (filter === 'Default'    && r.source.type === 'default') ||
        (filter === 'Event'      && r.source.type === 'event')
      return matchesQuery && matchesFilter
    })
  }, [query, filter])

  const learnedCount = RECIPES.filter(r => learned[r.id]).length
  const pct = Math.round((learnedCount / RECIPES.length) * 100)

  return (
    <div className="recipe-tracker">
      {/* Progress */}
      <div className="overall-progress">
        <span className="progress-label">Learned</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-count">{learnedCount}/{RECIPES.length}</span>
      </div>

      {/* Search + filter */}
      <div className="fish-search-bar">
        <div className="fish-search-wrap">
          <span className="fish-search-icon">🍳</span>
          <input
            className="fish-search-input"
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(null) }}
          />
          {query && (
            <button className="fish-search-clear" onClick={() => { setQuery(''); setSelected(null) }}>✕</button>
          )}
        </div>
        <div className="fish-type-filters">
          {RECIPE_FILTER_TYPES.map(type => (
            <button
              key={type}
              className={`fish-type-pill${filter === type ? ' active' : ''}`}
              onClick={() => { setFilter(type); setSelected(null) }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="fish-layout">
        {/* Recipe list */}
        <div className="fish-results-list">
          {results.length === 0 ? (
            <div className="fish-no-results">No recipes found for "{query}"</div>
          ) : (
            results.map(r => (
              <div
                key={r.id}
                className={`fish-result-row${selected?.id === r.id ? ' selected' : ''}${learned[r.id] ? ' recipe-row-learned' : ''}`}
                onClick={() => setSelected(prev => prev?.id === r.id ? null : r)}
              >
                <img
                  src={r.sprite}
                  alt={r.name}
                  className="recipe-list-icon"
                  onError={e => { e.target.style.opacity = 0 }}
                />
                <span className="fish-result-name">{r.name}</span>
                <SourcePill source={r.source} />
                {learned[r.id] && <span className="recipe-list-check">✓</span>}
              </div>
            ))
          )}
        </div>

        {/* Detail card — desktop sidebar */}
        <div className="fish-detail-panel">
          {selected ? (
            <RecipeCard
              recipe={selected}
              learned={!!learned[selected.id]}
              onToggle={() => toggleLearned(selected.id)}
            />
          ) : (
            <div className="fish-detail-empty">
              <div className="fish-detail-empty-icon">🍳</div>
              <div className="fish-detail-empty-text">Select a recipe to see details</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for mobile */}
      {selected && (
        <div className="detail-modal-overlay" onClick={() => setSelected(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="detail-modal-close" onClick={() => setSelected(null)}>✕</button>
            <RecipeCard
              recipe={selected}
              learned={!!learned[selected.id]}
              onToggle={() => toggleLearned(selected.id)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
