
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserProfile, NearbyDevice, ConnectionStatus } from './types';
import { Radar } from './components/Radar';
import { VideoGenerator } from './components/VideoGenerator';
import { ChatSection } from './components/ChatSection';
import { NearbyList } from './components/NearbyList';
import { Hero } from './components/Hero';
import { scanForRealDevices } from './services/bluetoothService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.SPLASH);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<NearbyDevice | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [viewMode, setViewMode] = useState<'radar' | 'list'>('radar');
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('kiwia_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setTimeout(() => setCurrentStep(AppState.RADAR), 2000);
      } catch (e) {
        localStorage.removeItem('kiwia_profile');
      }
    } else {
      if (currentStep === AppState.SPLASH) {
        const timer = setTimeout(() => setCurrentStep(AppState.KNOWN), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRealBluetoothScan = async () => {
    setIsScanning(true);
    try {
      const device = await scanForRealDevices();
      if (device) {
        setNearbyDevices(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (exists) return prev;
          return [device, ...prev];
        });
        setSelectedDevice(device);
        setConnectionStatus('idle');
      }
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRequestConnection = () => {
    setConnectionStatus('requesting');
    // Simulamos que el otro usuario acepta después de un momento
    setTimeout(() => {
      setConnectionStatus('accepted');
      setTimeout(() => {
        setCurrentStep(AppState.CHAT);
      }, 800);
    }, 2500);
  };

  const handleProfileSubmit = async () => {
    if (!usernameInput.trim()) return;
    const finalAvatar = tempAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameInput}`;
    const newProfile = { username: usernameInput, avatar: finalAvatar, isCustomImage: !!tempAvatar };
    setProfile(newProfile);
    localStorage.setItem('kiwia_profile', JSON.stringify(newProfile));
    setCurrentStep(AppState.RADAR);
    handleRealBluetoothScan();
  };

  const handleLogout = () => {
    if (confirm("¿Quieres borrar tu perfil y empezar de cero?")) {
      localStorage.removeItem('kiwia_profile');
      window.location.reload();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("La imagen es muy pesada. Intenta con una menor a 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setTempAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Fix: Added missing renderSplash function
  const renderSplash = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="w-24 h-24 bg-lime-500 rounded-[30px] flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(132,204,22,0.3)]">
        <span className="text-5xl">🥝</span>
      </div>
      <h1 className="mt-8 text-3xl font-black italic tracking-tighter text-white animate-bounce">KIWIA</h1>
    </div>
  );

  // Fix: Added missing renderPermissions function
  const renderPermissions = () => (
    <div className="flex flex-col items-center justify-center h-screen px-8 bg-black text-center">
      <div className="w-24 h-24 bg-zinc-900 rounded-[40px] flex items-center justify-center text-4xl mb-10 border border-white/5 shadow-2xl">
        📡
      </div>
      <h2 className="text-3xl font-black text-white mb-4 italic tracking-tight">ACTIVA TU RADAR</h2>
      <p className="text-white/40 text-sm mb-12 leading-relaxed font-medium max-w-[280px]">
        Kiwia necesita Bluetooth y Ubicación para detectar a otras personas en tu paradero de forma segura.
      </p>
      <button 
        onClick={() => setCurrentStep(AppState.PROFILE_SETUP)}
        className="w-full bg-lime-500 text-black py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-lime-500/20 active:scale-95 transition-all"
      >
        Conceder Permisos
      </button>
    </div>
  );

  // Fix: Added missing renderProfileSetup function
  const renderProfileSetup = () => (
    <div className="flex flex-col h-screen bg-black px-8 py-12 overflow-y-auto no-scrollbar">
      <div className="mb-12">
        <h2 className="text-5xl font-black text-white italic leading-tight tracking-tighter">CREA TU<br/><span className="text-lime-500">IDENTIDAD</span></h2>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-6">¿Cómo te verán en el paradero?</p>
      </div>

      <div className="flex flex-col items-center mb-16">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[48px] overflow-hidden bg-zinc-900 border-2 border-white/10 group-hover:border-lime-500 transition-all cursor-pointer shadow-2xl" onClick={() => fileInputRef.current?.click()}>
            <img 
              src={tempAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameInput || 'kiwia'}`} 
              className="w-full h-full object-cover" 
              alt="Avatar Preview" 
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-3 -right-3 w-14 h-14 bg-lime-500 text-black rounded-3xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
          >
            <span className="text-2xl">📸</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 block">Nombre de Usuario</label>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Ej. Viajero Galáctico"
            className="w-full bg-zinc-900 border border-white/5 rounded-[24px] py-6 px-8 text-white focus:outline-none focus:border-lime-500/50 transition-all font-bold placeholder:text-white/10 text-lg shadow-inner"
          />
        </div>

        <button
          onClick={handleProfileSubmit}
          disabled={!usernameInput.trim()}
          className="w-full bg-lime-500 text-black py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-lime-500/20 disabled:opacity-30 disabled:grayscale transition-all active:scale-95 mt-4"
        >
          Empezar a Escanear
        </button>
      </div>
    </div>
  );

  const renderRadarContent = () => (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-6 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowShareModal(true)} className="bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center text-sm border border-white/10 hover:bg-white/10 transition-colors">🔗</button>
          <h1 className="text-xl font-black text-white italic tracking-tighter">KIWIA</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="text-[9px] font-black text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors">Salir</button>
          <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden bg-zinc-900">
            <img src={profile?.avatar} className="w-full h-full object-cover" alt="Profile" />
          </div>
        </div>
      </header>

      <div className="px-6 py-4 flex gap-3">
        <div className="bg-zinc-900 p-1 rounded-2xl flex border border-white/5 flex-1 shadow-inner">
          <button onClick={() => setViewMode('radar')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === 'radar' ? 'bg-lime-500 text-black shadow-lg' : 'text-white/40'}`}>Radar</button>
          <button onClick={() => setViewMode('list')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === 'list' ? 'bg-lime-500 text-black shadow-lg' : 'text-white/40'}`}>Lista</button>
        </div>
        <button 
          onClick={handleRealBluetoothScan} 
          disabled={isScanning}
          className="bg-lime-500 text-black px-4 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
        >
          {isScanning ? '...' : 'SCAN'}
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'radar' ? (
          <Radar 
            devices={nearbyDevices} 
            isScanning={isScanning} 
            onDeviceSelect={(d) => { setSelectedDevice(d); setConnectionStatus('idle'); }} 
          />
        ) : (
          <div className="p-6 h-full overflow-y-auto">
            <NearbyList devices={nearbyDevices} onDeviceSelect={(d) => { setSelectedDevice(d); setConnectionStatus('idle'); }} />
          </div>
        )}
      </div>

      <nav className="px-10 py-6 bg-zinc-950 border-t border-white/5 flex justify-around">
        <button onClick={() => setCurrentStep(AppState.RADAR)} className={`flex flex-col items-center gap-1 ${currentStep === AppState.RADAR ? 'text-lime-500' : 'text-white/20'}`}>
          <span className="text-2xl">📡</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Radar</span>
        </button>
        <button onClick={() => setCurrentStep(AppState.MOMENTS)} className={`flex flex-col items-center gap-1 ${currentStep === AppState.MOMENTS ? 'text-lime-500' : 'text-white/20'}`}>
          <span className="text-2xl">🎬</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Moments</span>
        </button>
      </nav>

      {/* Device Detail / Handshake Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60] flex items-end" onClick={() => setSelectedDevice(null)}>
          <div className="w-full bg-zinc-950 border-t border-white/10 rounded-t-[48px] p-8 pb-12 animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
            
            <div className="flex flex-col items-center text-center mb-10">
              <div className="relative mb-6">
                <div className={`absolute -inset-4 bg-lime-500/20 rounded-full blur-2xl transition-all duration-1000 ${connectionStatus === 'requesting' ? 'animate-pulse scale-150' : 'scale-0'}`}></div>
                <img src={selectedDevice.avatar} className="relative w-32 h-32 rounded-[40px] object-cover border-4 border-white/5 shadow-2xl" alt="" />
                {connectionStatus === 'accepted' && (
                  <div className="absolute -bottom-2 -right-2 bg-lime-500 text-black w-10 h-10 rounded-2xl flex items-center justify-center animate-in zoom-in">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
              <h3 className="text-3xl font-black text-white italic tracking-tight">{selectedDevice.username}</h3>
              <p className="text-lime-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">A {Math.round(selectedDevice.distance/2)}m de distancia</p>
            </div>

            {connectionStatus === 'idle' && (
              <div className="grid grid-cols-1 gap-4">
                <button onClick={handleRequestConnection} className="bg-lime-500 text-black py-6 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-xl shadow-lime-500/20 active:scale-95 transition-all">Solicitar Conexión</button>
                <button onClick={() => setSelectedDevice(null)} className="text-white/20 font-black text-[10px] uppercase tracking-widest mt-2">Cancelar</button>
              </div>
            )}

            {connectionStatus === 'requesting' && (
              <div className="flex flex-col items-center py-6">
                <div className="flex gap-2 mb-4">
                  <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-200"></div>
                </div>
                <p className="text-white font-bold text-sm">Esperando que {selectedDevice.username} acepte...</p>
              </div>
            )}

            {connectionStatus === 'accepted' && (
              <div className="text-center py-6">
                <p className="text-lime-500 font-black text-xl italic uppercase tracking-tighter animate-pulse">¡Conexión Establecida!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case AppState.SPLASH: return renderSplash();
      case AppState.KNOWN: return <Hero onStart={() => setCurrentStep(AppState.PERMISSIONS)} />;
      case AppState.PERMISSIONS: return renderPermissions();
      case AppState.PROFILE_SETUP: return renderProfileSetup();
      case AppState.RADAR: return renderRadarContent();
      case AppState.MOMENTS: return (
        <div className="h-screen bg-black flex flex-col">
          <header className="p-6 flex items-center justify-between border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
            <button onClick={() => setCurrentStep(AppState.RADAR)} className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">← Volver</button>
            <h1 className="text-xl font-black text-white italic tracking-tighter">MOMENTS</h1>
          </header>
          <div className="flex-1 overflow-y-auto"><VideoGenerator /></div>
        </div>
      );
      case AppState.CHAT: return selectedDevice ? <ChatSection recipientName={selectedDevice.username} recipientAvatar={selectedDevice.avatar} onBack={() => { setCurrentStep(AppState.RADAR); setConnectionStatus('idle'); setSelectedDevice(null); }} /> : renderRadarContent();
      default: return renderRadarContent();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen shadow-2xl overflow-hidden bg-black font-['Plus_Jakarta_Sans'] text-white selection:bg-lime-500 selection:text-black">
      {renderContent()}
    </div>
  );
};

export default App;
