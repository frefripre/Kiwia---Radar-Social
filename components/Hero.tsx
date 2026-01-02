
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <div className="mb-8 relative">
        <div className="w-32 h-32 bg-lime-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
          <span className="text-6xl">🥝</span>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
          <span className="text-2xl">🚌</span>
        </div>
      </div>
      
      <h1 className="text-5xl font-extrabold text-lime-900 mb-4 tracking-tight">
        KiwiApp
      </h1>
      <p className="text-xl text-lime-800 mb-8 max-w-md font-medium">
        Don't just wait. Connect. Chat with people at your bus stop and make the wait fly by.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-lime-100 transition hover:shadow-md">
          <div className="text-3xl mb-3 text-lime-600">📍</div>
          <h3 className="font-bold text-lime-900 mb-1">Local Focus</h3>
          <p className="text-sm text-lime-700">See only people who are at your exact stop right now.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-lime-100 transition hover:shadow-md">
          <div className="text-3xl mb-3 text-lime-600">💬</div>
          <h3 className="font-bold text-lime-900 mb-1">Safe Chats</h3>
          <p className="text-sm text-lime-700">Encrypted, ephemeral conversations that end when the bus arrives.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-lime-100 transition hover:shadow-md">
          <div className="text-3xl mb-3 text-lime-600">🪄</div>
          <h3 className="font-bold text-lime-900 mb-1">Veo Moments</h3>
          <p className="text-sm text-lime-700">Turn your boring waits into cinematic AI-generated videos.</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-10 py-4 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
      >
        Get Started
      </button>
    </div>
  );
};
