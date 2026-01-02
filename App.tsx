
import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, NearbyDevice } from './types';
import { Radar } from './components/Radar';
import { VideoGenerator } from './components/VideoGenerator';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.SPLASH);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeChat, setActiveChat] = useState<NearbyDevice | null>(null);

  useEffect(() => {
    if (currentStep === AppState.SPLASH) {
      const timer = setTimeout(() => setCurrentStep(AppState.PERMISSIONS), 3500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleStart = () => {
    setCurrentStep(AppState.PROFILE_SETUP);
  };

  const handleProfileSubmit = (name: string) => {
    setProfile({ username: name, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + name, isCustomImage: false });
    setCurrentStep(AppState.RADAR);
  };

  const renderSplash = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-black overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-lime-500/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-lime-500/10 blur-[100px] rounded-full"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="text-8xl font-black tracking-tighter text-white animate-pulse">K</div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime-500 rounded-full shadow-[0_0_20px_rgba(132,204,22,0.8)]"></div>
        </div>
        <div className="h-0.5 w-12 bg-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-lime-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="mt-6 text-[10px] tracking-[0.8em] text-white/50 font-bold uppercase">Kiwia Reality</p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  const renderPermissions = () => (
    <div className="flex flex-col h-screen px-8 justify-center bg-zinc-950 text-white animate-in fade-in duration-1000">
      <div className="mb-10">
        <span className="text-lime-500 font-bold text-xs uppercase tracking-widest">Paso 01</span>
        <h2 className="text-4xl font-black mt-2 leading-tight">Conecta con tu entorno.</h2>
        <p className="text-white/50 mt-4 text-sm leading-relaxed max-w-[280px]">
          Kiwia crea una red local invisible para que hables con personas en tu paradero sin gastar tus datos.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { icon: '📡', title: 'Radar Bluetooth', desc: 'Detecta proximidad física segura' },
          { icon: '📍', title: 'Ubicación Local', desc: 'Solo para sincronizar paraderos' },
          { icon: '🛡️', title: 'Privacidad Total', desc: 'Chats efímeros y encriptados' }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-all cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold">{item.title}</p>
              <p className="text-[10px] text-white/40">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleStart}
        className="mt-12 w-full bg-lime-500 text-black py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(132,204,22,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
      >
        Activar Kiwia
      </button>
    </div>
  );

  const renderProfileSetup = () => (
    <div className="flex flex-col h-screen px-10 justify-center bg-black">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-black mb-2">¿Quién eres hoy?</h2>
        <p className="text-white/40 text-xs">Tu identidad es local y temporal.</p>
      </div>
      
      <div className="relative w-32 h-32 mx-auto mb-12">
        <div className="absolute inset-0 bg-lime-500 blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative w-full h-full bg-zinc-900 rounded-full border-2 border-white/10 flex items-center justify-center text-5xl shadow-2xl">
          👤
        </div>
      </div>

      <div className="relative">
        <input 
          autoFocus
          type="text" 
          placeholder="Apodo o nombre"
          className="w-full bg-transparent border-b-2 border-white/10 py-4 text-center text-2xl font-bold focus:border-lime-500 outline-none transition-all placeholder:text-white/10"
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              handleProfileSubmit(e.target.value);
            }
          }}
        />
        <div className="mt-6 flex flex-col items-center">
          <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold animate-bounce">Presiona Enter</div>
        </div>
      </div>
    </div>
  );

  const renderRadar = () => (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-8 pb-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tighter">KIWIA</h1>
            <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></div>
          </div>
          <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em]">Escaneo BLE Activo</p>
        </div>
        <div className="w-12 h-12 rounded-2xl border-2 border-white/10 overflow-hidden shadow-xl transform rotate-3">
          <img src={profile?.avatar} alt="Me" className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative px-6">
        <Radar onDeviceSelect={(d) => setActiveChat(d)} />
        
        <div className="absolute bottom-10 left-0 right-0 px-10 text-center">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
            Detectando dispositivos a menos de 50 metros<br/>
            <span className="text-white/50">Toca un avatar para conectar</span>
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="px-8 py-6 pb-10 flex justify-around items-center bg-zinc-950 border-t border-white/5">
        <button 
          className="flex flex-col items-center gap-1 group"
          onClick={() => setCurrentStep(AppState.RADAR)}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${currentStep === AppState.RADAR ? 'bg-lime-500 text-black scale-110 shadow-lg' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
            📡
          </div>
          <span className={`text-[8px] font-black tracking-widest uppercase ${currentStep === AppState.RADAR ? 'text-lime-500' : 'text-white/30'}`}>Radar</span>
        </button>
        
        <button 
          className="flex flex-col items-center gap-1 group"
          onClick={() => setCurrentStep(AppState.MOMENTS)}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${currentStep === AppState.MOMENTS ? 'bg-lime-500 text-black scale-110 shadow-lg' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
            🎬
          </div>
          <span className={`text-[8px] font-black tracking-widest uppercase ${currentStep === AppState.MOMENTS ? 'text-lime-500' : 'text-white/30'}`}>Moments</span>
        </button>

        <button 
          className="flex flex-col items-center gap-1 group text-white/20"
          disabled
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
            👤
          </div>
          <span className="text-[8px] font-black tracking-widest uppercase">Red</span>
        </button>
      </nav>

      {/* Connection Request Modal */}
      {activeChat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end px-4 pb-4">
          <div className="w-full bg-zinc-900 border border-white/10 rounded-[40px] p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="flex items-center gap-6 mb-10">
              <div className="relative">
                <img src={activeChat.avatar} className="w-24 h-24 rounded-3xl border-2 border-white/20 object-cover transform -rotate-3 shadow-2xl" alt="" />
                <div className="absolute -bottom-2 -right-2 bg-lime-500 text-black text-[10px] font-black px-2 py-1 rounded-lg">ONLINE</div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{activeChat.username}</h3>
                <p className="text-xs font-bold text-lime-500 uppercase tracking-widest mt-1">A {Math.round(activeChat.distance / 5)} metros de ti</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveChat(null)}
                className="bg-white/5 text-white/60 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all border border-white/5"
              >
                Ignorar
              </button>
              <button 
                className="bg-lime-500 text-black py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-lg shadow-lime-500/20 active:scale-95 transition-all"
              >
                Enviar Saludo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMoments = () => (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <header className="p-8 pb-0 flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep(AppState.RADAR)}
          className="text-white/40 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <span>←</span> Radar
        </button>
        <div className="text-right">
          <h1 className="text-xl font-black text-white tracking-tighter italic">MOMENTS</h1>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        <VideoGenerator />
      </div>

      <nav className="px-8 py-6 pb-10 flex justify-around items-center bg-zinc-950 border-t border-white/5">
        <button onClick={() => setCurrentStep(AppState.RADAR)} className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 group-hover:bg-white/10 flex items-center justify-center text-2xl transition-all">
            📡
          </div>
          <span className="text-[8px] font-black tracking-widest uppercase text-white/30">Radar</span>
        </button>
        <button onClick={() => setCurrentStep(AppState.MOMENTS)} className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-2xl bg-lime-500 text-black scale-110 shadow-lg flex items-center justify-center text-2xl transition-all">
            🎬
          </div>
          <span className="text-[8px] font-black tracking-widest uppercase text-lime-500">Moments</span>
        </button>
        <button disabled className="flex flex-col items-center gap-1 opacity-20">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
            👤
          </div>
          <span className="text-[8px] font-black tracking-widest uppercase">Red</span>
        </button>
      </nav>
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case AppState.SPLASH: return renderSplash();
      case AppState.PERMISSIONS: return renderPermissions();
      case AppState.PROFILE_SETUP: return renderProfileSetup();
      case AppState.RADAR: return renderRadar();
      case AppState.MOMENTS: return renderMoments();
      default: return renderRadar();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen shadow-2xl overflow-hidden bg-black font-['Plus_Jakarta_Sans']">
      {renderContent()}
    </div>
  );
};

export default App;
