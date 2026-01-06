
export interface UserProfile {
  username: string;
  avatar: string; // URL o ID de avatar predefinido
  isCustomImage: boolean;
}

export interface NearbyDevice {
  id: string;
  username: string;
  avatar: string;
  distance: number; // 0-100 para posición en radar
  angle: number; // 0-360 para posición
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export enum AppState {
  SPLASH = 'splash',
  PERMISSIONS = 'permissions',
  PROFILE_SETUP = 'profile_setup',
  RADAR = 'radar',
  CHAT = 'chat',
  KNOWN = 'known',
  MOMENTS = 'moments'
}

export type ConnectionStatus = 'idle' | 'requesting' | 'accepted' | 'declined';
