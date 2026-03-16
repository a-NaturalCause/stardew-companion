import { useState, useEffect } from 'react'
import { ROOMS } from './data/bundles'
import FishingGuide from './FishingGuide'
import VillagerGuide from './VillagerGuide'
import BirthdayCalendar from './BirthdayCalendar'
import CropPlanner from './CropPlanner'
import MuseumChecklist from './MuseumChecklist'
import RecipeTracker from './RecipeTracker'
import HomeScreen from './HomeScreen'
import './index.css'

const STORAGE_KEY = 'stardew_cc_progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const TABS = [
  { id: 'home',             label: '⭐ Home' },
  { id: 'community_center', label: '🏠 Bundles' },
  { id: 'fishing',          label: '🎣 Fishing' },
  { id: 'villagers',        label: '👥 Villagers' },
  { id: 'birthdays',        label: '🎂 Birthdays' },
  { id: 'crops',            label: '🌱 Crops' },
  { id: 'museum',           label: '🏛 Museum' },
  { id: 'recipes',          label: '🍳 Recipes' },
]

function CommunityCenter() {
  const [checked, setChecked] = useState(loadProgress)
  const [openRooms, setOpenRooms] = useState(() =>
    Object.fromEntries(ROOMS.map(r => [r.id, true]))
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
  }, [checked])

  function toggleItem(bundleId, itemId) {
    const key = `${bundleId}__${itemId}`
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleRoom(roomId) {
    setOpenRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }))
  }

  function resetAll() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      setChecked({})
    }
  }

  const allItems = ROOMS.flatMap(r => r.bundles.flatMap(b => b.items.map(i => `${b.id}__${i.id}`)))
  const checkedCount = allItems.filter(k => checked[k]).length
  const totalCount = allItems.length
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  return (
    <>
      <div className="overall-progress">
        <span className="progress-label">Progress</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-count">{checkedCount}/{totalCount}</span>
      </div>

      <main className="app-main">
        {ROOMS.map(room => {
          const roomItems = room.bundles.flatMap(b => b.items.map(i => `${b.id}__${i.id}`))
          const roomChecked = roomItems.filter(k => checked[k]).length
          const roomComplete = roomChecked === roomItems.length
          const isOpen = openRooms[room.id]

          return (
            <div key={room.id} className="room-section">
              <div className="room-header" onClick={() => toggleRoom(room.id)}>
                <span className="room-chevron" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
                <span className="room-title">{room.name}</span>
                <span className={`room-progress-pill${roomComplete ? ' complete' : ''}`}>
                  {roomComplete ? '✓ Done' : `${roomChecked}/${roomItems.length}`}
                </span>
              </div>

              {isOpen && (
                <div className="bundles-grid">
                  {room.bundles.map(bundle => {
                    const bundleChecked = bundle.items.filter(i => checked[`${bundle.id}__${i.id}`]).length
                    const bundleComplete = bundleChecked === bundle.items.length

                    return (
                      <div key={bundle.id} className={`bundle-card${bundleComplete ? ' complete' : ''}`}>
                        <div className="bundle-card-header">
                          <span className="bundle-name">{bundle.name}</span>
                          <span className="bundle-check-count">{bundleChecked}/{bundle.items.length}</span>
                        </div>
                        <div className="bundle-reward">
                          Reward: <span>{bundle.reward}</span>
                        </div>
                        <div className="items-list">
                          {bundle.items.map(item => {
                            const key = `${bundle.id}__${item.id}`
                            const isChecked = !!checked[key]
                            return (
                              <div
                                key={item.id}
                                className={`item-row${isChecked ? ' checked' : ''}`}
                                onClick={() => toggleItem(bundle.id, item.id)}
                              >
                                <div className="item-checkbox">
                                  {isChecked && '✓'}
                                </div>
                                <img
                                  className="item-sprite"
                                  src={item.sprite}
                                  alt={item.name}
                                  onError={e => { e.target.style.display = 'none' }}
                                />
                                <span className="item-name">{item.name}</span>
                              </div>
                            )
                          })}
                        </div>
                        {bundleComplete && (
                          <div className="bundle-complete-banner">★ Bundle Complete! ★</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <button className="reset-btn" onClick={resetAll}>Reset All Progress</button>
      </main>
    </>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [linkedVillager, setLinkedVillager] = useState(null)

  function navigateToVillager(villager) {
    setLinkedVillager(villager)
    setActiveTab('villagers')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <header className="app-header">
        <h1>Stardew Valley</h1>
        <div className="subtitle">Companion App</div>
      </header>

      <nav className="app-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'home' && (
        <HomeScreen onNavigate={id => { setActiveTab(id); window.scrollTo({ top: 0 }) }} />
      )}
      {activeTab === 'community_center' && <CommunityCenter />}
      {activeTab === 'fishing' && <FishingGuide />}
      {activeTab === 'villagers' && (
        <VillagerGuide
          linkedVillager={linkedVillager}
          onClearLink={() => setLinkedVillager(null)}
        />
      )}
      {activeTab === 'birthdays' && (
        <BirthdayCalendar onNavigateToVillager={navigateToVillager} />
      )}
      {activeTab === 'crops' && <CropPlanner />}
      {activeTab === 'museum' && <MuseumChecklist />}
      {activeTab === 'recipes' && <RecipeTracker />}
    </div>
  )
}
