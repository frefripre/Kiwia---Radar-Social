
import React, { useState } from 'react';
import { generateVideoWithVeo, checkApiKey, openApiKeyDialog } from '../services/geminiService';

export const VideoGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Animate this bus stop scene with a warm morning sunlight, birds flying past, and people gently checking their phones.');
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
    setStatusMessage('Preparing your scene...');
    
    try {
      const messages = [
        'Analyzing colors and movement...',
        'Synthesizing cinematic frames...',
        'Almost there! Polishing the details...',
        'Finalizing your Kiwi Moment...'
      ];

      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length) {
          setStatusMessage(messages[msgIndex]);
          msgIndex++;
        }
      }, 8000);

      const url = await generateVideoWithVeo(prompt, image || undefined);
      setVideoUrl(url);
      clearInterval(interval);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key issue. Please select a valid key from a paid GCP project.");
        await openApiKeyDialog();
      } else {
        setError("Something went wrong during generation. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-lime-100">
        <h2 className="text-3xl font-extrabold text-lime-900 mb-2">Kiwi Moments 🎬</h2>
        <p className="text-lime-700 mb-8">Turn your waiting time into art. Upload a photo of your stop and let Veo animate it.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-lime-900 mb-2">1. Upload your stop (Optional)</label>
              <div className="relative border-2 border-dashed border-lime-200 rounded-2xl p-4 transition hover:border-lime-400">
                {image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden group">
                    <img src={image} className="w-full h-full object-cover" alt="Uploaded" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="text-4xl mb-2">📸</span>
                    <p className="text-sm text-lime-500">Click to upload or drag & drop</p>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-lime-900 mb-2">2. How should it feel?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 rounded-2xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm h-32"
                placeholder="Describe the animation..."
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-full font-bold text-lg transition shadow-lg ${
                isGenerating 
                  ? 'bg-lime-200 text-lime-500 cursor-not-allowed' 
                  : 'bg-lime-600 text-white hover:bg-lime-700 hover:shadow-xl'
              }`}
            >
              {isGenerating ? 'Generating Video...' : 'Animate with Veo'}
            </button>

            {error && (
              <p className="text-red-500 text-sm font-medium mt-2">⚠️ {error}</p>
            )}
          </div>

          {/* Result */}
          <div className="flex flex-col items-center justify-center bg-lime-50 rounded-2xl p-6 border border-lime-100">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 border-4 border-lime-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-lime-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">🥝</div>
                </div>
                <p className="text-lime-800 font-bold animate-pulse">{statusMessage}</p>
                <p className="text-xs text-lime-600 max-w-xs">High-quality video generation can take up to 2 minutes. Please don't close this tab.</p>
              </div>
            ) : videoUrl ? (
              <div className="w-full space-y-4">
                <h3 className="text-center font-bold text-lime-900">Your Kiwi Moment is ready!</h3>
                <video src={videoUrl} controls autoPlay loop className="w-full rounded-xl shadow-2xl border-4 border-white" />
                <button 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = videoUrl;
                    a.download = 'kiwi-moment.mp4';
                    a.click();
                  }}
                  className="w-full py-2 bg-white text-lime-600 border border-lime-200 rounded-xl font-bold hover:bg-lime-50"
                >
                  Download Video
                </button>
              </div>
            ) : (
              <div className="text-center text-lime-400">
                <div className="text-6xl mb-4">🎥</div>
                <p>Your AI-generated video will appear here</p>
                <p className="text-xs mt-2 italic">Requires a paid Google Cloud project API key</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-lime-500">
        Powered by Google Veo & Gemini • <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-lime-700">Billing Docs</a>
      </div>
    </div>
  );
};
