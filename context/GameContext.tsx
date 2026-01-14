import React, { createContext, useContext, useEffect, useState } from 'react';
import { Player, Quest, InventoryItem, Stats, Rank, Exercise, WorkoutPlan, HistoryEntry, DungeonLog } from '../types';
import { calculateXpRequired, getRankFromLevel, INITIAL_QUESTS, GACHA_ITEMS, DEFAULT_EXERCISES } from '../constants';

interface GameContextType {
  player: Player;
  quests: Quest[];
  inventory: InventoryItem[];
  exercises: Exercise[];
  workoutPlans: WorkoutPlan[];
  notifications: string[];
  completeQuest: (id: string) => void;
  removeQuest: (id: string) => void;
  addXp: (amount: number) => void;
  investStat: (stat: keyof Stats) => void;
  gachaPull: (amount: number, useEssence?: boolean) => { items: InventoryItem[], duplicates: number };
  addNotification: (msg: string) => void;
  addCustomQuest: (title: string, description: string) => void;
  addExercise: (name: string, muscleTarget: string) => void;
  addWorkoutPlan: (name: string, exerciseIds: string[]) => void;
  equipItem: (itemId: string) => void;
  updateProfile: (name: string, avatar: string) => void;
  saveDungeonLog: (log: DungeonLog) => void;
  updateDungeonLog: (log: DungeonLog) => void;
}

const defaultStats: Stats = {
  strength: 10,
  agility: 10,
  vitality: 10,
  intelligence: 10,
  perception: 10,
};

