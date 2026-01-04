
import React, { useMemo } from 'react';
import { NearbyDevice } from '../types';

interface RadarProps {
  devices: NearbyDevice[];
  isScanning: boolean;
  onDeviceSelect: (device: NearbyDevice) => void;
}

export const Radar: React.FC<RadarProps> = ({ devices, isScanning, onDeviceSelect }) => {
  // Decorative "noise" blips that don't represent real devices
  const blips = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    delay: Math.random() * 4,
    size: Math.random() * 2 + 1
  })), []);

  return (
    <div className="relative w-full aspect-square max-w-sm flex items-center justify-center overflow-visible select-none">
      {/* Background Grid Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-lime-500"></div>
        <div className="absolute left-1/2 top-0 w-px h-full bg-lime-500"></div>
      </div>

      {/* Background Rings */}
      <div className="absolute inset-0 border border-white/5 rounded-full"></div>
      <div className="absolute inset-[18%] border border-white/5 rounded-full"></div>
      <div className="absolute inset-[36%] border border-white/5 rounded-full"></div>
      <div className="absolute inset-[54%] border border-white/5 rounded-full"></div>
      
      {/* Decorative Blips (Signal Noise) */}
      {blips.map((blip) => (
        <div
          key={blip.id}
          className="absolute blip rounded-full bg-lime-500/30"
          style={{
            left: `${blip.x}%`,
            top: `${blip.y}%`,
            width: `${blip.size}px`,
            height: `${blip.size}px`,
            animationDelay: `${blip.delay}s`
          }}
        />
      ))}

      {/* Signal Lines to Devices */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {!isScanning && devices.map((device) => {
          const x = 50 + (device.distance / 2) * Math.cos((device.angle * Math.PI) / 180);
          const y = 50 + (device.distance / 2) * Math.sin((device.angle * Math.PI) / 180);
          return (
            <line
              key={`line-${device.id}`}
              x1="50%"
              y1="50%"
              x2={`${x}%`}
              y2={`${y}%`}
              className="stroke-lime-500 line-draw"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
      
      {/* Center Point */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-lime-500 rounded-full shadow-[0_0_20px_rgba(132,204,22,1)] z-10"></div>
        <div className="w-12 h-12 bg-lime-500/10 rounded-full animate-ping"></div>
        <div className="absolute -bottom-12 whitespace-nowrap">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-lime-500/50 animate-pulse">
            {isScanning ? 'Scanning...' : 'Devices Found'}
          </span>
        </div>
      </div>

      {/* Radar Sonar Beam */}
      <div className="absolute inset-0 rounded-full signal-beam animate-[spin_4s_linear_infinite] pointer-events-none"></div>

      {/* Pulse Waves */}
      <div className="absolute inset-0 border border-lime-500/10 rounded-full radar-pulse"></div>
      <div className="absolute inset-0 border border-lime-500/5 rounded-full radar-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Nearby Devices */}
      {!isScanning && devices.map((device) => {
        const x = 50 + (device.distance / 2) * Math.cos((device.angle * Math.PI) / 180);
        const y = 50 + (device.distance / 2) * Math.sin((device.angle * Math.PI) / 180);
        
        return (
          <button
            key={device.id}
            onClick={() => onDeviceSelect(device)}
            className="absolute w-16 h-16 -ml-8 -mt-8 transition-all duration-700 orb-float group z-20 animate-in fade-in zoom-in duration-500"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative w-full h-full">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-2 rounded-2xl border border-lime-500/0 group-hover:border-lime-500/30 group-hover:scale-110 transition-all duration-500"></div>
              
              {/* Distance Label (Scan Effect) */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-lime-500 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-xl">
                  {Math.round(device.distance / 2)}m
                </div>
              </div>

              {/* Avatar Container */}
              <div className="relative w-full h-full rounded-2xl border-2 border-white/10 overflow-hidden bg-zinc-900 group-hover:border-lime-500 transition-all duration-300 shadow-2xl overflow-hidden">
                <img 
                  src={device.avatar} 
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
                  alt={device.username}
                />
                {/* Scanline Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-500/5 to-transparent h-[200%] -translate-y-full group-hover:animate-[scan_2s_linear_infinite]"></div>
              </div>

              {/* Username Tag */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 opacity-60 group-hover:opacity-100 group-hover:translate-y-1 transition-all pointer-events-none">
                <span className="text-[8px] font-black text-white whitespace-nowrap uppercase tracking-widest">{device.username}</span>
              </div>
            </div>
          </button>
        );
      })}

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};
