import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { SystemButton, SystemPanel } from './SystemComponents';
import { Dumbbell, Play, Save, Trash2, ArrowLeft, History, Edit2, X } from 'lucide-react';
import { LoggedSet, DungeonLog } from '../types';

export const Dungeon: React.FC = () => {
  const { addXp, addNotification, workoutPlans, exercises, saveDungeonLog, player, updateDungeonLog } = useGame();
  
  // Modes: 'menu', 'active', 'history', 'edit-log'
  const [mode, setMode] = useState<'menu' | 'active' | 'history' | 'edit-log'>('menu');
  
  const [selectedPlanId, setSelectedPlanId] = useState<string>(workoutPlans[0]?.id || '');
  const [logs, setLogs] = useState<LoggedSet[]>([]);
  const [currentExId, setCurrentExId] = useState('');
  
  // Active Workout Inputs
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(10);

  // Edit Log State
  const [editingLog, setEditingLog] = useState<DungeonLog | null>(null);

  // Get current plan details
  const activePlan = useMemo(() => 
    workoutPlans.find(p => p.id === selectedPlanId), 
  [workoutPlans, selectedPlanId]);

  // Filter exercises available in the current plan
  const availableExercises = useMemo(() => {
    if (!activePlan) return exercises;
    return exercises.filter(ex => activePlan.exerciseIds.includes(ex.id));
  }, [exercises, activePlan]);

  // Set default exercise when starting
  useEffect(() => {
    if (availableExercises.length > 0 && !currentExId) {
      setCurrentExId(availableExercises[0].id);
    }
  }, [availableExercises, currentExId]);

  const startDungeon = () => {
    if (!activePlan) return;
    setMode('active');
    setLogs([]);
    setCurrentExId(availableExercises[0]?.id || '');
    addNotification(`ENTERING ${activePlan.name}...`);
  };

  const finishDungeon = () => {
    // Calculate total volume XP: Volume = Weight * Reps
    // Formula: Total Volume / 50. Example: 2000kg vol = 40 XP.
    // Minimum 0 XP if no volume.
    const totalVol = logs.reduce((acc, set) => acc + (set.weight * set.reps), 0);
    const xpGain = Math.floor(totalVol / 50); 
    
    // Save Log
    const dungeonLog: DungeonLog = {
      id: Date.now().toString(),
      date: Date.now(),
      planName: activePlan?.name || 'Unknown Raid',
      sets: logs,
      totalVolume: totalVol,
      xpEarned: xpGain
    };
    saveDungeonLog(dungeonLog);

    setMode('menu');
    
    if (xpGain > 0) {
      addXp(xpGain);
      addNotification(`DUNGEON CLEARED. TOTAL LOAD: ${totalVol}kg. GAINED ${xpGain} XP.`);
    } else {
      addNotification("DUNGEON FAILED. NO WORK DONE.");
    }
  };

  const logSet = () => {
    const exercise = exercises.find(e => e.id === currentExId);
    const newSet: LoggedSet = {
      id: Date.now().toString(),
      exerciseName: exercise?.name || 'Unknown',
      reps,
      weight,
      completed: true
    };
    setLogs([...logs, newSet]);
    addNotification("HIT!");
  };

  const handleEditLogSave = () => {
    if (editingLog) {
       // Recalculate volume if needed, but we keep XP static to avoid retroactive de-leveling complexity
       const newVol = editingLog.sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
       updateDungeonLog({
         ...editingLog,
         totalVolume: newVol
       });
       setMode('history');
       setEditingLog(null);
    }
  };

  const updateEditingSet = (setId: string, field: 'weight' | 'reps', value: number) => {
    if (!editingLog) return;
    setEditingLog(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sets: prev.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
      };
    });
  };

  // --- RENDERERS ---

  if (mode === 'active') {
    return (
      <div className="pb-20 animate-fade-in">
        <div className="flex justify-between items-center mb-6 border-b border-sys-blue/30 pb-4">
          <div>
              <h2 className="text-xl font-bold text-sys-crimson animate-pulse">DUNGEON ACTIVE</h2>
              <p className="text-xs text-sys-blue">{activePlan?.name}</p>
          </div>
          <SystemButton onClick={finishDungeon} variant="danger" className="text-xs px-2">
              LEAVE DUNGEON
          </SystemButton>
        </div>

        <SystemPanel title="Battle Log" className="mb-6">
          <div className="space-y-4">
              <div>
                  <label className="text-xs text-sys-blue font-bold uppercase block mb-2">Select Monster (Exercise)</label>
                  <select 
                      value={currentExId}
                      onChange={(e) => setCurrentExId(e.target.value)}
                      className="w-full bg-sys-black border border-sys-blue/50 text-white p-2 font-mono text-sm focus:outline-none focus:border-sys-blue"
                  >
                      {availableExercises.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.name} ({ex.dungeonName})</option>
                      ))}
                  </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs text-gray-500 uppercase block mb-1">Weight (kg)</label>
                      <input 
                          type="number" 
                          value={weight}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-full bg-sys-black border border-gray-700 text-white p-2 font-orbitron text-center"
                      />
                  </div>
                  <div>
                      <label className="text-xs text-gray-500 uppercase block mb-1">Reps</label>
                      <input 
                          type="number" 
                          value={reps}
                          onChange={(e) => setReps(Number(e.target.value))}
                          className="w-full bg-sys-black border border-gray-700 text-white p-2 font-orbitron text-center"
                      />
                  </div>
              </div>

              <SystemButton onClick={logSet} className="w-full flex items-center justify-center gap-2">
                  <Play size={16} fill="currentColor" /> COMPLETE SET
              </SystemButton>
          </div>
        </SystemPanel>

        <div className="space-y-2 max-h-60 overflow-y-auto">
           {logs.map((log, idx) => (
               <div key={log.id} className="flex justify-between items-center bg-sys-black/40 border border-white/5 p-3 animate-fade-in-up">
                   <div className="flex flex-col">
                      <span className="text-sys-blue font-bold text-xs uppercase mb-1">{log.exerciseName}</span>
                      <span className="text-white text-sm">{log.weight}kg x {log.reps}</span>
                   </div>
                   <span className="text-xs text-sys-green font-bold">DMG: {log.weight * log.reps}</span>
               </div>
           ))}
           {logs.length === 0 && (
               <div className="text-center text-gray-600 text-sm py-8 italic">
                   No damage dealt yet...
               </div>
           )}
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
           Total Volume: {logs.reduce((acc, s) => acc + (s.weight * s.reps), 0)}kg
        </div>
      </div>
    );
  }

  if (mode === 'history') {
    return (
      <div className="pb-20 animate-slide-in">
        <div className="flex items-center gap-4 mb-6 border-b border-sys-blue/30 pb-4">
          <button onClick={() => setMode('menu')} className="text-sys-blue hover:text-white"><ArrowLeft /></button>
          <h2 className="text-xl font-bold uppercase tracking-widest text-sys-blue">System Archives</h2>
        </div>

        <div className="space-y-3">
          {player.dungeonLogs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No raid history found.</div>
          ) : (
             player.dungeonLogs.map(log => (
               <div 
                 key={log.id} 
                 onClick={() => { setEditingLog(log); setMode('edit-log'); }}
                 className="bg-sys-black border border-white/10 p-4 hover:border-sys-blue cursor-pointer transition-colors group"
               >
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs text-gray-400 font-mono">{new Date(log.date).toLocaleDateString()}</span>
                   <span className="text-xs text-sys-green font-bold">+{log.xpEarned} XP</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <h3 className="font-bold uppercase text-white group-hover:text-sys-blue transition-colors">{log.planName}</h3>
                    <div className="text-xs text-gray-500">{log.sets.length} Sets</div>
                 </div>
               </div>
             ))
          )}
        </div>
      </div>
    );
  }

  if (mode === 'edit-log' && editingLog) {
    return (
      <div className="pb-20 animate-slide-in">
         <div className="flex items-center justify-between mb-6 border-b border-sys-blue/30 pb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => { setMode('history'); setEditingLog(null); }} className="text-gray-500 hover:text-white"><X /></button>
              <div>
                <h2 className="text-lg font-bold uppercase text-white">Edit Record</h2>
                <p className="text-xs text-sys-blue">{new Date(editingLog.date).toDateString()}</p>
              </div>
            </div>
            <SystemButton onClick={handleEditLogSave} className="text-xs px-4 py-1">Save</SystemButton>
        </div>

        <div className="space-y-4">
          {editingLog.sets.map((set, idx) => (
            <div key={set.id} className="bg-sys-black border border-sys-blue/20 p-3">
               <div className="text-xs text-sys-blue font-bold uppercase mb-2 flex justify-between">
                  <span>{idx + 1}. {set.exerciseName}</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] text-gray-500 uppercase">Weight</label>
                   <input 
                      type="number" 
                      value={set.weight} 
                      onChange={(e) => updateEditingSet(set.id, 'weight', Number(e.target.value))}
                      className="w-full bg-sys-void border border-gray-700 p-1 text-center font-orbitron text-sm text-white"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] text-gray-500 uppercase">Reps</label>
                   <input 
                      type="number" 
                      value={set.reps} 
                      onChange={(e) => updateEditingSet(set.id, 'reps', Number(e.target.value))}
                      className="w-full bg-sys-void border border-gray-700 p-1 text-center font-orbitron text-sm text-white"
                   />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Menu
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 py-12">
      <div className="w-32 h-32 rounded-full border-4 border-sys-blue shadow-neon-strong flex items-center justify-center bg-sys-black animate-pulse">
          <Dumbbell size={64} className="text-sys-blue" />
      </div>
      <div className="text-center space-y-2">
          <h2 className="text-3xl font-rajdhani font-bold uppercase tracking-widest text-white">
              Hunter's Gym
          </h2>
          <p className="text-gray-400 max-w-xs mx-auto text-sm">
              Physical exertion is the only path to strength. 
              XP is awarded based on total weight lifted.
          </p>
      </div>

      <div className="w-full max-w-sm">
          <SystemPanel title="Select Raid Plan">
            <select 
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full bg-sys-black border border-sys-blue/50 text-white p-3 font-mono text-sm focus:outline-none"
            >
              {workoutPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
            <div className="mt-2 text-xs text-gray-500 text-center">
                Create new plans in the Profile tab.
            </div>
          </SystemPanel>
      </div>

      <div className="flex flex-col gap-4 w-64">
        <SystemButton onClick={startDungeon} className="py-4 text-xl shadow-neon-strong">
            ENTER DUNGEON
        </SystemButton>
        <SystemButton onClick={() => setMode('history')} variant="gold" className="py-2 text-sm flex items-center justify-center gap-2">
            <History size={16} /> DUNGEON ARCHIVES
        </SystemButton>
      </div>
    </div>
  );
};
