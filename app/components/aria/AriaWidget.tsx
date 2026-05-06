'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AriaCharacter } from '../ui/AriaCharacter';
import { useAria } from '../../hooks/useAria';

export function AriaWidget() {
  const router = useRouter();
  const { name, personality, voice } = useAria();
  const [open, setOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate  = personality === 'hype' ? 1.25 : personality === 'calm' ? 0.85 : 1.0;
    utt.pitch = voice === 'feminine-soft' ? 1.2 : 0.95;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend   = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [personality, voice]);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => speak(`Hi! I'm ${name}. Need help?`), 300);
  };

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          onClick={handleOpen}
          style={{
            position: 'fixed', bottom: '28px', right: '28px', zIndex: 500,
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #A78BFA, #7B2FFF)',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(123,47,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', transition: 'transform 0.2s',
            animation: 'aria-pulse 3s ease-in-out infinite',
          }}
        >
          ✦
        </button>
      )}

      {/* Mini panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 500,
          width: '260px',
          background: 'rgba(10,10,20,0.95)',
          border: '1px solid rgba(167,139,250,0.25)',
          borderRadius: '20px', overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(123,47,255,0.15)',
        }}>
          {/* Mini Aria */}
          <div style={{ position: 'relative', height: '180px' }}>
            <AriaCharacter
              emotion={isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'}
              isSpeaking={isSpeaking}
              isListening={isListening}
              interactive={false}
              height="180px"
              fov={45}
              showGlow
            />
            <button onClick={() => { setOpen(false); window.speechSynthesis?.cancel(); }} style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '26px', height: '26px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', fontSize: '12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Widget controls */}
          <div style={{ padding: '14px 16px 18px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '12px', textAlign: 'center' }}>
              {isSpeaking ? `${name} is speaking...` : `Hey! I'm ${name}`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <button onClick={() => router.push('/aria')} style={{
                padding: '9px 0', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                background: 'rgba(167,139,250,0.15)', color: '#A78BFA',
                border: '1px solid rgba(167,139,250,0.25)', cursor: 'pointer',
              }}>
                Open {name}
              </button>
              <button onClick={() => speak("I'm here to help! What do you need?")} style={{
                padding: '9px 0', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                background: 'rgba(52,211,153,0.12)', color: '#34D399',
                border: '1px solid rgba(52,211,153,0.2)', cursor: 'pointer',
              }}>
                🎙️ Ask me
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aria-pulse {
          0%, 100% { box-shadow: 0 4px 24px rgba(123,47,255,0.5); }
          50%       { box-shadow: 0 4px 40px rgba(123,47,255,0.8), 0 0 0 8px rgba(123,47,255,0.1); }
        }
      `}</style>
    </>
  );
}