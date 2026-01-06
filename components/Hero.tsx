
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-8 bg-black overflow-y-auto no-scrollbar">
      <div className="mb-10 relative animate-in fade-in zoom-in duration-1000">
        <div className="w-32 h-32 bg-lime-500 rounded-[40px] flex items-center justify-center shadow-[0_0_50px_rgba(132,204,22,0.3)] animate-bounce">
          <span className="text-6xl">🥝</span>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-2 shadow-xl">
          <span className="text-2xl">🚌</span>
        </div>
      </div>
      
      <h1 className="text-6xl font-black text-white mb-4 tracking-tighter italic animate-in slide-in-from-top duration-700">
        KIWIA
      </h1>
      <p className="text-white/40 mb-12 max-w-xs font-medium text-sm leading-relaxed animate-in fade-in delay-300 duration-1000">
        No solo esperes. Conecta. Chatea con las personas en tu paradero y haz que el tiempo vuele.
      </p>
      
      <div className="grid grid-cols-1 gap-4 mb-12 w-full max-w-xs animate-in slide-in-from-bottom duration-1000">
        <div className="bg-zinc-900 p-5 rounded-3xl border border-white/5 flex items-center gap-4 text-left">
          <span className="text-2xl">📍</span>
          <div>
            <h3 className="font-black text-white text-[11px] uppercase tracking-widest">Enfoque Local</h3>
            <p className="text-[10px] text-white/30 font-medium">Solo personas en tu paradero actual.</p>
          </div>
        </div>
        <div className="bg-zinc-900 p-5 rounded-3xl border border-white/5 flex items-center gap-4 text-left">
          <span className="text-2xl">💬</span>
          <div>
            <h3 className="font-black text-white text-[11px] uppercase tracking-widest">Chat Efímero</h3>
            <p className="text-[10px] text-white/30 font-medium">Conversaciones que expiran al subir al bus.</p>
          </div>
        </div>
        <div className="bg-zinc-900 p-5 rounded-3xl border border-white/5 flex items-center gap-4 text-left">
          <span className="text-2xl">🎬</span>
          <div>
            <h3 className="font-black text-white text-[11px] uppercase tracking-widest">Veo Moments</h3>
            <p className="text-[10px] text-white/30 font-medium">Crea promos cinematográficas con IA.</p>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-xs px-10 py-5 bg-lime-500 text-black font-black rounded-3xl text-sm shadow-[0_20px_40px_rgba(132,204,22,0.2)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em]"
      >
        Entrar al Radar
      </button>
    </div>
  );
};
