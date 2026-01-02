
import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, NearbyDevice } from './types';
import { Radar } from './components/Radar';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.SPLASH);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeChat, setActiveChat] = useState<NearbyDevice | null>(null);

  useEffect(() => {
    if (currentStep === AppState.SPLASH) {
      setTimeout(() => setCurrentStep(AppState.PERMISSIONS), 2500);
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
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="relative">
        <div className="text-7xl font-extrabold tracking-tighter animate-pulse">K</div>
        <div className="absolute -bottom-2 right-0 w-2 h-2 bg-white rounded-full"></div>
      </div>
      <p className="mt-4 text-xs tracking-[0.5em] text-white/40 font-light">KIWIA OFFLINE</p>
    </div>
  );

  const renderPermissions = () => (
    <div className="flex flex-col h-screen px-10 justify-center animate-in fade-in duration-1000">
      <h2 className="text-3xl font-extrabold mb-4">Prepárate.</h2>
      <p className="text-white/60 mb-10 leading-relaxed">
        Kiwia usa <span className="text-white font-bold">Bluetooth Low Energy</span> para conectarte con personas a tu alrededor sin usar datos.
      </p>
      <div className="space-y-4">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <span className="text-2xl">📡</span>
          <div>
            <p className="text-sm font-bold">Bluetooth 5.0</p>
            <p className="text-[11px] text-white/40">Para detección de cercanía</p>
          </div>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-sm font-bold">Ubicación</p>
            <p className="text-[11px] text-white/40">Requerido por Android para BLE</p>
          </div>
        </div>
      </div>
      <button 
        onClick={handleStart}
        className="mt-12 bg-white text-black py-4 rounded-full font-extrabold hover:scale-105 transition-transform"
      >
        CONCEDER ACCESO
      </button>
    </div>
  );

  const renderProfileSetup = () => (
    <div className="flex flex-col h-screen px-10 justify-center">
      <h2 className="text-2xl font-extrabold mb-8 text-center">Tu Identidad</h2>
      <div className="w-32 h-32 bg-white/5 rounded-full mx-auto mb-8 border border-white/10 flex items-center justify-center text-4xl">
        👤
      </div>
      <input 
        type="text" 
        placeholder="Nombre de usuario"
        className="bg-transparent border-b border-white/20 py-4 text-center text-xl focus:border-white outline-none transition-colors"
        onKeyDown={(e: any) => e.key === 'Enter' && handleProfileSubmit(e.target.value)}
      />
      <p className="text-center text-[10px] text-white/30 mt-4 italic">Presiona Enter para continuar</p>
    </div>
  );

  const renderRadar = () => (
    <div className="flex flex-col h-screen">
      <header className="p-8 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tighter">KIWIA</h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Escaneando...</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
          <img src={profile?.avatar} alt="Me" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <Radar onDeviceSelect={(d) => setActiveChat(d)} />
        <p className="mt-8 text-xs text-white/40 px-12 text-center">
          Toca un avatar para solicitar una conexión de chat privada.
        </p>
      </div>

      <nav className="p-10 flex justify-center gap-12">
        <button className="text-white">
          <span className="text-2xl block mb-1">📻</span>
          <span className="text-[8px] font-bold tracking-widest uppercase opacity-100">Radar</span>
        </button>
        <button className="text-white/30 hover:text-white transition-colors" onClick={() => setCurrentStep(AppState.KNOWN)}>
          <span className="text-2xl block mb-1">👥</span>
          <span className="text-[8px] font-bold tracking-widest uppercase">Conocidos</span>
        </button>
      </nav>

      {/* Modal de Solicitud de Chat */}
      {activeChat && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end">
          <div className="w-full bg-white text-black rounded-t-[40px] p-10 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-6 mb-8">
              <img src={activeChat.avatar} className="w-20 h-20 rounded-full border-4 border-black" alt="" />
              <div>
                <h3 className="text-2xl font-black">{activeChat.username}</h3>
                <p className="text-xs font-bold opacity-40 uppercase">A unos {Math.round(activeChat.distance / 10)} metros</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveChat(null)}
                className="flex-1 border-2 border-black py-4 rounded-2xl font-black uppercase text-sm"
              >
                Cancelar
              </button>
              <button 
                className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase text-sm"
              >
                Solicitar Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case AppState.SPLASH: return renderSplash();
      case AppState.PERMISSIONS: return renderPermissions();
      case AppState.PROFILE_SETUP: return renderProfileSetup();
      case AppState.RADAR: return renderRadar();
      default: return renderRadar();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen shadow-2xl overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default App;
