
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserProfile, NearbyDevice } from './types';
import { Radar } from './components/Radar';
import { VideoGenerator } from './components/VideoGenerator';
import { ChatSection } from './components/ChatSection';
import { NearbyList } from './components/NearbyList';
import { scanForRealDevices } from './services/bluetoothService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.SPLASH);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<NearbyDevice | null>(null);
  const [viewMode, setViewMode] = useState<'radar' | 'list'>('radar');
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar perfil de localStorage al iniciar
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
        const timer = setTimeout(() => setCurrentStep(AppState.PERMISSIONS), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Simular dispositivos cercanos
  useEffect(() => {
    if (currentStep === AppState.RADAR) {
      setIsScanning(true);
      const mockDevices: NearbyDevice[] = [
        { id: '1', username: 'Elena_V', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', distance: 60, angle: 45 },
        { id: '2', username: 'Marcos.dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos', distance: 40, angle: 160 },
      ];
      const timer = setTimeout(() => {
        setNearbyDevices(mockDevices);
        setIsScanning(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleProfileSubmit = (name: string) => {
    const finalAvatar = tempAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
    const newProfile = { username: name, avatar: finalAvatar, isCustomImage: !!tempAvatar };
    setProfile(newProfile);
    localStorage.setItem('kiwia_profile', JSON.stringify(newProfile));
    setCurrentStep(AppState.RADAR);
  };

  const handleLogout = () => {
    if (confirm("¿Quieres borrar tu perfil y empezar de cero?")) {
      localStorage.removeItem('kiwia_profile');
      window.location.reload();
    }
  };

  const handleRealBluetoothScan = async () => {
    setIsScanning(true);
    const device = await scanForRealDevices();
    if (device) {
      setNearbyDevices(prev => [device, ...prev.filter(d => d.id !== device.id)]);
      setSelectedDevice(device);
    }
    setIsScanning(false);
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

  const renderSplash = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="text-8xl font-black text-white animate-pulse">K</div>
      <div className="mt-4 w-12 h-1 bg-lime-500 rounded-full animate-bounce"></div>
      <p className="mt-6 text-[10px] tracking-[0.8em] text-white/50 font-bold uppercase">Kiwia Reality</p>
    </div>
  );

  const renderProfileSetup = () => (
    <div className="flex flex-col h-screen px-10 justify-center bg-black animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-center text-white mb-8">Crea tu identidad</h2>
      <div className="relative w-40 h-40 mx-auto mb-8 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <div className="absolute inset-0 bg-lime-500/20 blur-2xl rounded-full"></div>
        <div className="relative w-full h-full bg-zinc-900 rounded-[40px] border-2 border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-lime-500">
          {tempAvatar ? <img src={tempAvatar} className="w-full h-full object-cover" /> : <span className="text-4xl">📸</span>}
        </div>
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        <div className="absolute -bottom-2 right-0 bg-lime-500 text-black p-2 rounded-xl text-xs font-black shadow-lg">EDITAR</div>
      </div>
      <input 
        autoFocus
        type="text" 
        placeholder="Tu apodo en el bus..."
        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-center text-2xl font-bold focus:border-lime-500 outline-none text-white"
        onKeyDown={(e: any) => e.key === 'Enter' && e.target.value.trim() && handleProfileSubmit(e.target.value)}
      />
      <button 
        onClick={(e: any) => {
          const val = (e.target.previousSibling as HTMLInputElement).value;
          if (val) handleProfileSubmit(val);
        }}
        className="mt-10 bg-lime-500 text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl"
      >
        Empezar a Escanear
      </button>
    </div>
  );

  const renderRadar = () => (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-6 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowShareModal(true)} className="bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center text-sm border border-white/10 hover:bg-white/10 transition-colors">🔗</button>
          <h1 className="text-xl font-black text-white italic tracking-tighter">KIWIA</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="text-[9px] font-black text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors">Salir</button>
          <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden">
            <img src={profile?.avatar} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="px-6 py-4 flex gap-3">
        <div className="bg-zinc-900 p-1 rounded-2xl flex border border-white/5 flex-1">
          <button onClick={() => setViewMode('radar')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === 'radar' ? 'bg-lime-500 text-black' : 'text-white/40'}`}>Radar</button>
          <button onClick={() => setViewMode('list')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === 'list' ? 'bg-lime-500 text-black' : 'text-white/40'}`}>Lista</button>
        </div>
        <button onClick={handleRealBluetoothScan} className="bg-lime-500 text-black px-4 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg">SCAN</button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'radar' ? <Radar devices={nearbyDevices} isScanning={isScanning} onDeviceSelect={setSelectedDevice} /> : <div className="p-6 h-full overflow-y-auto"><NearbyList devices={nearbyDevices} onDeviceSelect={setSelectedDevice} /></div>}
      </div>

      <nav className="px-10 py-6 bg-zinc-950 border-t border-white/5 flex justify-around">
        <button onClick={() => setCurrentStep(AppState.RADAR)} className={`flex flex-col items-center gap-1 ${currentStep === AppState.RADAR ? 'text-lime-500' : 'text-white/20'}`}>
          <span className="text-2xl">📡</span>
          <span className="text-[8px] font-black uppercase">Radar</span>
        </button>
        <button onClick={() => setCurrentStep(AppState.MOMENTS)} className={`flex flex-col items-center gap-1 ${currentStep === AppState.MOMENTS ? 'text-lime-500' : 'text-white/20'}`}>
          <span className="text-2xl">🎬</span>
          <span className="text-[8px] font-black uppercase">Moments</span>
        </button>
      </nav>

      {/* Modal para Compartir */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8" onClick={() => setShowShareModal(false)}>
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] text-center w-full max-w-xs animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-white font-black text-xl mb-2">Invita a alguien</h3>
            <p className="text-white/40 text-xs mb-6">Copia este link y envíalo a tu amigo en el paradero para chatear.</p>
            <input readOnly value={window.location.href} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-[10px] text-lime-500 mb-4 text-center overflow-hidden text-ellipsis" />
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("¡Link copiado!"); }} className="w-full bg-lime-500 text-black py-4 rounded-2xl font-black text-xs uppercase">Copiar Link</button>
          </div>
        </div>
      )}

      {selectedDevice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end p-4" onClick={() => setSelectedDevice(null)}>
          <div className="w-full bg-zinc-900 border border-white/10 rounded-[40px] p-8 animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-6 mb-8">
              <img src={selectedDevice.avatar} className="w-20 h-20 rounded-3xl object-cover border-2 border-lime-500/30" />
              <div>
                <h3 className="text-2xl font-black text-white">{selectedDevice.username}</h3>
                <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest">Dispositivo Cercano</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setSelectedDevice(null)} className="bg-white/5 text-white/40 py-4 rounded-2xl font-bold text-xs">Cerrar</button>
              <button onClick={() => setCurrentStep(AppState.CHAT)} className="bg-lime-500 text-black py-4 rounded-2xl font-black text-xs shadow-lg">Chat Local</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case AppState.SPLASH: return renderSplash();
      case AppState.PROFILE_SETUP: return renderProfileSetup();
      case AppState.RADAR: return renderRadar();
      case AppState.MOMENTS: return (
        <div className="h-screen bg-black flex flex-col">
          <header className="p-6 flex items-center justify-between border-b border-white/5">
            <button onClick={() => setCurrentStep(AppState.RADAR)} className="text-white/40 text-xs font-bold uppercase">← Radar</button>
            <h1 className="text-xl font-black text-white italic">MOMENTS</h1>
          </header>
          <div className="flex-1 overflow-y-auto"><VideoGenerator /></div>
        </div>
      );
      case AppState.CHAT: return selectedDevice ? <ChatSection recipientName={selectedDevice.username} recipientAvatar={selectedDevice.avatar} onBack={() => setCurrentStep(AppState.RADAR)} /> : renderRadar();
      default: return renderRadar();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen shadow-2xl overflow-hidden bg-black font-['Plus_Jakarta_Sans'] text-white">
      {renderContent()}
    </div>
  );
};

export default App;
