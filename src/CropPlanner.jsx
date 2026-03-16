import { useState, useMemo } from 'react'
import { CROPS, CROP_SEASONS } from './data/crops'

const DAYS_IN_SEASON = 28
const ALL_SEASONS = ['Spring', 'Summer', 'Fall', 'Winter']

// Total growth days available from plantDay through all of the crop's consecutive seasons
function totalGrowDays(crop, plantDay, season) {
  const seasonIdx = ALL_SEASONS.indexOf(season)
  let days = DAYS_IN_SEASON - plantDay
  let s = seasonIdx + 1
  while (s < ALL_SEASONS.length && crop.seasons.includes(ALL_SEASONS[s])) {
    days += DAYS_IN_SEASON
    s++
  }
  return days
}

const SEASON_STYLES = {
  Spring: { header: '#2d6a1f', accent: '#4a7c2f', bg: '#edf9dc', badge: '#c8f0a0', badgeText: '#1a5c00' },
  Summer: { header: '#8a5c00', accent: '#c8900a', bg: '#fffbe8', badge: '#ffe080', badgeText: '#7a4800' },
  Fall:   { header: '#7a3800', accent: '#a0522d', bg: '#fdf1e4', badge: '#f4a460', badgeText: '#5c2000' },
}

const SORT_OPTIONS = [
  { value: 'profit',    label: 'Profit' },
  { value: 'profitDay', label: 'Profit/Day' },
  { value: 'growDays',  label: 'Grow Days' },
  { value: 'name',      label: 'Name' },
]

function calcHarvests(crop, plantDay, season) {
  const window = totalGrowDays(crop, plantDay, season)
  if (crop.growDays > window) return 0
  if (crop.regrowDays === 0) return 1
  return 1 + Math.floor((window - crop.growDays) / crop.regrowDays)
}

function calcStats(crop, plantDay, season) {
  const harvests = calcHarvests(crop, plantDay, season)
  const revenue  = harvests * crop.sellPrice * crop.harvestQty
  const profit   = revenue - crop.seedPrice
  const window   = totalGrowDays(crop, plantDay, season)
  const daysUsed = harvests === 0 ? 0 : (window + 1)
  const profitPerDay = daysUsed > 0 && profit > 0 ? profit / daysUsed : 0
  return { harvests, revenue, profit, profitPerDay }
}

function GoldIcon() {
  return (
    <img
      src="/sprites/Money.png"
      alt="g"
      style={{ width: 12, height: 12, imageRendering: 'pixelated', verticalAlign: 'middle', display: 'inline-block' }}
    />
  )
}

function CropRow({ crop, plantDay, season }) {
  const { harvests, revenue, profit, profitPerDay } = calcStats(crop, plantDay, season)
  const canPlant = harvests > 0

  // First harvest may fall in a later season for multi-season crops
  let firstHarvestDay = plantDay + crop.growDays
  let firstHarvestSeason = season
  while (firstHarvestDay > DAYS_IN_SEASON) {
    firstHarvestDay -= DAYS_IN_SEASON
    firstHarvestSeason = ALL_SEASONS[ALL_SEASONS.indexOf(firstHarvestSeason) + 1]
  }
  const firstHarvestLabel = firstHarvestSeason === season
    ? `Day ${firstHarvestDay}`
    : `${firstHarvestSeason} ${firstHarvestDay}`

  return (
    <div className={`crop-row${canPlant ? '' : ' crop-row-dim'}`}>
      {/* Sprite + name */}
      <div className="crop-row-identity">
        <img
          src={crop.sprite}
          alt={crop.name}
          className="crop-row-sprite"
          onError={e => { e.target.style.opacity = 0 }}
        />
        <div className="crop-row-name-block">
          <span className="crop-row-name">{crop.name}</span>
          <span className="crop-row-seed">{crop.seedName} · {crop.seedSource}</span>
          {crop.isTrellis && <span className="crop-tag crop-tag-trellis">Trellis</span>}
          {crop.seasons.length > 1 && (
            <span className="crop-tag crop-tag-multi">Multi-Season</span>
          )}
        </div>
      </div>

      {/* Stats */}
      {canPlant ? (
        <>
          <div className="crop-stat-cell">
            <div className="crop-stat-label">Grow Days</div>
            <div className="crop-stat-val">{crop.growDays}d</div>
          </div>
          <div className="crop-stat-cell">
            <div className="crop-stat-label">1st Harvest</div>
            <div className="crop-stat-val">{firstHarvestLabel}</div>
          </div>
          <div className="crop-stat-cell">
            <div className="crop-stat-label">Harvests</div>
            <div className="crop-stat-val">×{harvests}{crop.harvestQty > 1 ? ` (${crop.harvestQty} ea)` : ''}</div>
          </div>
          <div className="crop-stat-cell">
            <div className="crop-stat-label">Seed Cost</div>
            <div className="crop-stat-val crop-cost"><GoldIcon /> {crop.seedPrice}g</div>
          </div>
          <div className="crop-stat-cell">
            <div className="crop-stat-label">Revenue</div>
            <div className="crop-stat-val crop-revenue"><GoldIcon /> {revenue}g</div>
          </div>
          <div className="crop-stat-cell">
            <div className="crop-stat-label">Profit</div>
            <div className={`crop-stat-val ${profit >= 0 ? 'crop-profit-pos' : 'crop-profit-neg'}`}>
              <GoldIcon /> {profit >= 0 ? '+' : ''}{profit}g
            </div>
          </div>
          <div className="crop-stat-cell">
            <div className="crop-stat-label">Per Day</div>
            <div className="crop-stat-val crop-revenue"><GoldIcon /> {profitPerDay.toFixed(1)}g</div>
          </div>
        </>
      ) : (
        <div className="crop-cant-plant">
          ✗ Not enough days — needs {crop.growDays} days to first harvest
        </div>
      )}

      {crop.note && <div className="crop-note">⚠ {crop.note}</div>}
    </div>
  )
}

