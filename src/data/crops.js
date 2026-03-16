export const CROP_SEASONS = ['Spring', 'Summer', 'Fall']

export const CROPS = [
  // ── SPRING ──────────────────────────────────────────────────
  {
    id: 'parsnip', name: 'Parsnip', sprite: '/sprites/Parsnip.png',
    seasons: ['Spring'], seedName: 'Parsnip Seeds', seedPrice: 20, seedSource: 'Pierre',
    growDays: 4, regrowDays: 0, sellPrice: 35, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'potato', name: 'Potato', sprite: '/sprites/Potato.png',
    seasons: ['Spring'], seedName: 'Potato Seeds', seedPrice: 50, seedSource: 'Pierre',
    growDays: 6, regrowDays: 0, sellPrice: 80, harvestQty: 1, isTrellis: false,
    note: '25% chance for a bonus potato per harvest',
  },
  {
    id: 'cauliflower', name: 'Cauliflower', sprite: '/sprites/Cauliflower.png',
    seasons: ['Spring'], seedName: 'Cauliflower Seeds', seedPrice: 80, seedSource: 'Pierre',
    growDays: 12, regrowDays: 0, sellPrice: 175, harvestQty: 1, isTrellis: false,
    note: 'Can form a giant crop',
  },
  {
    id: 'green_bean', name: 'Green Bean', sprite: '/sprites/Green_Bean.png',
    seasons: ['Spring'], seedName: 'Bean Starter', seedPrice: 60, seedSource: 'Pierre',
    growDays: 10, regrowDays: 3, sellPrice: 40, harvestQty: 1, isTrellis: true, note: '',
  },
  {
    id: 'kale', name: 'Kale', sprite: '/sprites/Kale.png',
    seasons: ['Spring'], seedName: 'Kale Seeds', seedPrice: 70, seedSource: 'Pierre',
    growDays: 6, regrowDays: 0, sellPrice: 110, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'garlic', name: 'Garlic', sprite: '/sprites/Garlic.png',
    seasons: ['Spring'], seedName: 'Garlic Seeds', seedPrice: 40, seedSource: 'Pierre',
    growDays: 4, regrowDays: 0, sellPrice: 60, harvestQty: 1, isTrellis: false, note: 'Available Year 2+',
  },
  {
    id: 'strawberry', name: 'Strawberry', sprite: '/sprites/Strawberry.png',
    seasons: ['Spring'], seedName: 'Strawberry Seeds', seedPrice: 100, seedSource: 'Egg Festival',
    growDays: 8, regrowDays: 4, sellPrice: 120, harvestQty: 1, isTrellis: false,
    note: 'Seeds only available at the Egg Festival (Spring 13)',
  },
  {
    id: 'rhubarb', name: 'Rhubarb', sprite: '/sprites/Rhubarb.png',
    seasons: ['Spring'], seedName: 'Rhubarb Seeds', seedPrice: 100, seedSource: 'Oasis',
    growDays: 13, regrowDays: 0, sellPrice: 220, harvestQty: 1, isTrellis: false, note: 'Seeds from the Desert Oasis',
  },
  {
    id: 'coffee_bean', name: 'Coffee Bean', sprite: '/sprites/Coffee_Bean.png',
    seasons: ['Spring', 'Summer'], seedName: 'Coffee Bean', seedPrice: 2500, seedSource: 'Traveling Cart',
    growDays: 10, regrowDays: 2, sellPrice: 15, harvestQty: 4, isTrellis: false,
    note: 'Yields 4 beans per harvest · 5 beans = 1 cup of Coffee',
  },

  // ── SUMMER ──────────────────────────────────────────────────
  {
    id: 'melon', name: 'Melon', sprite: '/sprites/Melon.png',
    seasons: ['Summer'], seedName: 'Melon Seeds', seedPrice: 80, seedSource: 'Pierre',
    growDays: 12, regrowDays: 0, sellPrice: 250, harvestQty: 1, isTrellis: false, note: 'Can form a giant crop',
  },
  {
    id: 'tomato', name: 'Tomato', sprite: '/sprites/Tomato.png',
    seasons: ['Summer'], seedName: 'Tomato Seeds', seedPrice: 50, seedSource: 'Pierre',
    growDays: 11, regrowDays: 4, sellPrice: 60, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'blueberry', name: 'Blueberry', sprite: '/sprites/Blueberry.png',
    seasons: ['Summer'], seedName: 'Blueberry Seeds', seedPrice: 80, seedSource: 'Pierre',
    growDays: 13, regrowDays: 4, sellPrice: 50, harvestQty: 3, isTrellis: false,
    note: 'Yields 3 blueberries per harvest',
  },
  {
    id: 'hot_pepper', name: 'Hot Pepper', sprite: '/sprites/Hot_Pepper.png',
    seasons: ['Summer'], seedName: 'Pepper Seeds', seedPrice: 40, seedSource: 'Pierre',
    growDays: 5, regrowDays: 3, sellPrice: 40, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'hops', name: 'Hops', sprite: '/sprites/Hops.png',
    seasons: ['Summer'], seedName: 'Hops Starter', seedPrice: 60, seedSource: 'Pierre',
    growDays: 11, regrowDays: 1, sellPrice: 25, harvestQty: 1, isTrellis: true, note: '',
  },
  {
    id: 'radish', name: 'Radish', sprite: '/sprites/Radish.png',
    seasons: ['Summer'], seedName: 'Radish Seeds', seedPrice: 40, seedSource: 'Pierre',
    growDays: 6, regrowDays: 0, sellPrice: 90, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'red_cabbage', name: 'Red Cabbage', sprite: '/sprites/Red_Cabbage.png',
    seasons: ['Summer'], seedName: 'Red Cabbage Seeds', seedPrice: 100, seedSource: 'Pierre',
    growDays: 9, regrowDays: 0, sellPrice: 260, harvestQty: 1, isTrellis: false, note: 'Available Year 2+',
  },
  {
    id: 'starfruit', name: 'Starfruit', sprite: '/sprites/Starfruit.png',
    seasons: ['Summer'], seedName: 'Starfruit Seeds', seedPrice: 400, seedSource: 'Oasis',
    growDays: 13, regrowDays: 0, sellPrice: 750, harvestQty: 1, isTrellis: false,
    note: 'Seeds from the Desert Oasis · Best keg crop',
  },
  {
    id: 'poppy', name: 'Poppy', sprite: '/sprites/Poppy.png',
    seasons: ['Summer'], seedName: 'Poppy Seeds', seedPrice: 100, seedSource: 'Pierre',
    growDays: 7, regrowDays: 0, sellPrice: 140, harvestQty: 1, isTrellis: false, note: '',
  },

  // ── FALL ────────────────────────────────────────────────────
  {
    id: 'pumpkin', name: 'Pumpkin', sprite: '/sprites/Pumpkin.png',
    seasons: ['Fall'], seedName: 'Pumpkin Seeds', seedPrice: 100, seedSource: 'Pierre',
    growDays: 13, regrowDays: 0, sellPrice: 320, harvestQty: 1, isTrellis: false, note: 'Can form a giant crop',
  },
  {
    id: 'yam', name: 'Yam', sprite: '/sprites/Yam.png',
    seasons: ['Fall'], seedName: 'Yam Seeds', seedPrice: 60, seedSource: 'Pierre',
    growDays: 10, regrowDays: 0, sellPrice: 160, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'bok_choy', name: 'Bok Choy', sprite: '/sprites/Bok_Choy.png',
    seasons: ['Fall'], seedName: 'Bok Choy Seeds', seedPrice: 50, seedSource: 'Pierre',
    growDays: 4, regrowDays: 0, sellPrice: 80, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'amaranth', name: 'Amaranth', sprite: '/sprites/Amaranth.png',
    seasons: ['Fall'], seedName: 'Amaranth Seeds', seedPrice: 70, seedSource: 'Pierre',
    growDays: 7, regrowDays: 0, sellPrice: 150, harvestQty: 1, isTrellis: false, note: 'Harvested with Scythe',
  },
  {
    id: 'cranberries', name: 'Cranberries', sprite: '/sprites/Cranberries.png',
    seasons: ['Fall'], seedName: 'Cranberry Seeds', seedPrice: 240, seedSource: 'Pierre',
    growDays: 7, regrowDays: 5, sellPrice: 75, harvestQty: 2, isTrellis: false,
    note: 'Yields 2 cranberries per harvest',
  },
  {
    id: 'eggplant', name: 'Eggplant', sprite: '/sprites/Eggplant.png',
    seasons: ['Fall'], seedName: 'Eggplant Seeds', seedPrice: 20, seedSource: 'Pierre',
    growDays: 5, regrowDays: 5, sellPrice: 60, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'artichoke', name: 'Artichoke', sprite: '/sprites/Artichoke.png',
    seasons: ['Fall'], seedName: 'Artichoke Seeds', seedPrice: 30, seedSource: 'Pierre',
    growDays: 8, regrowDays: 0, sellPrice: 160, harvestQty: 1, isTrellis: false, note: 'Available Year 2+',
  },
  {
    id: 'sweet_gem_berry', name: 'Sweet Gem Berry', sprite: '/sprites/Sweet_Gem_Berry.png',
    seasons: ['Fall'], seedName: 'Rare Seed', seedPrice: 1000, seedSource: 'Traveling Cart',
    growDays: 24, regrowDays: 0, sellPrice: 3000, harvestQty: 1, isTrellis: false,
    note: 'Highest sell price of any crop',
  },
  {
    id: 'beet', name: 'Beet', sprite: '/sprites/Beet.png',
    seasons: ['Fall'], seedName: 'Beet Seeds', seedPrice: 40, seedSource: 'Oasis',
    growDays: 6, regrowDays: 0, sellPrice: 100, harvestQty: 1, isTrellis: false, note: 'Seeds from the Desert Oasis',
  },

  // ── MULTI-SEASON ────────────────────────────────────────────
  {
    id: 'wheat', name: 'Wheat', sprite: '/sprites/Wheat.png',
    seasons: ['Summer', 'Fall'], seedName: 'Wheat Seeds', seedPrice: 10, seedSource: 'Pierre',
    growDays: 4, regrowDays: 0, sellPrice: 25, harvestQty: 1, isTrellis: false,
    note: '40% chance to drop Hay when harvested',
  },
  {
    id: 'corn', name: 'Corn', sprite: '/sprites/Corn.png',
    seasons: ['Summer', 'Fall'], seedName: 'Corn Seeds', seedPrice: 150, seedSource: 'Pierre',
    growDays: 14, regrowDays: 4, sellPrice: 50, harvestQty: 1, isTrellis: false, note: '',
  },
  {
    id: 'sunflower', name: 'Sunflower', sprite: '/sprites/Sunflower.png',
    seasons: ['Summer', 'Fall'], seedName: 'Sunflower Seeds', seedPrice: 200, seedSource: 'Pierre',
    growDays: 8, regrowDays: 0, sellPrice: 80, harvestQty: 1, isTrellis: false,
    note: 'Also drops 0–2 Sunflower Seeds when harvested',
  },
  {
    id: 'grape', name: 'Grape', sprite: '/sprites/Grape.png',
    seasons: ['Fall'], seedName: 'Grape Starter', seedPrice: 60, seedSource: 'Pierre',
    growDays: 10, regrowDays: 3, sellPrice: 80, harvestQty: 1, isTrellis: true, note: '',
  },
  {
    id: 'ancient_fruit', name: 'Ancient Fruit', sprite: '/sprites/Ancient_Fruit.png',
    seasons: ['Spring', 'Summer', 'Fall'], seedName: 'Ancient Seeds', seedPrice: 2000, seedSource: 'Special',
    growDays: 28, regrowDays: 7, sellPrice: 550, harvestQty: 1, isTrellis: false,
    note: 'Grows all 3 seasons · Best Wine crop · Rare seed from artifacts',
  },
]
