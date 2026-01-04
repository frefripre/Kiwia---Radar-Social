
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  limit,
  serverTimestamp 
} from "firebase/firestore";

interface ChatSectionProps {
  recipientName: string;
  recipientAvatar: string;
  onBack: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ recipientName, recipientAvatar, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Obtenemos mi perfil local para saber quién soy
  const myProfile = JSON.parse(localStorage.getItem('kiwia_profile') || '{"username": "Yo"}');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ESCUCHAR MENSAJES EN TIEMPO REAL DESDE FIREBASE
  useEffect(() => {
    // Definimos la colección de chats (en una app real usaríamos un ID de sala único)
    const q = query(
      collection(db, "chats"), 
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convertimos el timestamp de Firebase a número de JS
        timestamp: doc.data().timestamp?.toMillis() || Date.now()
      })) as Message[];
      
      setMessages(fetchedMessages);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    try {
      // ENVIAR A FIREBASE
      await addDoc(collection(db, "chats"), {
        senderId: myProfile.username,
        text: textToSend,
        timestamp: serverTimestamp(),
        status: 'sent'
      });
    } catch (err) {
      console.error("Error al enviar mensaje a Firebase:", err);
      alert("Configura tu Firebase en services/firebase.ts para chatear de verdad.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="bg-zinc-950/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
              <img src={recipientAvatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-sm">{recipientName}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest">Canal Firestore Live</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-[10px] font-black uppercase tracking-widest">No hay mensajes aún</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.senderId === myProfile.username ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-xl transition-all duration-300 ${
                msg.senderId === myProfile.username
                  ? 'bg-zinc-900 text-white rounded-tr-none border border-white/5'
                  : 'bg-lime-500 text-black font-medium rounded-tl-none'
              }`}
            >
              <div className="text-[8px] opacity-40 mb-1 font-black uppercase tracking-widest">
                {msg.senderId === myProfile.username ? 'Tú' : msg.senderId}
              </div>
              {msg.text}
              <div className="mt-1.5 flex items-center justify-end gap-1.5">
                <span className={`text-[9px] ${msg.senderId === myProfile.username ? 'text-white/40' : 'text-black/40'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 pb-8 bg-zinc-950 border-t border-white/5 flex gap-3">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl flex items-center px-4 focus-within:border-lime-500/50 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe algo real..."
            className="flex-1 bg-transparent py-3 text-sm focus:outline-none placeholder:text-white/20"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-12 h-12 bg-lime-500 text-black rounded-full flex items-center justify-center shadow-lg shadow-lime-500/20 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
        >
          <svg className="w-5 h-5 fill-current rotate-90" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};
