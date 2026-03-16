import { createWriteStream, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'

const OUT_DIR = './public/sprites'
mkdirSync(OUT_DIR, { recursive: true })

// Crop sprites not yet downloaded
const ITEMS = [
  'Kale', 'Garlic', 'Strawberry', 'Rhubarb',
  'Coffee_Bean', 'Hops', 'Radish', 'Starfruit', 'Poppy',
  'Summer_Spangle',
  'Bok_Choy', 'Amaranth', 'Cranberries', 'Artichoke',
  'Sweet_Gem_Berry', 'Beet', 'Ancient_Fruit',
  // also grab these in case they're missing
  'Blueberry', 'Corn', 'Green_Bean',
]

async function getWikiImageUrl(filename) {
  const title = `File:${filename}.png`
  const url = `https://stardewvalleywiki.com/mediawiki/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`
  const res = await fetch(url)
  const data = await res.json()
  const pages = data.query.pages
  const page = Object.values(pages)[0]
  if (page.imageinfo && page.imageinfo[0]) return page.imageinfo[0].url
  return null
}

async function downloadFile(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'StardewApp/1.0 (personal project)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const out = createWriteStream(dest)
  await pipeline(res.body, out)
}

let success = 0, fail = 0

for (const item of ITEMS) {
  const destPath = path.join(OUT_DIR, `${item}.png`)
  try {
    const wikiUrl = await getWikiImageUrl(item)
    if (!wikiUrl) { console.warn(`⚠ No URL: ${item}`); fail++; continue }
    await downloadFile(wikiUrl, destPath)
    console.log(`✓ ${item}`)
    success++
  } catch (err) {
    console.warn(`✗ ${item}: ${err.message}`)
    fail++
  }
  await new Promise(r => setTimeout(r, 150))
}

console.log(`\nDone: ${success} downloaded, ${fail} failed`)
