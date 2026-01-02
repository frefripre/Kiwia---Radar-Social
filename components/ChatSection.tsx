
import React, { useState, useEffect, useRef } from 'react';
// Fixed: BusStop is not exported from types.ts
import { Message } from '../types';

export const ChatSection: React.FC = () => {
  // Fixed: Updated mock messages to use number timestamps (Date.now()) and added required status field to match Message interface
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'Mateo', text: '¿Alguien sabe si el 402 viene retrasado?', timestamp: Date.now(), status: 'delivered' },
    { id: '2', senderId: 'Elena', text: 'Sí, la app dice que está a 10 minutos aún.', timestamp: Date.now(), status: 'delivered' },
    { id: '3', senderId: 'Sofia', text: 'Hola a todos! Qué calor hace hoy en el paradero.', timestamp: Date.now(), status: 'delivered' },
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Fixed: Created message matching the interface (senderId instead of sender, number timestamp, and added status)
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'Me',
      text: inputText,
      timestamp: Date.now(),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate response
    setTimeout(() => {
      // Fixed: Mock response updated to match Message interface
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'Mateo',
        text: '¡Gracias por avisar!',
        timestamp: Date.now(),
        status: 'delivered',
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-lime-100">
      {/* Header */}
      <div className="bg-lime-500 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">🚌</div>
          <div>
            <h2 className="font-bold text-lg">Paradero Plaza Italia</h2>
            <p className="text-xs opacity-90">4 personas activas ahora</p>
          </div>
        </div>
        <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-lime-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            // Fixed: Replaced isMe property check with senderId comparison against 'Me'
            className={`flex flex-col ${msg.senderId === 'Me' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] font-semibold text-lime-700 mb-1 px-2">
              {/* Fixed: Replaced missing sender property with senderId */}
              {msg.senderId}
            </span>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                msg.senderId === 'Me'
                  ? 'bg-lime-600 text-white rounded-tr-none'
                  : 'bg-white text-lime-900 border border-lime-100 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
            {/* Fixed: Wrapped number timestamp in Date object to use toLocaleTimeString */}
            <span className="text-[9px] text-lime-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-lime-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 rounded-full border border-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
        />
        <button
          type="submit"
          className="p-2 bg-lime-600 text-white rounded-full hover:bg-lime-700 transition transform active:scale-90"
        >
          <svg className="w-5 h-5 fill-current rotate-90" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};
