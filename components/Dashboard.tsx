import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { SystemPanel, StatRow, ProgressBar, SystemButton } from './SystemComponents';
import { Database, X, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ProfileFrame } from './ProfileFrame';

export const Dashboard: React.FC = () => {
  const { player, investStat, exercises, addExercise, addWorkoutPlan, inventory } = useGame();
  const [showManager, setShowManager] = useState(false);
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);
  
  // Form states
  const [exName, setExName] = useState('');
  const [exTarget, setExTarget] = useState('Chest');
  const [planName, setPlanName] = useState('');
  const [selectedExIds, setSelectedExIds] = useState<string[]>([]);

  // Derived state for Profile Frame
  const equippedItem = useMemo(() => 
    inventory.find(i => i.id === player.equippedItemId), 
  [inventory, player.equippedItemId]);

  const getRankColor = (rank: string) => {
    if (rank === 'S') return 'text-sys-purple shadow-neon-strong';
    if (rank === 'A') return 'text-sys-crimson';
    if (rank === 'B') return 'text-sys-blue';
    return 'text-gray-400';
  };

  // Prepare Chart Data from Player History
  const chartData = useMemo(() => {
    // Fill last 7 days even if empty
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const historyEntry = player.history.find(h => h.date === dateStr);
      data.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        xp: historyEntry ? historyEntry.xpGained : 0,
        fullDate: dateStr
      });
    }
    return data;
  }, [player.history]);

  const calculateStats = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const relevantHistory = player.history.filter(h => new Date(h.date) >= cutoff);
    
    const totalXP = relevantHistory.reduce((acc, h) => acc + h.xpGained, 0);
    const totalQuestsDone = relevantHistory.reduce((acc, h) => acc + h.questsCompleted, 0);
    // Approximate total available based on average or current
    const totalQuestsPossible = relevantHistory.reduce((acc, h) => acc + (h.totalQuestsAvailable || 5), 0);
    
    const completionRate = totalQuestsPossible > 0 
      ? Math.round((totalQuestsDone / totalQuestsPossible) * 100) 
      : 0;

    return { totalXP, completionRate };
  };

  const weekStats = calculateStats(7);
  const monthStats = calculateStats(30);
  const allTimeStats = calculateStats(3650); // "All time"

  const handleCreateExercise = () => {
    if (exName.trim()) {
      addExercise(exName, exTarget);
      setExName('');
    }
  };

  const handleCreatePlan = () => {
    if (planName.trim() && selectedExIds.length > 0) {
      addWorkoutPlan(planName, selectedExIds);
      setPlanName('');
      setSelectedExIds([]);
    }
  };

  const toggleExerciseSelection = (id: string) => {
    setSelectedExIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      
      {/* Detailed History Modal */}
      {showHistoryDetail && (
        <div className="fixed inset-0 z-50 bg-sys-black/95 flex items-center justify-center p-4">
           <div className="w-full max-w-md bg-sys-void border border-sys-blue p-6 relative shadow-neon">
             <button onClick={() => setShowHistoryDetail(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
               <X size={24} />
             </button>
             <h2 className="text-2xl font-bold uppercase text-sys-blue mb-6 tracking-widest border-b border-sys-blue/30 pb-2">
               Hunter Archives
             </h2>
             
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-sys-black p-3 border-l-2 border-sys-blue">
                      <div className="text-xs text-gray-400 uppercase">This Week</div>
                      <div className="text-xl font-orbitron text-white">{weekStats.completionRate}% <span className="text-xs text-gray-500">Completion</span></div>
                      <div className="text-sm text-sys-blue">+{weekStats.totalXP} XP</div>
                   </div>
                   <div className="bg-sys-black p-3 border-l-2 border-sys-purple">
                      <div className="text-xs text-gray-400 uppercase">This Month</div>
                      <div className="text-xl font-orbitron text-white">{monthStats.completionRate}% <span className="text-xs text-gray-500">Completion</span></div>
                      <div className="text-sm text-sys-purple">+{monthStats.totalXP} XP</div>
                   </div>
                   <div className="col-span-2 bg-sys-black p-3 border-l-2 border-sys-gold">
                      <div className="text-xs text-gray-400 uppercase">All Time</div>
                      <div className="text-xl font-orbitron text-white">{allTimeStats.completionRate}% <span className="text-xs text-gray-500">Completion</span></div>
                      <div className="text-sm text-sys-gold">Total XP: {allTimeStats.totalXP}</div>
                   </div>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Header Profile */}
      <div className="flex items-start justify-between gap-6 pl-4">
        <div className="relative group cursor-pointer mt-4" onClick={() => setShowManager(true)}> 
          {/* RENDER THE COMPLEX FRAME HERE */}
          <ProfileFrame item={equippedItem} avatar={player.avatar} size="lg" />
          
          <div className="absolute -bottom-3 -right-3 bg-sys-void border border-sys-blue px-2 py-0.5 text-xs text-sys-blue font-bold z-20">
            LVL.{player.level}
          </div>
        </div>
        
        <div className="flex-1 space-y-2 mt-2">
          <div className="flex justify-between items-baseline">
            <h1 className="text-2xl font-bold uppercase tracking-widest">{player.username}</h1>
            <span className={`text-3xl font-orbitron font-bold ${getRankColor(player.rank)}`}>
              Rank {player.rank}
            </span>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-sys-blue uppercase mb-1">
              <span>Experience</span>
              <span>{player.xp} / {player.xpToNextLevel}</span>
            </div>
            <ProgressBar current={player.xp} max={player.xpToNextLevel} />
          </div>

          <div className="flex gap-4 text-xs text-gray-400 mt-2">
            <span className="flex items-center gap-1 text-sys-gold">
              <span className="w-2 h-2 rounded-full bg-sys-gold animate-pulse"></span>
              {player.gold} GOLD
            </span>
            <span className="flex items-center gap-1 text-sys-purple">
               <span className="w-2 h-2 rounded-full bg-sys-purple"></span>
              {player.essenceStones} ESSENCE
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <SystemPanel title="Status">
          <div className="space-y-1">
            <StatRow 
              label="STRENGTH" 
              value={player.stats.strength} 
              canIncrease={player.statPointsAvailable > 0} 
              onIncrease={() => investStat('strength')}
            />
            <StatRow 
              label="AGILITY" 
              value={player.stats.agility} 
              canIncrease={player.statPointsAvailable > 0} 
              onIncrease={() => investStat('agility')}
            />
            <StatRow 
              label="VITALITY" 
              value={player.stats.vitality} 
              canIncrease={player.statPointsAvailable > 0} 
              onIncrease={() => investStat('vitality')}
            />
            <StatRow 
              label="INTELLIGENCE" 
              value={player.stats.intelligence} 
              canIncrease={player.statPointsAvailable > 0} 
              onIncrease={() => investStat('intelligence')}
            />
            <StatRow 
              label="PERCEPTION" 
              value={player.stats.perception} 
              canIncrease={player.statPointsAvailable > 0} 
              onIncrease={() => investStat('perception')}
            />
          </div>
          {player.statPointsAvailable > 0 && (
            <div className="mt-4 text-center text-sys-gold animate-pulse font-bold text-sm border border-sys-gold/30 p-1">
              {player.statPointsAvailable} POINTS AVAILABLE
            </div>
          )}
        </SystemPanel>

        <SystemPanel title="Activity Log" className="cursor-pointer hover:border-sys-neon transition-colors" >
           <div className="h-48 w-full" onClick={() => setShowHistoryDetail(true)}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b45d7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1b45d7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#555" tick={{fontSize: 10}} />
                <YAxis stroke="#555" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a1543', borderColor: '#1b45d7', color: '#fff' }}
                  itemStyle={{ color: '#445EF2' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#1b45d7" fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </SystemPanel>
      </div>

      <div className="border-t border-sys-blue/30 pt-4">
        <SystemButton onClick={() => setShowManager(!showManager)} className="w-full flex justify-center items-center gap-2">
           <Database size={16}/> SYSTEM DATABASE / TRAINING CONFIG
        </SystemButton>
        
        {showManager && (
          <div className="mt-4 space-y-4 animate-fade-in-up">
            <SystemPanel title="New Technique (Exercise)">
              <div className="flex gap-2 mb-2">
                <input 
                   placeholder="Exercise Name" 
                   value={exName}
                   onChange={e => setExName(e.target.value)}
                   className="flex-1 bg-sys-black border border-sys-blue/30 p-2 text-sm text-white"
                />
                <select 
                   value={exTarget}
                   onChange={e => setExTarget(e.target.value)}
                   className="bg-sys-black border border-sys-blue/30 p-2 text-sm text-white"
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Legs">Legs</option>
                  <option value="Arms">Arms</option>
                </select>
              </div>
              <SystemButton onClick={handleCreateExercise} className="text-xs w-full">Add To Database</SystemButton>
            </SystemPanel>

            <SystemPanel title="New Raid Plan (Workout)">
               <input 
                   placeholder="Plan Name (e.g. S-Rank Leg Day)" 
                   value={planName}
                   onChange={e => setPlanName(e.target.value)}
                   className="w-full bg-sys-black border border-sys-blue/30 p-2 text-sm text-white mb-2"
                />
                <div className="max-h-40 overflow-y-auto border border-sys-blue/20 p-2 mb-2">
                  <p className="text-xs text-gray-400 mb-1">Select Exercises:</p>
                  {exercises.map(ex => (
                    <div 
                      key={ex.id} 
                      onClick={() => toggleExerciseSelection(ex.id)}
                      className={`text-xs p-1 cursor-pointer flex justify-between ${selectedExIds.includes(ex.id) ? 'text-sys-blue bg-sys-blue/10' : 'text-gray-500'}`}
                    >
                      <span>{ex.name}</span>
                      {selectedExIds.includes(ex.id) && <Plus size={10}/>}
                    </div>
                  ))}
                </div>
                <SystemButton onClick={handleCreatePlan} className="text-xs w-full">Save Raid Plan</SystemButton>
            </SystemPanel>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-gray-600 text-xs font-mono uppercase">
        System Interface v4.6.3 // Connected
      </div>
    </div>
  );
};
