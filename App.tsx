
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserProfile, NearbyDevice, ConnectionStatus } from './types';
import { Radar } from './components/Radar';
import { VideoGenerator } from './components/VideoGenerator';
import { ChatSection } from './components/ChatSection';
import { NearbyList } from './components/NearbyList';
import { Hero } from './components/Hero';
import { scanForRealDevices } from './services/bluetoothService';
import { isConfigDefault, db } from './services/firebase';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.SPLASH);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<NearbyDevice | null>(null);
  const [viewMode, setViewMode] = useState<'radar' | 'list'>('radar');
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('kiwia_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setTimeout(() => setCurrentStep(AppState.RADAR), 1500);
      } catch (e) {
        localStorage.removeItem('kiwia_profile');
        setCurrentStep(AppState.KNOWN);
      }
    } else {
      const timer = setTimeout(() => setCurrentStep(AppState.KNOWN), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRealBluetoothScan = async () => {
    setIsScanning(true);
    try {
      const device = await scanForRealDevices();
      if (device) {
        setNearbyDevices(prev => {
          if (prev.find(d => d.id === device.id)) return prev;
          return [device, ...prev];
        });
        setSelectedDevice(device);
      } else {
        // Fallback demo si no hay bluetooth real
        const demoUser: NearbyDevice = {
          id: 'demo-1',
          username: 'Pasajero_Kiwi',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kiwi',
          distance: 45,
          angle: 120
        };
        setNearbyDevices([demoUser]);
      }
    } finally {
      setTimeout(() => setIsScanning(false), 1500);
    }
  };

  const handleProfileSubmit = () => {
    if (!usernameInput.trim()) return;
    const finalAvatar = tempAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameInput}`;
    const newProfile = { username: usernameInput, avatar: finalAvatar, isCustomImage: !!tempAvatar };
    setProfile(newProfile);
    localStorage.setItem('kiwia_profile', JSON.stringify(newProfile));
    setCurrentStep(AppState.RADAR);
    handleRealBluetoothScan();
  };

  const renderContent = () => {
    switch (currentStep) {
      case AppState.SPLASH:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-black">
            <div className="w-24 h-24 bg-lime-500 rounded-[30px] flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(132,204,22,0.3)]">
              <span className="text-5xl">🥝</span>
            </div>
            <h1 className="mt-8 text-3xl font-black italic tracking-tighter text-white">KIWIA</h1>
          </div>
        );
      case AppState.KNOWN: return <Hero onStart={() => setCurrentStep(AppState.PERMISSIONS)} />;
      case AppState.PERMISSIONS:
        return (
          <div className="flex flex-col items-center justify-center h-screen px-8 bg-black text-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-[40px] flex items-center justify-center text-4xl mb-10 border border-white/5 shadow-2xl">📡</div>
            <h2 className="text-3xl font-black text-white mb-4 italic tracking-tight uppercase">Activa el Radar</h2>
            <p className="text-white/40 text-sm mb-12 max-w-[280px]">Necesitamos Bluetooth para detectar personas cerca de tu paradero.</p>
            <button onClick={() => setCurrentStep(AppState.PROFILE_SETUP)} className="w-full bg-lime-500 text-black py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em]">Permitir Acceso</button>
          </div>
        );
      case AppState.PROFILE_SETUP:
        return (
          <div className="flex flex-col h-screen bg-black px-8 py-12">
            <h2 className="text-5xl font-black text-white italic tracking-tighter mb-12 uppercase">Tu<br/><span className="text-lime-500">Perfil</span></h2>
            <div className="flex flex-col items-center mb-16">
              <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-40 h-40 rounded-[48px] overflow-hidden bg-zinc-900 border-2 border-white/10">
                  <img src={tempAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameInput || 'kiwia'}`} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-lime-500 text-black w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl">📸</div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setTempAvatar(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
            </div>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Nombre de usuario..."
              className="w-full bg-zinc-900 border border-white/5 rounded-[24px] py-6 px-8 text-white focus:outline-none focus:border-lime-500/50 mb-6 font-bold"
            />
            <button onClick={handleProfileSubmit} disabled={!usernameInput.trim()} className="w-full bg-lime-500 text-black py-6 rounded-[32px] font-black uppercase tracking-widest disabled:opacity-30 transition-all">Empezar</button>
          </div>
        );
      case AppState.RADAR:
        return (
          <div className="flex flex-col h-screen bg-black">
            {isConfigDefault && (
              <div className="bg-orange-500 text-black text-[9px] font-black py-1.5 px-4 text-center uppercase tracking-widest">
                Modo Demo: Configura Firebase para habilitar el chat real.
              </div>
            )}
            <header className="p-6 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md border-b border-white/5">
              <span className="text-lime-500 font-black italic tracking-tighter text-xl">KIWIA</span>
              <button className="w-9 h-9 rounded-xl border border-white/10 overflow-hidden" onClick={() => { if(confirm("¿Cerrar sesión?")){ localStorage.removeItem('kiwia_profile'); location.reload(); } }}>
                <img src={profile?.avatar} className="w-full h-full object-cover" alt="" />
              </button>
            </header>

            <div className="px-6 py-4 flex gap-3">
              <div className="bg-zinc-900 p-1 rounded-2xl flex border border-white/5 flex-1 shadow-inner">
                <button onClick={() => setViewMode('radar')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'radar' ? 'bg-lime-500 text-black' : 'text-white/40'}`}>Radar</button>
                <button onClick={() => setViewMode('list')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-lime-500 text-black' : 'text-white/40'}`}>Lista</button>
              </div>
              <button onClick={handleRealBluetoothScan} className="bg-white/5 text-white/60 px-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 active:scale-95 transition-all">Scan</button>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              {viewMode === 'radar' ? (
                <Radar devices={nearbyDevices} isScanning={isScanning} onDeviceSelect={setSelectedDevice} />
              ) : (
                <div className="p-6 h-full w-full overflow-y-auto"><NearbyList devices={nearbyDevices} onDeviceSelect={setSelectedDevice} /></div>
              )}
            </div>

            <nav className="px-12 py-8 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 flex justify-between items-center">
              {/* Fix: Use type assertion to bypass narrowing when checking nav button state within the RADAR case */}
              <button onClick={() => setCurrentStep(AppState.RADAR)} className={`flex flex-col items-center gap-2 ${(currentStep as AppState) === AppState.RADAR ? 'text-lime-500' : 'text-white/20'}`}>
                <div className="text-2xl">📡</div>
                <span className="text-[8px] font-black uppercase tracking-widest">Radar</span>
              </button>
              <button onClick={() => setCurrentStep(AppState.MOMENTS)} className={`flex flex-col items-center gap-2 ${(currentStep as AppState) === AppState.MOMENTS ? 'text-lime-500' : 'text-white/20'}`}>
                <div className="text-2xl">🎬</div>
                <span className="text-[8px] font-black uppercase tracking-widest">Moments</span>
              </button>
            </nav>

            {selectedDevice && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-end" onClick={() => setSelectedDevice(null)}>
                <div className="w-full bg-zinc-950 border-t border-white/10 rounded-t-[40px] p-8 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
                  <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-10"></div>
                  <div className="flex flex-col items-center text-center mb-10">
                    <img src={selectedDevice.avatar} className="w-32 h-32 rounded-[40px] object-cover mb-6 border-4 border-lime-500/20" alt="" />
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedDevice.username}</h3>
                    <p className="text-lime-500 text-[10px] font-black uppercase tracking-widest mt-3">Aprox. {Math.round(selectedDevice.distance/2)}m</p>
                  </div>
                  <button onClick={() => setCurrentStep(AppState.CHAT)} className="w-full bg-lime-500 text-black py-6 rounded-[28px] font-black uppercase tracking-widest shadow-xl shadow-lime-400/10 active:scale-95 transition-all">Abrir Chat</button>
                </div>
              </div>
            )}
          </div>
        );
      case AppState.MOMENTS:
        return (
          <div className="h-screen bg-black flex flex-col">
            <header className="p-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
              <button onClick={() => setCurrentStep(AppState.RADAR)} className="text-white/40 text-[9px] font-black uppercase tracking-widest">← Volver</button>
              <span className="text-lime-500 font-black italic tracking-tighter text-lg">MOMENTS</span>
              <div className="w-8"></div>
            </header>
            <div className="flex-1 overflow-y-auto"><VideoGenerator /></div>
          </div>
        );
      case AppState.CHAT:
        return selectedDevice ? <ChatSection recipientName={selectedDevice.username} recipientAvatar={selectedDevice.avatar} onBack={() => { setCurrentStep(AppState.RADAR); setSelectedDevice(null); }} /> : null;
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen shadow-2xl overflow-hidden bg-black text-white">
      {renderContent()}
    </div>
  );
};

export default App;
