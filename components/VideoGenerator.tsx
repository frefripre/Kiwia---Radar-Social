
import React, { useState } from 'react';
import { generateVideoWithVeo, checkApiKey, openApiKeyDialog } from '../services/geminiService';

const PRESETS = [
  {
    id: 'manifesto',
    label: 'Brand Manifesto',
    icon: '💎',
    prompt: 'A premium, high-end cinematic advertisement for Kiwia app. The scene shows a modern, neon-lit bus stop at night. Diverse people are looking at their phones, and glowing lime-green digital threads of light emerge from their devices, weaving through the air to connect them. A translucent kiwi fruit hologram pulses in the center. Sleek motion graphics, professional color grading with deep blacks and vibrant lime accents, 4k detail, bokeh background.'
  },
  {
    id: 'moments',
    label: 'AI Moments',
    icon: '🎬',
    prompt: 'A stylized transition from a real-life bus stop photo into a vibrant, AI-generated dreamscape. Swirling particles of light, cinematic camera movement, professional cinematography, theme of social connectivity and digital art.'
  },
  {
    id: 'cyber',
    label: 'Cyberpunk',
    icon: '🌃',
    prompt: 'Futuristic bus stop in a rainy Tokyo-style street. Neon signs reflecting in puddles, cinematic lighting, purple and lime green color palette, high-tech interface overlays.'
  }
];

export const VideoGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [activePreset, setActivePreset] = useState<string>('manifesto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (p: typeof PRESETS[0]) => {
    setPrompt(p.prompt);
    setActivePreset(p.id);
  };

  const handleGenerate = async () => {
    setError(null);
    setVideoUrl(null);
    
    const hasKey = await checkApiKey();
    if (!hasKey) {
      await openApiKeyDialog();
    }

    setIsGenerating(true);
    setStatusMessage('Iniciando Veo 3.1...');
    
    try {
      const messages = [
        'Analizando concepto de conectividad...',
        'Trazando hilos digitales de Kiwia...',
        'Renderizando atmósfera cinemática...',
        'Finalizando tu Moment de Marca...'
      ];

      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length) {
          setStatusMessage(messages[msgIndex]);
          msgIndex++;
        }
      }, 7000);

      const url = await generateVideoWithVeo(prompt, image || undefined, '9:16');
      setVideoUrl(url);
      clearInterval(interval);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key no válida. Selecciona una llave de un proyecto con facturación activa.");
        await openApiKeyDialog();
      } else {
        setError("Hubo un problema al conectar con el servidor de Veo. Reintenta.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white leading-[0.9] italic">
          Kiwia<br/><span className="text-lime-500">Moments</span>
        </h2>
        <p className="text-white/40 text-[11px] mt-4 leading-relaxed font-bold uppercase tracking-widest">
          Convierte la espera en una obra de arte cinemática con IA generativa.
        </p>
      </div>

      <div className="space-y-8">
        {/* Estilos Destacados */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Selecciona un Estilo</label>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-lime-500 rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-lime-500 rounded-full animate-ping delay-100"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPreset(p)}
                className={`p-4 rounded-[24px] border transition-all flex items-center justify-between group ${
                  activePreset === p.id 
                    ? 'bg-lime-500 border-lime-500 text-black shadow-[0_10px_30px_rgba(132,204,22,0.2)]' 
                    : 'bg-zinc-900 border-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest">{p.label}</span>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${activePreset === p.id ? 'border-black/20' : 'border-white/10 group-hover:border-white/30'}`}>
                   {activePreset === p.id && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Frame (Optional) */}
        {!videoUrl && (
          <div className="relative group">
            <div className={`relative aspect-[16/9] rounded-[32px] overflow-hidden border-2 border-dashed transition-all ${image ? 'border-lime-500 shadow-[0_0_30px_rgba(132,204,22,0.1)]' : 'border-white/5 bg-zinc-950 hover:border-white/20'}`}>
              {image ? (
                <div className="relative h-full w-full">
                  <img src={image} className="w-full h-full object-cover" alt="Base Frame" />
                  <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white p-2 rounded-2xl hover:bg-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-8 text-center group">
                  <div className="w-14 h-14 bg-white/5 rounded-[24px] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">🖼️</div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Añadir foto de referencia</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Loader */}
        {isGenerating && (
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[40px] p-10 text-center border border-white/5 animate-in zoom-in-95">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-lime-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-lime-500/10 rounded-full animate-pulse"></div>
            </div>
            <p className="text-lg font-black text-white mb-2">{statusMessage}</p>
            <div className="flex justify-center gap-1.5">
              <div className="w-1 h-1 bg-lime-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-lime-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-1 h-1 bg-lime-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {/* Video Result */}
        {videoUrl && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
            <div className="relative aspect-[9/16] rounded-[40px] overflow-hidden bg-zinc-900 shadow-2xl ring-1 ring-white/10">
              <video src={videoUrl} controls className="w-full h-full object-cover" autoPlay loop />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setVideoUrl(null)} className="bg-white/5 text-white/60 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">Nuevo</button>
              <a href={videoUrl} download="kiwia-promo.mp4" className="bg-lime-500 text-black py-5 rounded-[24px] text-center font-black text-[10px] uppercase tracking-widest shadow-xl shadow-lime-500/20 active:scale-95 transition-transform">Descargar</a>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isGenerating && !videoUrl && (
          <button
            onClick={handleGenerate}
            className="w-full relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 to-green-500 rounded-[24px] blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative bg-lime-500 text-black py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3">
              Generar Promo Kiwia
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
            </div>
          </button>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-[24px] text-center">
            <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-2">{error}</p>
            <button onClick={handleGenerate} className="text-[9px] font-black text-white/40 hover:text-white underline uppercase">Reintentar Conexión</button>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center pb-10">
        <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em] mb-4">Powered by Google Veo 3.1</p>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[9px] text-white/30 hover:text-white/60 underline">Configuración de Facturación GCP</a>
      </div>
    </div>
  );
};
