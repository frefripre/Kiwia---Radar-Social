
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const checkApiKey = async (): Promise<boolean> => {
  if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  return !!API_KEY;
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
    // Extract base64 and mime type
    const parts = imageUri.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const base64Data = parts[1];

    payload.image = {
      imageBytes: base64Data,
      mimeType: mimeType
    };
  }

  let operation = await ai.models.generateVideos(payload);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed - no URI returned");

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
