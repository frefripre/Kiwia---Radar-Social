
import React, { useState } from 'react';
import { generateVideoWithVeo, checkApiKey, openApiKeyDialog } from '../services/geminiService';

export const VideoGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Animate this bus stop scene with cinematic lighting, neon reflections, and smooth movement.');
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

  const handleGenerate = async () => {
    setError(null);
    const hasKey = await checkApiKey();
    if (!hasKey) {
      await openApiKeyDialog();
      // Assume success and proceed after dialog closes
    }

    setIsGenerating(true);
    setStatusMessage('Iniciando Veo 3.1...');
    
    try {
      const messages = [
        'Analizando geometría de la escena...',
        'Sintetizando frames cinemáticos...',
        'Renderizando texturas y luz...',
        'Finalizando tu Kiwi Moment...'
      ];

      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length) {
          setStatusMessage(messages[msgIndex]);
          msgIndex++;
        }
      }, 8000);

      const url = await generateVideoWithVeo(prompt, image || undefined, '9:16');
      setVideoUrl(url);
      clearInterval(interval);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key issue. Please select a valid key from a paid GCP project.");
        await openApiKeyDialog();
      } else {
        setError("Error de generación. Reintenta en unos momentos.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white leading-tight">Crea un<br/><span className="text-lime-500 italic">Kiwi Moment</span></h2>
        <p className="text-white/40 text-xs mt-3 leading-relaxed">Convierte la espera en arte. Sube una foto de tu paradero y deja que la IA de Google Veo le dé vida.</p>
      </div>

      <div className="space-y-6">
        {/* Upload */}
        <div className="relative group">
          <div className={`relative aspect-[9/16] rounded-[32px] overflow-hidden border-2 border-dashed transition-all ${image ? 'border-lime-500' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
            {image ? (
              <div className="relative h-full w-full">
                <img src={image} className="w-full h-full object-cover" alt="Uploaded" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-2xl hover:bg-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Sube tu paradero</p>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            )}
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5">
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Estilo de animación</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-transparent text-white text-sm focus:outline-none h-20 resize-none placeholder:text-white/10"
            placeholder="Describe cómo quieres que se vea..."
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl ${
            isGenerating 
              ? 'bg-zinc-800 text-white/20 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-lime-500 active:scale-95'
          }`}
        >
          {isGenerating ? 'Generando...' : 'Animar con Veo'}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
            <p className="text-red-500 text-[10px] font-bold text-center">⚠️ {error}</p>
          </div>
        )}

        {/* Video Overlay / Result */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex flex-col items-center justify-center p-10 text-center">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-2 border-lime-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-lime-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🥝</div>
            </div>
            <h3 className="text-xl font-black text-white mb-2">{statusMessage}</h3>
            <p className="text-white/40 text-xs max-w-xs leading-relaxed">La generación de video de alta calidad toma unos 2 minutos. No cierres esta ventana.</p>
          </div>
        )}

        {videoUrl && (
          <div className="fixed inset-0 bg-black z-[60] flex flex-col animate-in fade-in duration-700">
            <div className="flex-1 relative">
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              <button 
                onClick={() => setVideoUrl(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-8 pb-12 bg-zinc-950 flex gap-4">
              <button 
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = videoUrl;
                  a.download = 'kiwi-moment.mp4';
                  a.click();
                }}
                className="flex-1 bg-white text-black py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Descargar MP4
              </button>
              <button 
                onClick={() => setVideoUrl(null)}
                className="flex-1 bg-white/5 border border-white/10 text-white/60 py-5 rounded-3xl font-black uppercase text-xs tracking-widest"
              >
                Nuevo
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">Powered by Google Veo & Gemini</p>
      </div>
    </div>
  );
};
