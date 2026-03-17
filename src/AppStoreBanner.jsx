import { useState } from 'react'

// Detect if running inside the native Capacitor app
const isNative = window.Capacitor?.isNativePlatform?.() ?? false

// Update this URL once the app is live on the App Store
const APP_STORE_URL = 'https://apps.apple.com/app/stardew-companion/id000000000'

export default function AppStoreBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (isNative || dismissed) return null

  return (
    <div className="appstore-banner">
      <div className="appstore-banner-left">
        <span className="appstore-banner-star">★</span>
        <div className="appstore-banner-text">
          <span className="appstore-banner-title">Stardew Companion</span>
          <span className="appstore-banner-sub">Get the full app — works offline on iPhone & iPad</span>
        </div>
      </div>
      <div className="appstore-banner-right">
        <a
          className="appstore-badge-btn"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="appstore-badge-svg">
            <rect rx="5" ry="5" width="120" height="40" fill="#000"/>
            <text x="60" y="13" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">Download on the</text>
            <text x="60" y="28" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="sans-serif" fontWeight="bold">App Store</text>
            <text x="14" y="26" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="sans-serif"></text>
          </svg>
        </a>
        <button className="appstore-banner-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">✕</button>
      </div>
    </div>
  )
}
