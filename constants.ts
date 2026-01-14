import { Rank, InventoryItem, Exercise } from './types';

// Based on the spec: XP = 100 * L^1.5 + 25L
export const calculateXpRequired = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5) + (25 * level));
};

export const INITIAL_QUESTS = [
  {
    id: 'daily-force',
    title: 'PREPARE TO BECOME POWERFUL',
    description: '20 Push-ups, 20 Sit-ups, 20 Squats, 2km Run',
    xpReward: 100,
    goldReward: 50,
    completed: false,
    type: 'DAILY' as const,
    penalty: true,
  },
  {
    id: 'habit-read',
    title: 'Mental Sharpening',
    description: 'Read 20 pages of a book',
    xpReward: 20,
    goldReward: 10,
    completed: false,
    type: 'NORMAL' as const,
  },
  {
    id: 'habit-water',
    title: 'Elixir Consumption',
    description: 'Drink 3L of water',
    xpReward: 15,
    goldReward: 5,
    completed: false,
    type: 'NORMAL' as const,
  }
];

export const GACHA_ITEMS: InventoryItem[] = [
  // --- COMMON (10) ---
  { id: 'skin-rusty', name: 'Rusty Iron', rarity: 'Common', type: 'SKIN', description: 'A matte, reddish-brown iron finish.' },
  { id: 'skin-stone', name: 'Old Stone', rarity: 'Common', type: 'SKIN', description: 'Weathered grey stone texture.' },
  { id: 'skin-wood', name: 'Faded Wood', rarity: 'Common', type: 'SKIN', description: 'Beige, worn wooden look.' },
  { id: 'skin-copper', name: 'Dull Copper', rarity: 'Common', type: 'SKIN', description: 'Non-reflective dark orange.' },
  { id: 'skin-dustblue', name: 'Dusty Blue', rarity: 'Common', type: 'SKIN', description: 'Desaturated blue matte.' },
  { id: 'skin-olive', name: 'Drab Olive', rarity: 'Common', type: 'SKIN', description: 'Dark, dirty green.' },
  { id: 'skin-slate', name: 'Slate Grey', rarity: 'Common', type: 'SKIN', description: 'Flat dark grey.' },
  { id: 'skin-clay', name: 'Baked Clay', rarity: 'Common', type: 'SKIN', description: 'Earthen brown tone.' },
  { id: 'skin-zinc', name: 'Rough Zinc', rarity: 'Common', type: 'SKIN', description: 'White-grey industrial metal.' },
  { id: 'skin-charcoal', name: 'Charcoal', rarity: 'Common', type: 'SKIN', description: 'Almost black, matte finish.' },

  // --- UNCOMMON (5) ---
  { id: 'skin-emerald', name: 'Polished Emerald', rarity: 'Uncommon', type: 'SKIN', description: 'Deep, saturated green with sharp edges.' },
  { id: 'skin-ruby', name: 'Cut Ruby', rarity: 'Uncommon', type: 'SKIN', description: 'Rich red with a gem-like finish.' },
  { id: 'skin-sapphire', name: 'Deep Sapphire', rarity: 'Uncommon', type: 'SKIN', description: 'Clear, heavy blue.' },
  { id: 'skin-goldmatte', name: 'Solid Gold', rarity: 'Uncommon', type: 'SKIN', description: 'Saturated yellow-gold, no glow.' },
  { id: 'skin-amethyst', name: 'Royal Amethyst', rarity: 'Uncommon', type: 'SKIN', description: 'Strong purple contrast.' },

  // --- RARE (5) ---
  { id: 'skin-cyber', name: 'Cyber Neon', rarity: 'Rare', type: 'SKIN', description: 'Pulsing electric cyan.' },
  { id: 'skin-toxic', name: 'Toxic Glow', rarity: 'Rare', type: 'SKIN', description: 'Radioactive green pulse.' },
  { id: 'skin-magma', name: 'Magma Core', rarity: 'Rare', type: 'SKIN', description: 'Glowing orange heat.' },
  { id: 'skin-arcane', name: 'Arcane Flux', rarity: 'Rare', type: 'SKIN', description: 'Mystic violet energy.' },
  { id: 'skin-holy', name: 'Holy Light', rarity: 'Rare', type: 'SKIN', description: 'Blinding white-yellow glow.' },

  // --- LEGENDARY (3) ---
  { id: 'skin-inferno', name: 'Inferno', rarity: 'Legendary', type: 'SKIN', description: 'Animated flames and rising sparks.' },
  { id: 'skin-glitch', name: 'Void Glitch', rarity: 'Legendary', type: 'SKIN', description: 'Unstable reality distortion.' },
  { id: 'skin-thunder', name: 'Thunderstorm', rarity: 'Legendary', type: 'SKIN', description: 'Cracking green lightning.' },

  // --- MYTHIC (2) ---
  { id: 'skin-blades', name: 'Blade Guardian', rarity: 'Mythic', type: 'SKIN', description: 'Orbiting spirit swords.' },
  { id: 'skin-wings', name: 'Seraphim Wings', rarity: 'Mythic', type: 'SKIN', description: 'Majestic, animated wings of light.' },
];

export const getRankFromLevel = (level: number): Rank => {
  if (level >= 100) return 'S';
  if (level >= 71) return 'A';
  if (level >= 46) return 'B';
  if (level >= 26) return 'C';
  if (level >= 11) return 'D';
  return 'E';
};

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'e1', name: 'Push Up', dungeonName: 'Earth Push', muscleTarget: 'Chest' },
  { id: 'e2', name: 'Squat', dungeonName: 'Titan Stand', muscleTarget: 'Legs' },
  { id: 'e3', name: 'Pull Up', dungeonName: 'Sky Reach', muscleTarget: 'Back' },
  { id: 'e4', name: 'Bench Press', dungeonName: 'Iron Press', muscleTarget: 'Chest' },
  { id: 'e5', name: 'Deadlift', dungeonName: 'Shadow Lift', muscleTarget: 'Back' },
];