const defaultPlayer: Player = {
  username: 'Player',
  avatar: 'default',
  rank: 'E',
  level: 1,
  xp: 0,
  xpToNextLevel: calculateXpRequired(1),
  gold: 0,
  essenceStones: 3, 
  stats: defaultStats,
  statPointsAvailable: 0,
  equippedItemId: null,
  history: [],
  dungeonLogs: [],
  lastLoginDate: new Date().toDateString(),
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player>(() => {
    const saved = localStorage.getItem('arise_player');
    return saved ? JSON.parse(saved) : defaultPlayer;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('arise_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('arise_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('arise_exercises');
    return saved ? JSON.parse(saved) : DEFAULT_EXERCISES;
  });

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    const saved = localStorage.getItem('arise_workout_plans');
    return saved ? JSON.parse(saved) : [{ id: 'default-full', name: 'Standard Raid', exerciseIds: DEFAULT_EXERCISES.map(e => e.id) }];
  });

  const [notifications, setNotifications] = useState<string[]>([]);

  // Daily Reset Logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (player.lastLoginDate !== today) {
      // It's a new day!
      setQuests(prev => prev.map(q => ({ ...q, completed: false })));
      setPlayer(prev => ({ ...prev, lastLoginDate: today }));
      addNotification("SYSTEM NOTICE: Daily Quests have been reset.");
    }
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem('arise_player', JSON.stringify(player)); }, [player]);
  useEffect(() => { localStorage.setItem('arise_quests', JSON.stringify(quests)); }, [quests]);
  useEffect(() => { localStorage.setItem('arise_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('arise_exercises', JSON.stringify(exercises)); }, [exercises]);
  useEffect(() => { localStorage.setItem('arise_workout_plans', JSON.stringify(workoutPlans)); }, [workoutPlans]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== msg));
    }, 3000);
  };

  const updateHistory = (xpAdded: number, questCompleted: boolean) => {
    const today = new Date().toDateString();
    setPlayer(prev => {
      const historyIndex = prev.history.findIndex(h => h.date === today);
      let newHistory = [...prev.history];

      if (historyIndex >= 0) {
        newHistory[historyIndex] = {
          ...newHistory[historyIndex],
          xpGained: newHistory[historyIndex].xpGained + xpAdded,
          questsCompleted: questCompleted ? newHistory[historyIndex].questsCompleted + 1 : newHistory[historyIndex].questsCompleted,
          totalQuestsAvailable: quests.length // Keep updated
        };
      } else {
        newHistory.push({
          date: today,
          xpGained: xpAdded,
          questsCompleted: questCompleted ? 1 : 0,
          totalQuestsAvailable: quests.length
        });
      }
      return { ...prev, history: newHistory };
    });
  };

  const addXp = (amount: number) => {
    updateHistory(amount, false);

    setPlayer(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newPoints = prev.statPointsAvailable;
      let newEssence = prev.essenceStones;
      let nextReq = prev.xpToNextLevel;
      let leveledUp = false;

      while (newXp >= nextReq) {
        newXp -= nextReq;
        newLevel++;
        newPoints += 3;
        
        // Essence Stone every 5 levels
        if (newLevel % 5 === 0) {
            newEssence += 1;
            addNotification("BONUS: Acquired 1 Essence Stone.");
        }

        nextReq = calculateXpRequired(newLevel);
        leveledUp = true;
      }

      if (leveledUp) {
        addNotification(`LEVEL UP! You are now Level ${newLevel}`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        rank: getRankFromLevel(newLevel),
        statPointsAvailable: newPoints,
        xpToNextLevel: nextReq,
        essenceStones: newEssence,
      };
    });
  };

  const completeQuest = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        addXp(q.xpReward);
        updateHistory(0, true); // Track quest completion specifically
        setPlayer(p => ({ ...p, gold: p.gold + q.goldReward }));
        addNotification(`Quest Complete: ${q.title}`);
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const removeQuest = (id: string) => {
    if (id === 'daily-force') {
      addNotification("SYSTEM ERROR: Cannot delete Mandatory System Quest.");
      return;
    }
    setQuests(prev => prev.filter(q => q.id !== id));
    addNotification("Quest removed from log.");
  };

  const addCustomQuest = (title: string, description: string) => {
    const newQuest: Quest = {
      id: `custom-${Date.now()}`,
      title,
      description,
      xpReward: 10,
      goldReward: 5,
      completed: false,
      type: 'NORMAL',
    };
    setQuests(prev => [...prev, newQuest]);
    addNotification('New Habit Created');
  };

  const addExercise = (name: string, muscleTarget: string) => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name,
      dungeonName: `Shadow ${name}`,
      muscleTarget,
    };
    setExercises(prev => [...prev, newExercise]);
    addNotification('New Technique Added to Database');
  };

  const addWorkoutPlan = (name: string, exerciseIds: string[]) => {
    const newPlan: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      name,
      exerciseIds,
    };
    setWorkoutPlans(prev => [...prev, newPlan]);
    addNotification('New Raid Plan Configured');
  };

  const investStat = (stat: keyof Stats) => {
    if (player.statPointsAvailable > 0) {
      setPlayer(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: prev.stats[stat] + 1
        },
        statPointsAvailable: prev.statPointsAvailable - 1
      }));
    }
  };

  const equipItem = (itemId: string) => {
    setPlayer(prev => {
        // Toggle logic: If clicking already equipped item, unequip it
        if (prev.equippedItemId === itemId) {
             addNotification("Item Unequipped.");
            return { ...prev, equippedItemId: null };
        }
        addNotification("Item Equipped.");
        return { ...prev, equippedItemId: itemId };
    });
  };

  const updateProfile = (name: string, avatar: string) => {
    setPlayer(prev => ({
        ...prev,
        username: name,
        avatar: avatar
    }));
    addNotification("Profile Updated.");
  };

  const saveDungeonLog = (log: DungeonLog) => {
    setPlayer(prev => ({
      ...prev,
      dungeonLogs: [log, ...prev.dungeonLogs] // Newest first
    }));
  };

  const updateDungeonLog = (updatedLog: DungeonLog) => {
    setPlayer(prev => ({
      ...prev,
      dungeonLogs: prev.dungeonLogs.map(log => log.id === updatedLog.id ? updatedLog : log)
    }));
    addNotification("Archives Updated.");
  };

  const gachaPull = (amount: number, useEssence: boolean = false): { items: InventoryItem[], duplicates: number } => {
    const cost = useEssence ? amount * 1 : amount * 100; // 1 Essence or 100 Gold per pull
    
    if (useEssence) {
      if (player.essenceStones < cost) {
        addNotification("Not enough Essence Stones!");
        return { items: [], duplicates: 0 };
      }
      setPlayer(prev => ({ ...prev, essenceStones: prev.essenceStones - cost }));
    } else {
      if (player.gold < cost) {
        addNotification("Not enough Gold!");
        return { items: [], duplicates: 0 };
      }
      setPlayer(prev => ({ ...prev, gold: prev.gold - cost }));
    }

    const newItems: InventoryItem[] = [];
    let duplicateCount = 0;
    let duplicateXp = 0;

    for (let i = 0; i < amount; i++) {
      const rand = Math.random();
      let rarity = 'Common';
      
      if (useEssence) {
        // Essence Box Rates (Better)
        if (rand > 0.98) rarity = 'Mythic';        // 2%
        else if (rand > 0.85) rarity = 'Legendary'; // 13%
        else if (rand > 0.50) rarity = 'Rare';      // 35%
        else rarity = 'Uncommon';                   // 50%
      } else {
        // Gold Box Rates (Standard)
        if (rand > 0.99) rarity = 'Mythic';         // 1%
        else if (rand > 0.95) rarity = 'Legendary'; // 4%
        else if (rand > 0.85) rarity = 'Rare';      // 10%
        else if (rand > 0.60) rarity = 'Uncommon';  // 25%
        else rarity = 'Common';                     // 60%
      }

      const pool = GACHA_ITEMS.filter(item => item.rarity === rarity);
      // Fallback if pool is empty
      const baseItem = pool[Math.floor(Math.random() * pool.length)] || GACHA_ITEMS[0];

      // DUPLICATE CHECK
      // Check if we already have an item where the id STARTS with the base ID (e.g. 'skin-rusty')
      const isDuplicate = inventory.some(invItem => invItem.id.startsWith(baseItem.id)) || newItems.some(n => n.id.startsWith(baseItem.id));

      if (isDuplicate) {
          duplicateCount++;
          duplicateXp += 50;
      } else {
          newItems.push({ ...baseItem, id: `${baseItem.id}-${Date.now()}-${i}` }); 
      }
    }

    if (newItems.length > 0) {
        setInventory(prev => [...prev, ...newItems]);
    }

    if (duplicateCount > 0) {
        addXp(duplicateXp);
        addNotification(`Converted ${duplicateCount} duplicates to ${duplicateXp} XP`);
    }

    return { items: newItems, duplicates: duplicateCount };
  };

  return (
    <GameContext.Provider value={{
      player,
      quests,
      inventory,
      exercises,
      workoutPlans,
      notifications,
      completeQuest,
      removeQuest,
      addXp,
      investStat,
      gachaPull,
      addNotification,
      addCustomQuest,
      addExercise,
      addWorkoutPlan,
      equipItem,
      updateProfile,
      saveDungeonLog,
      updateDungeonLog
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
