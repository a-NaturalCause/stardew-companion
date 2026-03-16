import { createWriteStream, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'

const OUT_DIR = './public/sprites/villagers'
mkdirSync(OUT_DIR, { recursive: true })

// Villager portrait filenames on the Stardew Valley wiki
const VILLAGERS = [
  'Abigail', 'Alex', 'Caroline', 'Clint', 'Demetrius', 'Elliott', 'Emily',
  'Evelyn', 'George', 'Gus', 'Haley', 'Harvey', 'Jodi', 'Kent', 'Krobus',
  'Leah', 'Leo', 'Lewis', 'Linus', 'Marnie', 'Maru', 'Pam', 'Penny',
  'Pierre', 'Robin', 'Sam', 'Sandy', 'Sebastian', 'Shane', 'Willy', 'Wizard',
  'Dwarf',
]

async function getWikiImageUrl(filename) {
  const title = `File:${filename}.png`
  const url = `https://stardewvalleywiki.com/mediawiki/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`
  const res = await fetch(url)
  const data = await res.json()
  const pages = data.query.pages
  const page = Object.values(pages)[0]
  if (page.imageinfo && page.imageinfo[0]) {
    return page.imageinfo[0].url
  }
  return null
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'StardewApp/1.0 (personal project)' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const out = createWriteStream(dest)
  await pipeline(res.body, out)
}

let success = 0
let fail = 0

for (const name of VILLAGERS) {
  const destPath = path.join(OUT_DIR, `${name}.png`)
  try {
    const wikiUrl = await getWikiImageUrl(name)
    if (!wikiUrl) {
      console.warn(`⚠ No URL found for: ${name}`)
      fail++
      continue
    }
    await downloadFile(wikiUrl, destPath)
    console.log(`✓ ${name}`)
    success++
  } catch (err) {
    console.warn(`✗ ${name}: ${err.message}`)
    fail++
  }
  await new Promise(r => setTimeout(r, 150))
}

console.log(`\nDone: ${success} downloaded, ${fail} failed`)
