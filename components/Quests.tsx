import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SystemPanel, SystemButton } from './SystemComponents';
import { Check, AlertTriangle, Clock, Plus, Trash2 } from 'lucide-react';
import { Quest } from '../types';

export const Quests: React.FC = () => {
  const { quests, completeQuest, addCustomQuest, removeQuest } = useGame();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDesc, setNewHabitDesc] = useState('');

  const handleAddHabit = () => {
    if (newHabitTitle.trim()) {
      addCustomQuest(newHabitTitle, newHabitDesc || 'Custom Habit');
      setNewHabitTitle('');
      setNewHabitDesc('');
      setShowAddForm(false);
    }
  };

  const DailyQuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
    const isPenalty = quest.penalty && !quest.completed;
    const isMandatory = quest.id === 'daily-force';
    
    return (
      <div className={`
        relative p-4 border-l-4 mb-4 transition-all duration-300 group
        ${quest.completed ? 'bg-sys-black/50 border-sys-green opacity-60' : 'bg-sys-black border-sys-blue shadow-neon'}
        ${isPenalty ? 'border-sys-crimson shadow-[0_0_10px_rgba(229,57,53,0.3)]' : ''}
      `}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-1.5 py-0.5 border ${
                quest.type === 'DAILY' ? 'border-sys-gold text-sys-gold' : 'border-sys-blue text-sys-blue'
              }`}>
                {quest.type}
              </span>
              {isPenalty && (
                <span className="flex items-center gap-1 text-xs text-sys-crimson font-bold animate-pulse">
                  <AlertTriangle size={12} /> PENALTY WARNING
                </span>
              )}
            </div>
            <h3 className={`font-bold uppercase tracking-wider ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {quest.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{quest.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isMandatory && (
              <button 
                onClick={(e) => { e.stopPropagation(); removeQuest(quest.id); }}
                className="p-2 text-gray-600 hover:text-sys-crimson transition-colors"
                title="Abandon Quest"
              >
                <Trash2 size={16} />
              </button>
            )}
            
            <button 
              onClick={() => completeQuest(quest.id)}
              disabled={quest.completed}
              className={`
                w-12 h-12 flex items-center justify-center border-2 ml-2
                ${quest.completed 
                  ? 'border-sys-green text-sys-green' 
                  : 'border-gray-600 text-gray-600 hover:border-sys-blue hover:text-sys-blue hover:shadow-neon'}
              `}
            >
              {quest.completed && <Check size={24} />}
            </button>
          </div>
        </div>

        {/* Rewards */}
        <div className="mt-3 flex gap-3 text-xs font-mono">
          <span className="text-sys-blue">XP +{quest.xpReward}</span>
          <span className="text-sys-gold">GOLD +{quest.goldReward}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
       <div className="border-b border-sys-blue/30 pb-2 mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold uppercase text-sys-blue tracking-[0.2em]">Active Quests</h2>
          <p className="text-xs text-gray-400 mt-1">Complete quests to recover status.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-sys-blue/20 p-2 border border-sys-blue text-sys-blue hover:bg-sys-blue hover:text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {showAddForm && (
        <SystemPanel title="Create Custom Habit" className="mb-6 animate-fade-in">
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Habit Title (e.g. Meditate)"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              className="w-full bg-sys-black border border-sys-blue/30 p-2 text-sm text-white focus:outline-none focus:border-sys-blue"
            />
             <input 
              type="text" 
              placeholder="Description (Optional)"
              value={newHabitDesc}
              onChange={(e) => setNewHabitDesc(e.target.value)}
              className="w-full bg-sys-black border border-sys-blue/30 p-2 text-sm text-white focus:outline-none focus:border-sys-blue"
            />
            <div className="text-xs text-gray-500 flex gap-4">
              <span>Reward: 10 XP</span>
              <span>Reward: 5 Gold</span>
            </div>
            <SystemButton onClick={handleAddHabit} className="w-full text-sm py-1">Confirm</SystemButton>
          </div>
        </SystemPanel>
      )}

      <div className="space-y-1">
        {quests.map(quest => (
          <DailyQuestCard key={quest.id} quest={quest} />
        ))}
      </div>

      <SystemPanel title="Habit Streak" className="mt-8 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-sys-blue/10 rounded-full text-sys-blue">
                <Clock size={24} />
            </div>
            <div>
                <div className="text-sm text-gray-400 uppercase">Current Streak</div>
                <div className="text-2xl font-orbitron text-white">14 DAYS</div>
            </div>
         </div>
         <div className="text-right">
             <div className="text-xs text-sys-gold mb-1">COMBO BONUS</div>
             <div className="text-lg font-bold">x1.5 GOLD</div>
         </div>
      </SystemPanel>
    </div>
  );
};
