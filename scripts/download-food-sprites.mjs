import https from 'https'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

const OUT_DIR = 'public/sprites/food'
fs.mkdirSync(OUT_DIR, { recursive: true })

const RECIPES = [
  'Fried_Egg', 'Omelet', 'Baked_Fish', 'Glazed_Yams', 'Pancakes',
  'Plum_Pudding', 'Artichoke_Dip', 'Stir_Fry', 'Radish_Salad', 'Tortilla',
  'Maki_Roll', 'Trout_Soup', 'Chocolate_Cake', 'Pumpkin_Pie', 'Cranberry_Candy',
  'Complete_Breakfast', 'Pizza', 'Lucky_Lunch', 'Hashbrowns', 'Carp_Surprise',
  'Roasted_Hazelnuts', 'Maple_Bar', 'Fiddlehead_Risotto', 'Blackberry_Cobbler',
  'Poppyseed_Muffin', 'Bruschetta', 'Lobster_Bisque', 'Crab_Cakes',
  'Shrimp_Cocktail', 'Bread', 'Fruit_Salad', 'Coleslaw',
  'Salad', 'Cheese_Cauliflower', 'Fried_Calamari', 'Strange_Bun',
  'Fried_Mushroom', 'Salmon_Dinner', 'Crispy_Bass', 'Pepper_Poppers',
  'Spaghetti', 'Fried_Eel', 'Sashimi', 'Algae_Soup', 'Pale_Broth',
  'Blueberry_Tart', 'Rice_Pudding', 'Ice_Cream', 'Chowder', 'Ginger_Ale',
  'Banana_Pudding', 'Mango_Sticky_Rice', 'Poi', 'Tropical_Curry', 'Escargot',
  'Parsnip_Soup', 'Vegetable_Medley', 'Bean_Hotpot', 'Red_Plate', 'Fish_Taco',
  'Eggplant_Parmesan', 'Tom_Kha_Soup', 'Pumpkin_Soup', 'Super_Meal',
  'Cranberry_Sauce', 'Stuffing', 'Fish_Stew', 'Spicy_Eel', 'Rhubarb_Pie',
  "Autumn's_Bounty", 'Cookie', "Farmer's_Lunch", 'Survival_Burger', 'Moss_Soup',
  "Dish_O'_The_Sea", 'Seafoam_Pudding', "Miner's_Treat", 'Roots_Platter',
  'Squid_Ink_Ravioli',
]

async function resolveWikiUrl(filename) {
  const encoded = encodeURIComponent(filename)
  const apiUrl = `https://stardewvalleywiki.com/mediawiki/api.php?action=query&titles=File:${encoded}&prop=imageinfo&iiprop=url&format=json`
  return new Promise((resolve, reject) => {
    https.get(apiUrl, { headers: { 'User-Agent': 'StardewCompanionApp/1.0' } }, res => {
      let body = ''
      res.on('data', d => body += d)
      res.on('end', () => {
        try {
          const data = JSON.parse(body)
          const pages = data.query.pages
          const page = Object.values(pages)[0]
          if (page.imageinfo && page.imageinfo[0]) {
            resolve(page.imageinfo[0].url)
          } else {
            resolve(null)
          }
        } catch (e) {
          resolve(null)
        }
      })
    }).on('error', reject)
  })
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, { headers: { 'User-Agent': 'StardewCompanionApp/1.0' } }, res => {
      if (res.statusCode !== 200) { file.close(); resolve(false); return }
      pipeline(res, file).then(() => resolve(true)).catch(reject)
    }).on('error', reject)
  })
}

async function main() {
  let ok = 0, fail = 0
  for (const name of RECIPES) {
    const dest = path.join(OUT_DIR, `${name}.png`)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      console.log(`skip  ${name}`)
      ok++
      continue
    }
    const url = await resolveWikiUrl(`${name}.png`)
    if (!url) {
      console.error(`MISS  ${name}`)
      fail++
      continue
    }
    const success = await downloadFile(url, dest)
    if (success) {
      console.log(`OK    ${name}`)
      ok++
    } else {
      console.error(`FAIL  ${name}`)
      fail++
    }
    await new Promise(r => setTimeout(r, 120))
  }
  console.log(`\nDone: ${ok} OK, ${fail} failed`)

  // Batch convert palette PNGs
  console.log('\nConverting palette PNGs...')
  const { execSync } = await import('child_process')
  execSync(`for f in ${OUT_DIR}/*.png; do sips -s format png "$f" --out "$f" 2>/dev/null; done`, { shell: '/bin/zsh' })
  console.log('Conversion done.')
}

main().catch(console.error)
