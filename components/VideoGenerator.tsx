
import React, { useState } from 'react';
import { generateVideoWithVeo, checkApiKey, openApiKeyDialog } from '../services/geminiService';

const PRESETS = [
  {
    id: 'promo',
    label: 'Video Promocional',
    icon: '✨',
    prompt: 'A high-end commercial for a mobile app called Kiwia. Cinematic shots of a glowing lime-green kiwi fruit floating above a modern bus stop at night. Transparent digital UI screens showing radar connections between people. Moody atmosphere, neon lighting, sleek motion graphics, professional photography style.'
  },
  {
    id: 'cyber',
    label: 'Cyberpunk',
    icon: '🌃',
    prompt: 'Futuristic bus stop in a rainy Tokyo-style street. Neon signs reflecting in puddles, cinematic lighting, purple and lime green color palette, high-tech interface overlays.'
  },
  {
    id: 'abstract',
    label: 'Abstracto',
    icon: '🌀',
    prompt: 'Ethereal flow of green and white liquid particles forming the shape of a kiwi. Digital waves and pulses representing connectivity and social networking. Minimalist, clean, 8k.'
  }
];

export const VideoGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [activePreset, setActivePreset] = useState<string>('promo');
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
      // Procedemos asumiendo que el usuario seleccionará una llave exitosamente
    }

    setIsGenerating(true);
    setStatusMessage('Iniciando Veo 3.1...');
    
    try {
      const messages = [
        'Analizando concepto creativo...',
        'Generando visuales de alta fidelidad...',
        'Sintetizando movimiento cinemático...',
        'Renderizando tu Promo Moment...'
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
        setError("API Key no válida o sin facturación. Por favor, selecciona una llave de un proyecto de pago.");
        await openApiKeyDialog();
      } else {
        setError("La generación tomó demasiado tiempo o hubo un error de red. Reintenta en unos momentos.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white leading-tight">Crea tu<br/><span className="text-lime-500 italic">Promo de Kiwia</span></h2>
        <p className="text-white/40 text-xs mt-3 leading-relaxed">Usa nuestros presets publicitarios para generar videos de impacto con la IA de Google Veo.</p>
      </div>

      <div className="space-y-6">
        {/* Presets */}
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Estilos Publicitarios</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPreset(p)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl border transition-all flex items-center gap-2 ${
                  activePreset === p.id 
                    ? 'bg-lime-500 border-lime-500 text-black' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div className="relative group">
          <div className={`relative aspect-[9/16] rounded-[32px] overflow-hidden border-2 border-dashed transition-all ${image ? 'border-lime-500' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
            {image ? (
              <div className="relative h-full w-full">
                <img src={image} className="w-full h-full object-cover" alt="Uploaded" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-2xl hover:bg-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                <span className="text-xs font-bold text-white/60">Sube una foto base</span>
                <span className="text-[10px] text-white/20 mt-2">(Opcional para modo texto)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Video Output or Progress */}
        {isGenerating && (
          <div className="bg-zinc-900 rounded-3xl p-8 text-center animate-pulse border border-white/5">
            <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-white">{statusMessage}</p>
            <p className="text-[10px] text-white/40 mt-2">Esto puede tomar hasta 2 minutos</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
            <p className="text-xs text-red-400 font-medium">{error}</p>
            <button 
              onClick={handleGenerate}
              className="mt-2 text-[10px] font-black uppercase tracking-widest text-white underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {videoUrl && (
          <div className="space-y-4 animate-in zoom-in-95 duration-500">
            <video 
              src={videoUrl} 
              controls 
              className="w-full aspect-[9/16] rounded-[32px] bg-zinc-900 shadow-2xl border border-white/10"
              autoPlay
              loop
            />
            <a 
              href={videoUrl} 
              download="kiwia-moment.mp4"
              className="block w-full bg-white text-black py-4 rounded-2xl text-center font-black text-xs uppercase tracking-[0.2em]"
            >
              Descargar Moment
            </a>
          </div>
        )}

        {/* Generate Button */}
        {!isGenerating && !videoUrl && (
          <button
            onClick={handleGenerate}
            className="w-full bg-lime-500 text-black py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-lime-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Generar con Veo 3.1
          </button>
        )}
        
        {videoUrl && !isGenerating && (
          <button
            onClick={() => setVideoUrl(null)}
            className="w-full bg-white/5 text-white/40 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            Crear otro
          </button>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[9px] text-white/20 hover:text-white/40 underline uppercase tracking-widest"
        >
          Documentación de Facturación Google Cloud
        </a>
      </div>
    </div>
  );
};
