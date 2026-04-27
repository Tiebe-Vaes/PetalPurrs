// Data: customers, orders, tea types, cups, extras

const TEA_TYPES = [
  { id: 'green',    name: 'Green Leaf',  sub: 'light & grassy',   color: '#8fb96b', plant: 'green' },
  { id: 'chamomile',name: 'Chamomile',   sub: 'soft & floral',    color: '#e8d38a', plant: 'chamomile' },
  { id: 'rose',     name: 'Rose Petal',  sub: 'sweet & aromatic', color: '#e89b9b', plant: 'rose' },
  { id: 'lavender', name: 'Lavender',    sub: 'calming',          color: '#c9a3d4', plant: 'lavender' },
  { id: 'matcha',   name: 'Matcha',      sub: 'earthy',           color: '#6b8e4e', plant: 'green' },
  { id: 'hibiscus', name: 'Hibiscus',    sub: 'tart & fruity',    color: '#d97570', plant: 'rose' },
];

const CUPS = [
  { id: 'mug',    name: 'Warm Mug',     shape: 'mug',    color: '#e8b596', ring: '#d48f6c', unlock: 1, price: 4 },
  { id: 'teacup', name: 'Classic Teacup', shape: 'teacup', color: '#fff8ee', ring: '#c9a3d4', unlock: 1, price: 5 },
  { id: 'tall',   name: 'Tall Glass',   shape: 'tall',   color: '#d8ecf5', ring: '#7aa3b5', unlock: 1, price: 5 },
  { id: 'bowl',   name: 'Tea Bowl',     shape: 'bowl',   color: '#a8c4a2', ring: '#7fa079', unlock: 2, price: 6 },
  { id: 'travel', name: 'To-Go',        shape: 'travel', color: '#c9a3d4', ring: '#a57ab0', unlock: 3, price: 7 },
  { id: 'mug-butter', name: 'Butter Mug', shape: 'mug',  color: '#f3d8a8', ring: '#c99e5c', unlock: 2, price: 6 },
  { id: 'rose-cup', name: 'Rose Cup',   shape: 'teacup', color: '#f8d6d6', ring: '#d97570', unlock: 4, price: 8 },
  { id: 'sage-bowl', name: 'Sage Bowl', shape: 'bowl',   color: '#c4dbbe', ring: '#7fa079', unlock: 5, price: 9 },
];

const EXTRAS = [
  { id: 'honey',    name: 'Honey',      price: 1 },
  { id: 'lemon',    name: 'Lemon',      price: 1 },
  { id: 'milk',     name: 'Milk',       price: 1 },
  { id: 'sugar',    name: 'Sugar Cube', price: 1 },
  { id: 'mint',     name: 'Fresh Mint', price: 1 },
  { id: 'biscuit',  name: 'Biscuit',    price: 2 },
  { id: 'cream',    name: 'Whipped',    price: 1 },
  { id: 'cinnamon', name: 'Cinnamon',   price: 1 },
];

const CAT_NAMES = ['Mochi','Biscuit','Clover','Pip','Juniper','Saffron','Miso','Hazel','Olive','Dandelion','Maple','Basil'];
const CAT_COLORS = [
  { body: '#e8b596', accent: '#d48f6c' },
  { body: '#d4a874', accent: '#a67f4c' },
  { body: '#f3d8a8', accent: '#d4a874' },
  { body: '#c8b5a2', accent: '#8a6f5a' },
  { body: '#fff0e0', accent: '#c8b5a2' },
  { body: '#c9a3d4', accent: '#a57ab0' },
  { body: '#a8c4a2', accent: '#7fa079' },
];

// Random integer in [min, max] inclusive
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeOrder(i, level = 5) {
  const name = CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)];
  const color = CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)];
  const tea = TEA_TYPES[Math.floor(Math.random() * Math.min(TEA_TYPES.length, 3 + Math.floor(level/2)))];
  const availCups = CUPS.filter(c => c.unlock <= level);
  const cup = availCups[Math.floor(Math.random() * availCups.length)];
  // Exact temperature target — multiples of 5 for clean comparison
  const tempExact = randInt(2, 19) * 5; // 10..95
  const temp = tempExact < 35 ? 'iced' : tempExact < 65 ? 'warm' : 'hot';
  const extrasPool = [...EXTRAS];
  const extras = [];
  const nExtras = randInt(0, 2);
  for (let x = 0; x < nExtras; x++) {
    const idx = Math.floor(Math.random() * extrasPool.length);
    extras.push(extrasPool.splice(idx, 1)[0].id);
  }
  const tip = randInt(1, 3);
  const moods = [
    `Something ${temp} with ${tea.name.toLowerCase()}, please! ✨`,
    `I'd love a ${tea.name} in a ${cup.name.toLowerCase()}.`,
    `Rough day... could I get a ${temp} ${tea.name.toLowerCase()}?`,
    `${temp === 'iced' ? 'Iced' : temp === 'warm' ? 'Warm' : 'Hot'} ${tea.name}, if you don't mind.`,
    `Today feels like a ${tea.name.toLowerCase()} kind of day.`,
  ];
  return {
    id: `o-${Date.now()}-${i}-${Math.random().toString(36).slice(2,5)}`,
    num: i + 1,
    catName: name,
    catColor: color,
    tea: tea.id,
    cup: cup.id,
    temp,
    tempExact,
    extras,
    tip,
    bubble: moods[Math.floor(Math.random() * moods.length)],
    done: false,
    rating: null, // null until served
  };
}

Object.assign(window, { TEA_TYPES, CUPS, EXTRAS, CAT_NAMES, CAT_COLORS, makeOrder, randInt });
