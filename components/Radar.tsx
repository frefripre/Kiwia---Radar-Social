
import React, { useEffect, useState } from 'react';
import { NearbyDevice } from '../types';

interface RadarProps {
  onDeviceSelect: (device: NearbyDevice) => void;
}

export const Radar: React.FC<RadarProps> = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState<NearbyDevice[]>([]);

  // Simulación de escaneo BLE
  useEffect(() => {
    const mockDevices: NearbyDevice[] = [
      { id: '1', username: 'Elena_V', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', distance: 60, angle: 45 },
      { id: '2', username: 'Marcos.dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos', distance: 40, angle: 160 },
      { id: '3', username: 'Sofia_Kiwi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', distance: 85, angle: 280 },
    ];
    
    const timer = setTimeout(() => setDevices(mockDevices), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-sm flex items-center justify-center overflow-visible">
      {/* Background Rings */}
      <div className="absolute inset-0 border border-white/5 rounded-full"></div>
      <div className="absolute inset-[18%] border border-white/5 rounded-full"></div>
      <div className="absolute inset-[36%] border border-white/5 rounded-full"></div>
      <div className="absolute inset-[54%] border border-white/5 rounded-full"></div>
      
      {/* Center Point */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-lime-500 rounded-full shadow-[0_0_15px_rgba(132,204,22,1)] z-10"></div>
        <div className="w-20 h-20 bg-lime-500/5 rounded-full animate-ping"></div>
      </div>

      {/* Radar Sweep Animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-lime-500/0 via-lime-500/0 to-lime-500/10 animate-[spin_4s_linear_infinite]"></div>

      {/* Pulse Waves */}
      <div className="absolute inset-0 border border-lime-500/20 rounded-full radar-pulse"></div>
      <div className="absolute inset-0 border border-lime-500/20 rounded-full radar-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Nearby Devices */}
      {devices.map((device) => {
        const x = 50 + (device.distance / 2) * Math.cos((device.angle * Math.PI) / 180);
        const y = 50 + (device.distance / 2) * Math.sin((device.angle * Math.PI) / 180);
        
        return (
          <button
            key={device.id}
            onClick={() => onDeviceSelect(device)}
            className="absolute w-14 h-14 -ml-7 -mt-7 transition-all duration-1000 orb-float group z-20"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-lime-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-14 h-14 rounded-2xl border-2 border-white/10 overflow-hidden bg-zinc-900 group-hover:border-lime-500/50 group-hover:scale-110 transition-all shadow-2xl">
                <img 
                  src={device.avatar} 
                  className="w-full h-full object-cover"
                  alt={device.username}
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                <span className="text-[8px] font-black text-white/80 whitespace-nowrap uppercase tracking-widest">{device.username}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
