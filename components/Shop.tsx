import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SystemButton, SystemPanel } from './SystemComponents';
import { Hexagon, ShoppingBag, Gift, Shield, Info, X } from 'lucide-react';
import { InventoryItem } from '../types';
import { GACHA_ITEMS } from '../constants';
import { ProfileFrame } from './ProfileFrame';

export const Shop: React.FC = () => {
  const { player, gachaPull, inventory, equipItem } = useGame();
  const [pullResult, setPullResult] = useState<{ items: InventoryItem[], duplicates: number } | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handlePull = (amount: number, useEssence: boolean) => {
    setPullResult(null);
    setTimeout(() => {
        const result = gachaPull(amount, useEssence);
        if(result.items.length > 0 || result.duplicates > 0) setPullResult(result);
    }, 500);
  };

  const getRarityColor = (rarity: string) => {
      switch(rarity) {
          case 'Mythic': return 'text-sys-purple drop-shadow-[0_0_10px_rgba(164,128,242,0.8)]';
          case 'Legendary': return 'text-sys-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]';
          case 'Rare': return 'text-sys-blue drop-shadow-[0_0_5px_rgba(27,69,215,0.8)]';
          case 'Uncommon': return 'text-sys-green';
          default: return 'text-gray-400';
      }
  };

  return (
    <div className="pb-20 space-y-8 relative">
      
      {/* Drop Rate & Gallery Modal */}
      {showInfo && (
          <div className="fixed inset-0 z-50 bg-sys-black/95 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-sys-void border border-sys-blue p-4 h-[90vh] flex flex-col relative shadow-neon">
                  <button onClick={() => setShowInfo(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"><X size={24}/></button>
                  <h2 className="text-xl font-bold text-sys-blue mb-4 uppercase tracking-widest border-b border-sys-blue/30 pb-2">Database & Rates</h2>
                  
                  <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="border border-sys-gold/30 p-2 bg-sys-black/50">
                              <h3 className="text-sys-gold font-bold mb-2 uppercase">Gold Chest</h3>
                              <div className="flex justify-between"><span>Common</span><span>60%</span></div>
                              <div className="flex justify-between"><span>Uncommon</span><span>25%</span></div>
                              <div className="flex justify-between"><span>Rare</span><span>10%</span></div>
                              <div className="flex justify-between"><span>Legendary</span><span>4%</span></div>
                              <div className="flex justify-between"><span>Mythic</span><span>1%</span></div>
                          </div>
                          <div className="border border-sys-purple/30 p-2 bg-sys-black/50">
                              <h3 className="text-sys-purple font-bold mb-2 uppercase">Awakened Chest</h3>
                              <div className="flex justify-between text-gray-500"><span>Common</span><span>0%</span></div>
                              <div className="flex justify-between"><span>Uncommon</span><span>50%</span></div>
                              <div className="flex justify-between"><span>Rare</span><span>35%</span></div>
                              <div className="flex justify-between"><span>Legendary</span><span>13%</span></div>
                              <div className="flex justify-between"><span>Mythic</span><span>2%</span></div>
                          </div>
                      </div>

                      <div>
                          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Item Gallery</h3>
                          <div className="space-y-6">
                              {['Mythic', 'Legendary', 'Rare', 'Uncommon', 'Common'].map(rarity => (
                                  <div key={rarity}>
                                      <div className={`text-xs font-bold uppercase mb-2 ${getRarityColor(rarity)}`}>{rarity}</div>
                                      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                                          {GACHA_ITEMS.filter(i => i.rarity === rarity).map(item => (
                                              <div key={item.id} className="flex flex-col items-center gap-1" title={item.description}>
                                                  {/* Render a small preview of the frame */}
                                                  <ProfileFrame item={item} size="sm" showEffects={false} />
                                                  <div className="text-[9px] text-gray-400 leading-none text-center h-5 overflow-hidden">{item.name}</div>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Wallet */}
      <div className="flex justify-between bg-sys-black border-y border-sys-gold/30 p-4 -mx-4 items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-sys-gold bg-sys-gold/20 flex items-center justify-center text-sys-gold font-bold">$</div>
                <div>
                    <div className="text-xs text-sys-gold uppercase">Gold</div>
                    <div className="font-orbitron font-bold text-xl">{player.gold}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-sys-purple bg-sys-purple/20 flex items-center justify-center text-sys-purple font-bold">E</div>
                <div>
                    <div className="text-xs text-sys-purple uppercase">Essence</div>
                    <div className="font-orbitron font-bold text-xl">{player.essenceStones}</div>
                </div>
            </div>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 text-sys-blue hover:bg-sys-blue/10 rounded-full border border-sys-blue/30">
              <Info size={20} />
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard Box */}
        <div className="relative h-48 border border-sys-blue bg-gradient-to-br from-sys-black via-sys-void to-sys-blue/10 flex flex-col items-center justify-center p-6 text-center shadow-neon overflow-hidden group">
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white z-10">Standard Box</h2>
            <p className="text-gray-400 text-xs mt-1 z-10 mb-4">Random Artifacts (Common-Legendary)</p>
            
            <div className="flex gap-2 z-10">
              <SystemButton variant="gold" onClick={() => handlePull(1, false)} className="text-xs px-2">
                  Open 1 (100G)
              </SystemButton>
              <SystemButton variant="gold" onClick={() => handlePull(10, false)} className="text-xs px-2">
                  Open 10 (1k G)
              </SystemButton>
            </div>
        </div>

        {/* Awakened Box (Essence) */}
        <div className="relative h-48 border border-sys-purple bg-gradient-to-br from-sys-black via-sys-void to-sys-purple/20 flex flex-col items-center justify-center p-6 text-center shadow-[0_0_15px_rgba(164,128,242,0.5)] overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-sys-purple z-10 drop-shadow-md">Awakened Box</h2>
            <p className="text-sys-purple/80 text-xs mt-1 z-10 mb-4 font-bold">Uncommon+. High Mythic Chance.</p>
            
            <div className="flex gap-2 z-10">
              <SystemButton variant="primary" onClick={() => handlePull(1, true)} className="text-xs px-2 border-sys-purple text-sys-purple hover:bg-sys-purple hover:text-white">
                  Open 1 (1 Ess.)
              </SystemButton>
              <SystemButton variant="primary" onClick={() => handlePull(5, true)} className="text-xs px-2 border-sys-purple text-sys-purple hover:bg-sys-purple hover:text-white">
                  Open 5 (5 Ess.)
              </SystemButton>
            </div>
        </div>
      </div>

      {/* Result Modal Overlay */}
      {pullResult && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPullResult(null)}>
              <div className="max-w-md w-full bg-sys-void border border-sys-gold p-6 text-center animate-bounce-in">
                  <h3 className="text-xl font-bold text-sys-gold uppercase mb-6">Extraction Complete</h3>
                  
                  {pullResult.duplicates > 0 && (
                      <div className="mb-4 text-xs text-sys-green font-mono">
                          {pullResult.duplicates} duplicates converted to XP.
                      </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6 max-h-60 overflow-y-auto">
                      {pullResult.items.map((item, i) => (
                          <div key={i} className="flex flex-col items-center p-2 border border-white/10 bg-white/5">
                              <Hexagon size={32} className={getRarityColor(item.rarity)} />
                              <span className={`text-xs font-bold mt-2 ${getRarityColor(item.rarity)}`}>{item.name}</span>
                              <span className="text-[10px] text-gray-500 uppercase">{item.rarity}</span>
                          </div>
                      ))}
                      {pullResult.items.length === 0 && pullResult.duplicates > 0 && (
                          <div className="col-span-2 text-gray-400 italic text-sm">All items were duplicates.</div>
                      )}
                  </div>
                  <SystemButton onClick={() => setPullResult(null)} variant="gold">Confirm</SystemButton>
              </div>
          </div>
      )}

      {/* Inventory Grid */}
      <SystemPanel title="Inventory">
          {inventory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">Inventory is empty.</div>
          ) : (
              <div className="grid grid-cols-3 gap-2">
                  {inventory.map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => equipItem(item.id)}
                        className={`
                          aspect-square border flex flex-col items-center justify-center p-1 relative transition-colors cursor-pointer group
                          ${player.equippedItemId === item.id ? 'border-sys-green bg-sys-green/10' : 'border-gray-800 bg-sys-black/50 hover:border-sys-blue'}
                        `}
                      >
                          {player.equippedItemId === item.id && (
                             <div className="absolute top-1 right-1 text-sys-green"><Shield size={12} fill="currentColor"/></div>
                          )}
                          <Gift size={20} className={`mb-1 ${getRarityColor(item.rarity)}`} />
                          <span className="text-[9px] text-center leading-tight text-gray-400 group-hover:text-white">{item.name}</span>
                          <span className="text-[8px] text-gray-600 mt-1 uppercase">
                              {player.equippedItemId === item.id ? 'EQUIPPED' : 'EQUIP'}
                          </span>
                      </div>
                  ))}
              </div>
          )}
      </SystemPanel>
    </div>
  );
};
