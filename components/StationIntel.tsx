
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface StationIntelProps {
  onClose: () => void;
  userCoords: {lat: number, lng: number} | null;
}

export const StationIntel: React.FC<StationIntelProps> = ({ onClose, userCoords }) => {
  const [intel, setIntel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<{title: string, uri: string}[]>([]);

  useEffect(() => {
    const fetchIntel = async () => {
      setIsLoading(true);
      // Initialize GoogleGenAI with the required named parameter and environment variable.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      try {
        const lat = userCoords?.lat || -33.4372;
        const lng = userCoords?.lng || -70.6341;

        // Using gemini-3-pro-preview for advanced reasoning and Google Search tool usage.
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: "Actúa como 'Kiwia Intel'. Analiza mi paradero actual. Dime qué lugares interesantes hay a menos de 10 min caminando (cafés, arte urbano, tiendas raras) y dame un dato curioso o noticia reciente sobre esta zona. Responde en tono Gen-Z, vibrante y muy conciso.",
          config: {
            tools: [{ googleSearch: {} }],
          }
        });

        // Extracting generated text using the property directly.
        setIntel(response.text || "No se pudo obtener información del paradero.");
        
        // Always extract and list grounding URLs when using Google Search.
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const extractedLinks = chunks.map((c: any) => {
          if (c.maps) return { title: c.maps.title || "Ver en Maps", uri: c.maps.uri };
          if (c.web) return { title: c.web.title || "Saber más", uri: c.web.uri };
          return null;
        }).filter(Boolean);

        setLinks(extractedLinks as any);
      } catch (err) {
        setIntel("Radar bloqueado. La señal es débil en este paradero, intenta en un momento.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntel();
  }, [userCoords]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[44px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 to-transparent"></div>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Station <span className="text-lime-400">Intel</span></h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse"></div>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Analizando frecuencias locales</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-6">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-lime-400/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
             </div>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] animate-pulse">Consultando Google Search...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-900/40 rounded-[32px] p-6 border border-white/5">
              <p className="text-sm leading-relaxed text-white/80 italic font-medium">{intel}</p>
            </div>
            
            {links.length > 0 && (
              <div className="space-y-3">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Fuentes encontradas:</p>
                <div className="flex flex-wrap gap-2">
                  {links.map((link, i) => (
                    <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 text-white/80 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-lime-400 hover:text-black transition-all border border-white/5">
                      📍 {link.title.length > 18 ? link.title.slice(0, 15) + '...' : link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <button onClick={onClose} className="w-full bg-lime-400 text-black py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-lime-400/10">Cerrar Reporte</button>
          </div>
        )}
      </div>
    </div>
  );
};
