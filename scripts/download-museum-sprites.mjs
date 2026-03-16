import { createWriteStream, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'

const OUT_DIR = './public/sprites/museum'
mkdirSync(OUT_DIR, { recursive: true })

// Wiki filenames for museum items (artifacts + rare minerals not already in /sprites/)
const ITEMS = [
  // Artifacts
  'Dwarf_Scroll_I', 'Dwarf_Scroll_II', 'Dwarf_Scroll_III', 'Dwarf_Scroll_IV',
  'Chipped_Amphora', 'Arrowhead', 'Ancient_Doll', 'Elvish_Jewelry', 'Chewing_Stick',
  'Ornamental_Fan', 'Dinosaur_Egg', 'Rare_Disc', 'Ancient_Sword', 'Rusty_Spoon',
  'Rusty_Spur', 'Rusty_Cog', 'Chicken_Statue', 'Ancient_Seeds', 'Prehistoric_Tool',
  'Dried_Starfish', 'Anchor', 'Glass_Shards', 'Bone_Flute', 'Prehistoric_Handaxe',
  'Dwarvish_Helm', 'Dwarf_Gadget', 'Ancient_Drum', 'Golden_Mask', 'Golden_Relic',
  'Strange_Doll', 'Strange_Doll_Yellow',
  'Prehistoric_Scapula', 'Prehistoric_Tibia', 'Prehistoric_Skull', 'Skeletal_Hand',
  'Prehistoric_Rib', 'Prehistoric_Vertebra', 'Skeletal_Tail',
  'Nautilus_Fossil', 'Amphibian_Fossil', 'Palm_Fossil', 'Trilobite',
  // Minerals not already in /sprites/
  "Tiger's_Eye", 'Opal', 'Fire_Opal', 'Alamite', 'Bixite', 'Baryte', 'Aerinite',
  'Calcite', 'Dolomite', 'Esperite', 'Fluorapatite', 'Geminite', 'Helvite',
  'Jamborite', 'Jagoite', 'Kyanite', 'Lunarite', 'Malachite', 'Neptunite',
  'Lemon_Stone', 'Nekoite', 'Orpiment', 'Petrified_Slime', 'Thunder_Egg',
  'Pyrite', 'Ocean_Stone', 'Ghost_Crystal', 'Jasper', 'Celestine', 'Marble',
  'Sandstone', 'Granite', 'Basalt', 'Limestone', 'Soapstone', 'Hematite',
  'Mudstone', 'Obsidian', 'Slate', 'Fairy_Stone', 'Star_Shards',
  // Gems that go to /sprites/museum/ for museum use
  'Emerald', 'Ruby', 'Topaz', 'Jade', 'Prismatic_Shard',
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
