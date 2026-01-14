import React from 'react';
import { User, Sword, Feather } from 'lucide-react';
import { InventoryItem } from '../types';

interface ProfileFrameProps {
  item?: InventoryItem; // The skin item (can be undefined for default)
  avatar?: string; // 'default', 'hunter_m', 'hunter_f', 'monarch' OR a URL
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showEffects?: boolean; // toggle complex effects like particles
}

export const ProfileFrame: React.FC<ProfileFrameProps> = ({ item, avatar = 'default', size = 'lg', className = '', showEffects = true }) => {
    // Size mapping
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const iconSizes = {
        sm: 20,
        md: 32,
        lg: 48,
        xl: 64
    }
    
    // Default Base (Common/None)
    let containerClass = `relative ${sizeClasses[size]} flex items-center justify-center transition-all duration-500 z-10 bg-sys-black shrink-0 ${className}`;
    let borderClass = "border-2 border-gray-600";
    let iconColor = "text-gray-500";
    let extraContent = null;

    if (item) {
      // Assuming item.id is like 'skin-rusty' or 'skin-rusty-123123'
      const baseIdPart = item.id.split('-')[1]; // skin-rusty -> rusty

      // COMMON (10) - Matte Colors
      if (item.rarity === 'Common') {
        const commonMap: Record<string, string> = {
          'rusty': 'border-[#8B4513] bg-[#2A1B15]',
          'stone': 'border-[#7d7d7d] bg-[#333]',
          'wood': 'border-[#C19A6B] bg-[#3E3224]',
          'copper': 'border-[#B87333] bg-[#3D2611]',
          'dustblue': 'border-[#5F7D8E] bg-[#1F292E]',
          'olive': 'border-[#556B2F] bg-[#1C2410]',
          'slate': 'border-[#708090] bg-[#22272B]',
          'clay': 'border-[#A0522D] bg-[#361C10]',
          'zinc': 'border-[#A6A6A6] bg-[#333]',
          'charcoal': 'border-[#111] bg-[#050505]'
        };
        borderClass = `border-4 ${commonMap[baseIdPart] || 'border-gray-600'}`;
        iconColor = "text-gray-400";
      }

      // UNCOMMON (5) - Polished/Saturated, No Glow
      else if (item.rarity === 'Uncommon') {
        const uncommonMap: Record<string, string> = {
          'emerald': 'border-[#00C853] bg-[#003314]',
          'ruby': 'border-[#D50000] bg-[#330000]',
          'sapphire': 'border-[#2962FF] bg-[#000A33]',
          'goldmatte': 'border-[#FFD600] bg-[#332B00]',
          'amethyst': 'border-[#AA00FF] bg-[#220033]'
        };
        borderClass = `border-[3px] ${uncommonMap[baseIdPart]}`;
        iconColor = "text-white";
      }

      // RARE (5) - Neon Glow Pulse
      else if (item.rarity === 'Rare') {
        const rareMap: Record<string, string> = {
          'cyber': 'text-[#00E5FF]',
          'toxic': 'text-[#76FF03]',
          'magma': 'text-[#FF3D00]',
          'arcane': 'text-[#D500F9]',
          'holy': 'text-[#FFFF8D]'
        };
        const color = rareMap[baseIdPart] || 'text-sys-blue';
        borderClass = `border-2 border-current ${color} ${showEffects ? 'animate-neon-pulse' : ''}`;
        iconColor = `${color}`;
      }

      // LEGENDARY (3) - Thunder, Inferno, Glitch
      else if (item.rarity === 'Legendary') {
        if (baseIdPart === 'thunder') {
           borderClass = `border-4 border-transparent ${showEffects ? 'animate-thunder' : ''} bg-sys-black relative overflow-hidden`;
           iconColor = "text-green-400";
        } else if (baseIdPart === 'inferno') {
           // Weakened Inferno
           borderClass = `border-2 border-[#E53935] ${showEffects ? 'animate-inferno' : ''} bg-[#220000]`;
           iconColor = "text-[#FF9100]";
           if (showEffects) {
             extraContent = (
               <>
                 {/* Reduced intensity gradient */}
                 <div className="absolute -inset-2 bg-gradient-to-t from-red-600/30 to-transparent blur-md pointer-events-none" />
               </>
             );
           }
        } else if (baseIdPart === 'glitch') {
           // Enhanced Glitch
           borderClass = `border-2 border-white ${showEffects ? 'animate-glitch' : ''} bg-black overflow-visible`;
           iconColor = "text-[#00E676]";
        }
      }

      // MYTHIC (2) - Blades, Wings
      else if (item.rarity === 'Mythic') {
        if (baseIdPart === 'blades') {
          borderClass = "border-4 border-[#A480F2] shadow-[0_0_30px_#A480F2] bg-[#A480F2]/10";
          iconColor = "text-[#A480F2]";
          if (showEffects) {
            extraContent = (
              <div className="absolute inset-[-40px] animate-orbit pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[#FFD700]"><Sword size={24} fill="#A480F2" className="rotate-45" /></div>
                  <div className="absolute bottom-0 right-0 text-[#FFD700]"><Sword size={24} fill="#A480F2" className="rotate-[135deg]" /></div>
                  <div className="absolute bottom-0 left-0 text-[#FFD700]"><Sword size={24} fill="#A480F2" className="rotate-[225deg]" /></div>
              </div>
            );
          }
        } else if (baseIdPart === 'wings') {
          borderClass = `border-4 border-[#FFD700] shadow-[0_0_40px_#FFD700] bg-white/20 ${showEffects ? 'animate-float' : ''}`;
          iconColor = "text-[#FFD700]";
          // Wings are absolute outside the box
          if (showEffects) {
            extraContent = (
              <>
                <div className="absolute top-0 -left-10 md:-left-16 text-[#FFD700] wing-left drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] pointer-events-none">
                  <Feather size={size === 'sm' ? 32 : 64} fill="white" strokeWidth={1} />
                </div>
                <div className="absolute top-0 -right-10 md:-right-16 text-[#FFD700] wing-right drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] pointer-events-none">
                  <Feather size={size === 'sm' ? 32 : 64} fill="white" strokeWidth={1} className="-scale-x-100" />
                </div>
              </>
            );
          }
        }
      }
    }

    const isUrl = avatar.startsWith('http') || avatar.startsWith('data:image');
    
    return (
      <div className={`${containerClass} ${borderClass}`}>
         {isUrl ? (
             <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
         ) : (
             <User size={iconSizes[size]} className={iconColor + " opacity-90"} />
         )}
         {extraContent}
      </div>
    );
};
