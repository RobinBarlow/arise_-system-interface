
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'National';

export interface Stats {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
  perception: number;
}

export interface HistoryEntry {
  date: string; // ISO Date String YYYY-MM-DD
  xpGained: number;
  questsCompleted: number;
  totalQuestsAvailable: number;
}

export interface LoggedSet {
  id: string;
  exerciseName: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface DungeonLog {
  id: string;
  date: number; // Timestamp
  planName: string;
  sets: LoggedSet[];
  totalVolume: number;
  xpEarned: number;
}

export interface Player {
  username: string;
  avatar?: string; // URL or ID for the profile picture
  rank: Rank;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  essenceStones: number;
  stats: Stats;
  statPointsAvailable: number;
  equippedItemId: string | null; // ID of the equipped inventory item
  history: HistoryEntry[];
  dungeonLogs: DungeonLog[]; // Detailed workout history
  lastLoginDate: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  type: 'DAILY' | 'NORMAL' | 'URGENT' | 'HIDDEN';
  penalty?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Elite' | 'Legendary' | 'Mythic';
  description: string;
  type: 'SKIN' | 'BUFF' | 'ITEM';
  image?: string;
}

export interface Exercise {
  id: string;
  name: string;
  dungeonName: string; // Lore name
  muscleTarget: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exerciseIds: string[];
}