export default function CropPlanner() {
  const [season, setSeason]   = useState('Spring')
  const [plantDay, setPlantDay] = useState(1)
  const [sortBy, setSortBy]   = useState('profit')
  const [showUnplantable, setShowUnplantable] = useState(false)

  const styles = SEASON_STYLES[season]

  const { plantable, unplantable } = useMemo(() => {
    const seasonal = CROPS.filter(c => c.seasons.includes(season))
    const withStats = seasonal.map(c => ({ crop: c, ...calcStats(c, plantDay, season) }))
    const plant   = withStats.filter(x => x.harvests > 0)
    const unplant = withStats.filter(x => x.harvests === 0)

    const sorter = (a, b) => {
      if (sortBy === 'profit')    return b.profit - a.profit
      if (sortBy === 'profitDay') return b.profitPerDay - a.profitPerDay
      if (sortBy === 'growDays')  return a.crop.growDays - b.crop.growDays
      if (sortBy === 'name')      return a.crop.name.localeCompare(b.crop.name)
      return 0
    }

    return { plantable: plant.sort(sorter), unplantable: unplant }
  }, [season, plantDay, sortBy])

  const daysLeft = DAYS_IN_SEASON - plantDay + 1

  return (
    <div className="crop-planner">
      {/* Controls */}
      <div className="crop-controls" style={{ borderColor: styles.accent }}>
        {/* Season tabs */}
        <div className="crop-season-tabs">
          {CROP_SEASONS.map(s => (
            <button
              key={s}
              className={`crop-season-tab${season === s ? ' active' : ''}`}
              style={season === s ? { background: SEASON_STYLES[s].header, borderColor: SEASON_STYLES[s].accent } : {}}
              onClick={() => setSeason(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Day picker + sort */}
        <div className="crop-control-row">
          <div className="crop-day-picker">
            <label className="crop-control-label">Plant on Day</label>
            <div className="crop-day-input-wrap">
              <input
                type="range"
                min={1}
                max={28}
                value={plantDay}
                onChange={e => setPlantDay(Number(e.target.value))}
                className="crop-day-slider"
                style={{ accentColor: styles.header }}
              />
              <span
                className="crop-day-badge"
                style={{ background: styles.badge, color: styles.badgeText, borderColor: styles.accent }}
              >
                Day {plantDay}
              </span>
              <span className="crop-days-left">({daysLeft} day{daysLeft !== 1 ? 's' : ''} left)</span>
            </div>
          </div>

          <div className="crop-sort-picker">
            <label className="crop-control-label">Sort by</label>
            <div className="crop-sort-pills">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`fish-type-pill${sortBy === opt.value ? ' active' : ''}`}
                  onClick={() => setSortBy(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="crop-results">
        {/* Summary bar */}
        <div className="crop-summary" style={{ background: styles.bg, borderColor: styles.accent }}>
          <span style={{ fontSize: '7px', color: styles.badgeText }}>
            {plantable.length} crop{plantable.length !== 1 ? 's' : ''} can be planted on{' '}
            <strong>{season} Day {plantDay}</strong>
          </span>
        </div>

        {/* Plantable crops */}
        <div className="crop-list">
          {plantable.length === 0 ? (
            <div className="fish-no-results">No crops can be planted this late in the season.</div>
          ) : (
            plantable.map(({ crop }) => (
              <CropRow key={crop.id} crop={crop} plantDay={plantDay} season={season} />
            ))
          )}
        </div>

        {/* Unplantable crops toggle */}
        {unplantable.length > 0 && (
          <div className="crop-unplantable-section">
            <button
              className="crop-unplantable-toggle"
              onClick={() => setShowUnplantable(p => !p)}
            >
              {showUnplantable ? '▾' : '▸'} {unplantable.length} crop{unplantable.length !== 1 ? 's' : ''} can&apos;t be planted this late
            </button>
            {showUnplantable && (
              <div className="crop-list">
                {unplantable.map(({ crop }) => (
                  <CropRow key={crop.id} crop={crop} plantDay={plantDay} season={season} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
