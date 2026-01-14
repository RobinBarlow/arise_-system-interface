import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SystemPanel, SystemButton } from './SystemComponents';
import { User, Save, Info, ImagePlus } from 'lucide-react';

const PRESET_AVATARS = [
    { id: 'default', name: 'Shadow', bg: 'bg-sys-black' },
    { id: 'hunter_m', name: 'Hunter (M)', bg: 'bg-sys-blue/20' },
    { id: 'hunter_f', name: 'Hunter (F)', bg: 'bg-sys-crimson/20' },
    { id: 'monarch', name: 'Monarch', bg: 'bg-sys-purple/20' },
];

export const Settings: React.FC = () => {
    const { player, updateProfile, addNotification } = useGame();
    const [name, setName] = useState(player.username);
    const [selectedAvatar, setSelectedAvatar] = useState(player.avatar || 'default');
    const [customAvatarUrl, setCustomAvatarUrl] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Resize to avoid huge base64 strings
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 300;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    
                    setCustomAvatarUrl(dataUrl);
                    setSelectedAvatar('custom');
                    addNotification("Image Loaded");
                };
                if(event.target?.result) {
                    img.src = event.target.result as string;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (name.trim().length > 0) {
            // Use custom URL if provided and valid, otherwise selected preset
            const finalAvatar = (customAvatarUrl && selectedAvatar === 'custom') ? customAvatarUrl : selectedAvatar;
            updateProfile(name, finalAvatar);
        } else {
            addNotification("Invalid Name");
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            <h2 className="text-xl font-bold uppercase text-sys-blue tracking-[0.2em] border-b border-sys-blue/30 pb-2">
                System Configuration
            </h2>

            <SystemPanel title="Identity">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase block mb-1">Hunter Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-sys-black border border-sys-blue/50 text-white p-2 font-mono text-sm focus:outline-none focus:border-sys-blue"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs text-gray-500 uppercase block mb-2">Avatar Profile</label>
                        
                        {/* Presets */}
                        <div className="flex gap-4 justify-between mb-4">
                            {PRESET_AVATARS.map(avatar => (
                                <div 
                                    key={avatar.id}
                                    onClick={() => {
                                        setSelectedAvatar(avatar.id);
                                        // Don't clear custom url, just don't select it
                                    }}
                                    className={`
                                        w-16 h-16 border-2 flex items-center justify-center cursor-pointer transition-all shrink-0
                                        ${selectedAvatar === avatar.id ? 'border-sys-blue shadow-neon scale-105' : 'border-gray-700 opacity-60'}
                                        ${avatar.bg}
                                    `}
                                >
                                    <User size={32} className={selectedAvatar === avatar.id ? 'text-sys-blue' : 'text-gray-500'} />
                                </div>
                            ))}
                        </div>

                        {/* Custom Upload */}
                         <div>
                            <label className="text-xs text-gray-600 uppercase block mb-2">Upload Custom Image</label>
                            
                            <div className="flex gap-4 items-center">
                                <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-600 cursor-pointer hover:border-sys-blue hover:text-sys-blue transition-colors bg-sys-black">
                                    <ImagePlus size={24} className="mb-1" />
                                    <span className="text-[8px] uppercase">Select</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                    />
                                </label>
                                
                                {customAvatarUrl && (
                                    <div 
                                        onClick={() => setSelectedAvatar('custom')}
                                        className={`w-16 h-16 border-2 overflow-hidden cursor-pointer ${selectedAvatar === 'custom' ? 'border-sys-blue shadow-neon' : 'border-gray-600 opacity-50'}`}
                                    >
                                        <img src={customAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                
                                <div className="text-[10px] text-gray-500 flex-1 ml-2">
                                    Tap the box to upload from gallery. Image will be compressed for the System.
                                </div>
                            </div>
                        </div>
                    </div>

                    <SystemButton onClick={handleSave} className="w-full flex justify-center items-center gap-2">
                        <Save size={16} /> Save Changes
                    </SystemButton>
                </div>
            </SystemPanel>

            <SystemPanel title="System Info">
                <div className="space-y-2 text-xs font-mono text-gray-400">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>User ID</span>
                        <span className="text-white">SYS-{Date.now().toString().slice(-6)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Version</span>
                        <span className="text-white">v4.7.0 (Monarch)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Total XP</span>
                        <span className="text-sys-blue">{player.xp} XP</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Rank Status</span>
                        <span className="text-sys-gold font-bold">{player.rank}-Rank</span>
                    </div>
                </div>
            </SystemPanel>

            <div className="text-center text-[10px] text-gray-600 mt-8 max-w-xs mx-auto">
                Warning: Modifying system parameters may result in penalties. 
                Proceed with caution.
            </div>
        </div>
    );
};
