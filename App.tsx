import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Dashboard } from './components/Dashboard';
import { Quests } from './components/Quests';
import { Dungeon } from './components/Dungeon';
import { Shop } from './components/Shop';
import { Settings } from './components/Settings';
import { LayoutDashboard, CheckSquare, Dumbbell, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';

const NavButton: React.FC<{ 
    active: boolean; 
    onClick: () => void; 
    icon: React.ReactNode; 
    label: string 
}> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center flex-1 py-3 transition-colors duration-300 relative ${
            active ? 'text-sys-blue' : 'text-gray-500 hover:text-gray-300'
        }`}
    >
        {active && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-sys-blue shadow-neon" />
        )}
        <div className="mb-1">{icon}</div>
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </button>
);

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'quests' | 'dungeon' | 'shop' | 'settings'>('status');
  const { notifications } = useGame();

  return (
    <div className="min-h-screen bg-sys-void text-sys-text flex justify-center">
      <div className="w-full max-w-md bg-sys-void relative shadow-2xl overflow-hidden min-h-screen border-x border-white/5">
        
        {/* Background Grid Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#1b45d7 1px, transparent 1px), linear-gradient(90deg, #1b45d7 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Top Notification Toast */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50 pointer-events-none space-y-2">
            {notifications.map((msg, i) => (
                <div key={i} className="bg-sys-black/90 border-l-4 border-sys-blue text-sys-blue p-3 shadow-neon text-sm font-bold uppercase tracking-wide animate-slide-in">
                    SYSTEM: {msg}
                </div>
            ))}
        </div>

        {/* Header with Settings Toggle */}
        <div className="absolute top-4 right-4 z-30">
            <button 
                onClick={() => setActiveTab(activeTab === 'settings' ? 'status' : 'settings')}
                className={`p-2 rounded-full border transition-all ${activeTab === 'settings' ? 'border-sys-blue text-sys-blue bg-sys-blue/20' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
                <SettingsIcon size={20} />
            </button>
        </div>

        {/* Main Content Area */}
        <main className="relative z-10 p-4 h-full overflow-y-auto pt-16">
            {activeTab === 'status' && <Dashboard />}
            {activeTab === 'quests' && <Quests />}
            {activeTab === 'dungeon' && <Dungeon />}
            {activeTab === 'shop' && <Shop />}
            {activeTab === 'settings' && <Settings />}
        </main>

        {/* Bottom Navigation */}
        {activeTab !== 'settings' && (
            <nav className="fixed bottom-0 w-full max-w-md bg-sys-black border-t border-white/10 flex justify-between items-center z-40 backdrop-blur-lg">
                <NavButton 
                    active={activeTab === 'status'} 
                    onClick={() => setActiveTab('status')} 
                    icon={<LayoutDashboard size={20} />} 
                    label="Status" 
                />
                <NavButton 
                    active={activeTab === 'quests'} 
                    onClick={() => setActiveTab('quests')} 
                    icon={<CheckSquare size={20} />} 
                    label="Quests" 
                />
                <NavButton 
                    active={activeTab === 'dungeon'} 
                    onClick={() => setActiveTab('dungeon')} 
                    icon={<Dumbbell size={20} />} 
                    label="Dungeon" 
                />
                <NavButton 
                    active={activeTab === 'shop'} 
                    onClick={() => setActiveTab('shop')} 
                    icon={<ShoppingBag size={20} />} 
                    label="Shop" 
                />
            </nav>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
