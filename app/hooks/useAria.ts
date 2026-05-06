import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AriaPersonality = 'friendly' | 'formal' | 'hype' | 'calm';
export type AriaLanguage = 'en' | 'yo' | 'ha' | 'ig' | 'pcm' | 'fr';
export type AriaVoice = 'feminine-soft' | 'feminine-bold' | 'neutral';
export type AriaEmotion = 'idle' | 'speaking' | 'listening' | 'thinking' | 'happy' | 'surprised';

interface AriaState {
  name: string;
  voice: AriaVoice;
  personality: AriaPersonality;
  language: AriaLanguage;
  emotion: AriaEmotion;
  isOnboarded: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  setName: (name: string) => void;
  setVoice: (voice: AriaVoice) => void;
  setPersonality: (p: AriaPersonality) => void;
  setLanguage: (l: AriaLanguage) => void;
  setEmotion: (e: AriaEmotion) => void;
  setIsSpeaking: (v: boolean) => void;
  setIsListening: (v: boolean) => void;
  setOnboarded: () => void;
  reset: () => void;
}

export const useAria = create<AriaState>()(
  persist(
    (set) => ({
      name: 'Aria',
      voice: 'feminine-soft',
      personality: 'friendly',
      language: 'en',
      emotion: 'idle',
      isOnboarded: false,
      isSpeaking: false,
      isListening: false,
      setName: (name) => set({ name }),
      setVoice: (voice) => set({ voice }),
      setPersonality: (personality) => set({ personality }),
      setLanguage: (language) => set({ language }),
      setEmotion: (emotion) => set({ emotion }),
      setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
      setIsListening: (isListening) => set({ isListening }),
      setOnboarded: () => set({ isOnboarded: true }),
      reset: () => set({ name: 'Aria', voice: 'feminine-soft', personality: 'friendly', language: 'en', isOnboarded: false }),
    }),
    { name: 'aria-settings' }
  )
);