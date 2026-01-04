
import { GoogleGenAI } from "@google/genai";

export const checkApiKey = async (): Promise<boolean> => {
  if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  return !!process.env.API_KEY;
};

export const openApiKeyDialog = async () => {
  if (typeof window.aistudio?.openSelectKey === 'function') {
    await window.aistudio.openSelectKey();
  }
};

export const generateVideoWithVeo = async (
  prompt: string,
  imageUri?: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  // Siempre crear una instancia nueva para usar la última llave seleccionada
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const config: any = {
    numberOfVideos: 1,
    resolution: '720p',
    aspectRatio: aspectRatio
  };

  const payload: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: config
  };

  if (imageUri) {
    const parts = imageUri.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const base64Data = parts[1];

    payload.image = {
      imageBytes: base64Data,
      mimeType: mimeType
    };
  }

  let operation = await ai.models.generateVideos(payload);

  // Polling para esperar a que el video esté listo
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Esperar 10 segundos entre cada chequeo
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed - no URI returned");

  // Es necesario incluir la llave de API al descargar el archivo MP4 resultante
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) throw new Error("Failed to download generated video");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
