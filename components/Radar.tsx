
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
    
    const timer = setTimeout(() => setDevices(mockDevices), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center overflow-hidden">
      {/* Círculos del Radar */}
      <div className="absolute inset-0 border border-white/10 rounded-full"></div>
      <div className="absolute inset-[15%] border border-white/10 rounded-full"></div>
      <div className="absolute inset-[30%] border border-white/10 rounded-full"></div>
      <div className="absolute inset-[45%] border border-white/20 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"></div>
      </div>

      {/* Ondas de pulso */}
      <div className="absolute inset-0 border border-white/30 rounded-full radar-pulse"></div>
      <div className="absolute inset-0 border border-white/30 rounded-full radar-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Dispositivos (Puntos dinámicos) */}
      {devices.map((device) => {
        const x = 50 + (device.distance / 2) * Math.cos((device.angle * Math.PI) / 180);
        const y = 50 + (device.distance / 2) * Math.sin((device.angle * Math.PI) / 180);
        
        return (
          <button
            key={device.id}
            onClick={() => onDeviceSelect(device)}
            className="absolute w-12 h-12 -ml-6 -mt-6 transition-all duration-1000 orb-float"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative group">
              <img 
                src={device.avatar} 
                className="w-full h-full rounded-full border-2 border-white/50 bg-black p-0.5 group-hover:border-white transition-colors"
                alt={device.username}
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {device.username}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
