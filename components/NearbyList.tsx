
import React from 'react';
import { NearbyDevice } from '../types';

interface NearbyListProps {
  devices: NearbyDevice[];
  onDeviceSelect: (device: NearbyDevice) => void;
}

export const NearbyList: React.FC<NearbyListProps> = ({ devices, onDeviceSelect }) => {
  return (
    <div className="w-full h-full flex flex-col px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Personas en este paradero ({devices.length})
        </h2>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-lime-500 animate-pulse"></div>
          <div className="w-1 h-1 rounded-full bg-lime-500 animate-pulse delay-75"></div>
          <div className="w-1 h-1 rounded-full bg-lime-500 animate-pulse delay-150"></div>
        </div>
      </div>

      <div className="space-y-3">
        {devices.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4 grayscale opacity-20">📡</div>
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Buscando señales...</p>
          </div>
        ) : (
          devices.map((device) => (
            <button
              key={device.id}
              onClick={() => onDeviceSelect(device)}
              className="w-full group relative flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/5 hover:border-lime-500/30 p-4 rounded-[24px] transition-all duration-300 active:scale-[0.98]"
            >
              {/* Avatar with Status */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 group-hover:border-lime-500/50 transition-colors">
                  <img src={device.avatar} alt={device.username} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center border-2 border-zinc-900">
                  <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(132,204,22,1)]"></div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-white group-hover:text-lime-500 transition-colors">{device.username}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Cerca de ti</span>
                  <div className="h-px w-4 bg-white/10"></div>
                  <span className="text-[10px] font-bold text-lime-500/80">{Math.round(device.distance / 2)}m</span>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <svg className="w-5 h-5 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Subtle Scanline Background */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 rounded-[24px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-500/20 to-transparent h-[200%] -translate-y-full animate-[scan_3s_linear_infinite]"></div>
              </div>
            </button>
          ))
        )}
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  