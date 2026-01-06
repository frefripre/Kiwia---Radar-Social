
import React, { useMemo } from 'react';
import { NearbyDevice } from '../types';

interface RadarProps {
  devices: NearbyDevice[];
  isScanning: boolean;
  onDeviceSelect: (device: NearbyDevice) => void;
}

export const Radar: React.FC<RadarProps> = ({ devices, isScanning, onDeviceSelect }) => {
  const blips = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    delay: Math.random() * 5,
    size: Math.random() * 2 + 1
  })), []);

  return (
    <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center overflow-visible select-none mx-auto scale-110">
      {/* Lóbulos de Fondo Cinético */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.03)_0%,transparent_70%)]"></div>
      
      {/* Anillos de Distancia */}
      <div className="absolute inset-0 rounded-full border border-lime-500/10 shadow-[0_0_60px_rgba(132,204,22,0.05)]"></div>
      <div className="absolute inset-[20%] rounded-full border border-lime-500/10"></div>
      <div className="absolute inset-[40%] rounded-full border border-lime-500/15"></div>
      <div className="absolute inset-[60%] rounded-full border border-lime-500/20"></div>
      
      {/* Lóbulos de división (Ejes) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-lime-500/20 to-transparent"></div>
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-lime-500/20 to-transparent"></div>
      
      {/* Rayo de Escaneo con estela */}
      <div className="absolute inset-0 rounded-full animate-[spin_4s_linear_infinite] pointer-events-none z-10">
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-lime-500/20 to-transparent origin-bottom-left -rotate-90 rounded-tr-full blur-sm"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-t from-lime-500/80 to-transparent"></div>
      </div>

      {/* Blips decorativos */}
      {blips.map((blip) => (
        <div
          key={blip.id}
          className="absolute rounded-full bg-lime-400/30 blip"
          style={{
            left: `${blip.x}%`,
            top: `${blip.y}%`,
            width: `${blip.size}px`,
            height: `${blip.size}px`,
            animationDelay: `${blip.delay}s`
          }}
        />
      ))}

      {/* Punto Central (Tú) */}
      <div className="relative z-20">
        <div className="w-4 h-4 bg-lime-500 rounded-full shadow-[0_0_20px_rgba(132,204,22,1)]"></div>
        <div className="absolute inset-[-200%] border border-lime-500/30 rounded-full animate-ping"></div>
      </div>

      {/* Usuarios Detectados */}
      {!isScanning && devices.map((device) => {
        const x = 50 + (device.distance / 2.2) * Math.cos((device.angle * Math.PI) / 180);
        const y = 50 + (device.distance / 2.2) * Math.sin((device.angle * Math.PI) / 180);
        
        return (
          <button
            key={device.id}
            onClick={() => onDeviceSelect(device)}
            className="absolute w-16 h-16 -ml-8 -mt-8 transition-all duration-700 group z-30"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-lime-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-12 h-12 rounded-2xl border-2 border-white/20 overflow-hidden bg-zinc-900 group-hover:border-lime-500 group-hover:scale-110 transition-all shadow-2xl relative">
                <img src={device.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-500 rounded-full border-2 border-black animate-pulse"></div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
