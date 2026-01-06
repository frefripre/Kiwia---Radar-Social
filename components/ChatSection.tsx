
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from '../services/firebase';

interface ChatSectionProps {
  recipientName: string;
  recipientAvatar: string;
  onBack: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ recipientName, recipientAvatar, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const myProfile = JSON.parse(localStorage.getItem('kiwia_profile') || '{"username": "Anónimo"}');

  // ID de sala único basado en orden alfabético para que ambos usuarios entren a la misma
  const chatId = [myProfile.username, recipientName].sort().join('_');

  useEffect(() => {
    if (!db) return;

    // Escuchar mensajes en tiempo real de Firestore
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !db) return;

    const text = inputText;
    setInputText('');

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: text,
        senderId: myProfile.username,
        timestamp: serverTimestamp(),
        status: 'sent'
      });
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080808] text-white">
      <header className="px-6 py-5 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-3">
            <img src={recipientAvatar} className="w-11 h-11 rounded-[18px] object-cover border border-white/10" alt="" />
            <div>
              <h2 className="font-black text-[15px] italic tracking-tight">{recipientName}</h2>
              <p className="text-[10px] font-bold text-lime-500/80 uppercase tracking-widest leading-none">Conectado vía Kiwia</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <p className="text-center text-white/20 text-[10px] uppercase font-black tracking-widest py-20">No hay mensajes aún. ¡Saluda!</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === myProfile.username;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`relative max-w-[80%] px-5 py-3.5 shadow-2xl ${
                isMe ? 'bg-zinc-900 text-white rounded-[24px] rounded-tr-[4px] border border-white/5' : 'bg-lime-500 text-black font-bold rounded-[24px] rounded-tl-[4px]'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-zinc-950/50 backdrop-blur-xl border-t border-white/5">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-lime-500/50 transition-all"
          />
          <button type="submit" className="w-14 h-14 bg-lime-500 text-black rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all">
            <svg className="w-6 h-6 fill-current rotate-90" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};
