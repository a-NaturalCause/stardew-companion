import { createWriteStream, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'

const OUT_DIR = './public/sprites'
mkdirSync(OUT_DIR, { recursive: true })

// All unique item names we need sprites for
const ITEMS = [
  'Daffodil', 'Leek', 'Dandelion', 'Parsnip', 'Grape', 'Spice_Berry', 'Sweet_Pea',
  'Common_Mushroom', 'Wild_Plum', 'Hazelnut', 'Blackberry',
  'Winter_Root', 'Crystal_Fruit', 'Snow_Yam', 'Crocus', 'Holly',
  'Wood', 'Stone', 'Hardwood',
  'Coconut', 'Cactus_Fruit', 'Cave_Carrot', 'Red_Mushroom', 'Purple_Mushroom',
  'Maple_Syrup', 'Oak_Resin', 'Pine_Tar', 'Morel',
  'Green_Bean', 'Cauliflower', 'Potato', 'Tomato', 'Hot_Pepper', 'Blueberry', 'Melon',
  'Corn', 'Eggplant', 'Pumpkin', 'Yam',
  'Large_Milk', 'Large_Egg', 'Large_Goat_Milk', 'Wool', 'Duck_Egg',
  'Truffle_Oil', 'Cloth', 'Goat_Cheese', 'Cheese', 'Honey', 'Jelly',
  'Apple', 'Apricot', 'Orange', 'Peach', 'Pomegranate', 'Cherry',
  'Sunfish', 'Catfish', 'Shad', 'Tiger_Trout',
  'Largemouth_Bass', 'Carp', 'Bullhead', 'Sturgeon',
  'Sardine', 'Tuna', 'Red_Snapper', 'Tilapia',
  'Walleye', 'Bream', 'Eel',
  'Lobster', 'Crayfish', 'Crab', 'Cockle', 'Mussel', 'Shrimp', 'Snail', 'Periwinkle', 'Oyster', 'Clam',
  'Pufferfish', 'Ghostfish', 'Sandfish', 'Woodskip',
  'Copper_Bar', 'Iron_Bar', 'Gold_Bar',
  'Quartz', 'Earth_Crystal', 'Frozen_Tear', 'Fire_Quartz',
  'Slime', 'Bat_Wing', 'Solar_Essence', 'Void_Essence',
  'Fiddlehead_Fern', 'Truffle', 'Poppy', 'Maki_Roll', 'Fried_Egg',
  'Sea_Urchin', 'Sunflower', 'Duck_Feather', 'Aquamarine', 'Red_Cabbage',
  'Nautilus_Shell', 'Chub', 'Frozen_Geode',
  'Wheat', 'Hay',
  'Wine', "Rabbit's_Foot",
  'Money',
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

for (const item of ITEMS) {
  const filename = item
  const destPath = path.join(OUT_DIR, `${filename}.png`)
  try {
    const wikiUrl = await getWikiImageUrl(filename)
    if (!wikiUrl) {
      console.warn(`⚠ No URL found for: ${filename}`)
      fail++
      continue
    }
    await downloadFile(wikiUrl, destPath)
    console.log(`✓ ${filename}`)
    success++
  } catch (err) {
    console.warn(`✗ ${filename}: ${err.message}`)
    fail++
  }
  // Small delay to be polite to the wiki server
  await new Promise(r => setTimeout(r, 150))
}

console.log(`\nDone: ${success} downloaded, ${fail} failed`)
