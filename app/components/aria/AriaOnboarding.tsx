'use client';

import { useState, useEffect, useRef } from 'react';
import { AriaCharacter } from '../ui/AriaCharacter';
import { useAria, AriaVoice, AriaPersonality, AriaLanguage } from '../../hooks/useAria';
import gsap from 'gsap';

const VOICE_OPTIONS: { value: AriaVoice; label: string; desc: string }[] = [
  { value: 'feminine-soft',  label: 'Soft',    desc: 'Warm and gentle' },
  { value: 'feminine-bold',  label: 'Bold',    desc: 'Strong and clear' },
  { value: 'neutral',        label: 'Neutral', desc: 'Balanced tone' },
];

const PERSONALITY_OPTIONS: { value: AriaPersonality; label: string; emoji: string; desc: string }[] = [
  { value: 'friendly', label: 'Friendly', emoji: '😊', desc: 'Warm, casual, encouraging' },
  { value: 'formal',   label: 'Formal',   emoji: '💼', desc: 'Professional and precise' },
  { value: 'hype',     label: 'Hype',     emoji: '🔥', desc: 'Energetic and motivating' },
  { value: 'calm',     label: 'Calm',     emoji: '🧘', desc: 'Soothing and focused' },
];

const LANGUAGE_OPTIONS: { value: AriaLanguage; label: string; native: string }[] = [
  { value: 'en',  label: 'English', native: 'English' },
  { value: 'pcm', label: 'Pidgin',  native: 'Naija Pidgin' },
  { value: 'yo',  label: 'Yoruba',  native: 'Yorùbá' },
  { value: 'ha',  label: 'Hausa',   native: 'Hausa' },
  { value: 'ig',  label: 'Igbo',    native: 'Igbo' },
  { value: 'fr',  label: 'French',  native: 'Français' },
];

const ARIA_GREETINGS: Record<AriaPersonality, string[]> = {
  friendly: ["Hi! I'm so excited to meet you 🎉", "What would you like to call me?", "You can name me anything you like!"],
  formal:   ["Good day. I am your AI assistant.", "How shall I address you?", "Please select your preferred settings."],
  hype:     ["YO! Let's GOOO! 🚀🔥", "I'm your AI hype person!", "Name me something fire!"],
  calm:     ["Hello... I'm here with you.", "Take your time. What feels right?", "We can do this together, gently."],
};

interface AriaOnboardingProps {
  onComplete: () => void;
}

export function AriaOnboarding({ onComplete }: AriaOnboardingProps) {
  const { setName, setVoice, setPersonality, setLanguage, setOnboarded, setEmotion } = useAria();

  const [step, setStep] = useState(0);
  const [inputName, setInputName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<AriaVoice>('feminine-soft');
  const [selectedPersonality, setSelectedPersonality] = useState<AriaPersonality>('friendly');
  const [selectedLanguage, setSelectedLanguage] = useState<AriaLanguage>('en');
  const [emotion, setLocalEmotion] = useState<'idle' | 'happy' | 'speaking' | 'listening'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const STEPS = ['name', 'personality', 'voice', 'language', 'done'];

  // Speak a line using Web Speech API
  const speak = (text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = selectedPersonality === 'hype' ? 1.3 : selectedPersonality === 'calm' ? 0.85 : 1.0;
    utt.pitch = selectedVoice === 'feminine-soft' ? 1.2 : selectedVoice === 'feminine-bold' ? 0.95 : 1.05;
    utt.onstart = () => { setIsSpeaking(true); setLocalEmotion('speaking'); };
    utt.onend   = () => { setIsSpeaking(false); setLocalEmotion('idle'); onEnd?.(); };
    window.speechSynthesis.speak(utt);
  };

  // Animate step transitions
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    );
  }, [step]);

  // Greet on mount
  useEffect(() => {
    setTimeout(() => {
      speak(ARIA_GREETINGS[selectedPersonality][0]);
    }, 800);
  }, []);

  const handleNext = () => {
    if (step === 0 && inputName.trim().length < 2) return;
    if (step === STEPS.length - 2) {
      // Save everything
      setName(inputName || 'Aria');
      setVoice(selectedVoice);
      setPersonality(selectedPersonality);
      setLanguage(selectedLanguage);
      setEmotion('happy');
      setLocalEmotion('happy');
      speak(`Amazing! I'm ${inputName || 'Aria'} now. Let's do this together!`, () => {
        setOnboarded();
        setTimeout(onComplete, 600);
      });
      setStep(p => p + 1);
      return;
    }
    setStep(p => p + 1);
  };

  const handlePersonalitySelect = (p: AriaPersonality) => {
    setSelectedPersonality(p);
    speak(ARIA_GREETINGS[p][1]);
    setLocalEmotion('happy');
    setTimeout(() => setLocalEmotion('idle'), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(7,7,15,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Syne', 'DM Sans', system-ui, sans-serif",
      padding: '20px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Aria 3D */}
      <div style={{ width: '100%', maxWidth: '260px' }}>
        <AriaCharacter
          emotion={emotion}
          isSpeaking={isSpeaking}
          isListening={false}
          height="320px"
          showGlow
        />
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
        {STEPS.slice(0, -1).map((_, i) => (
          <div key={i} style={{
            width: i === step ? '24px' : '6px',
            height: '6px', borderRadius: '99px',
            background: i <= step ? '#A78BFA' : 'rgba(255,255,255,0.12)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>

        {/* STEP 0 — Name Aria */}
        {step === 0 && (
          <div>
            <p style={{ fontSize: '13px', color: '#A78BFA', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>STEP 1 OF 4</p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#fff', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>
              What's my name?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '28px' }}>
              I'll respond to whatever you call me. Make it yours.
            </p>
            <input
              autoFocus
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
              placeholder="Type a name... (e.g. Aria, Nova, Zara)"
              style={{
                width: '100%', padding: '16px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '12px', color: '#fff',
                fontSize: '18px', fontWeight: 700,
                fontFamily: 'Syne, sans-serif',
                textAlign: 'center', outline: 'none',
                marginBottom: '16px',
              }}
            />
            {inputName.length > 1 && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                Hello, I'm <span style={{ color: '#A78BFA', fontWeight: 700 }}>{inputName}</span> 👋
              </p>
            )}
          </div>
        )}

        {/* STEP 1 — Personality */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: '13px', color: '#A78BFA', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>STEP 2 OF 4</p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#fff', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>
              How should I act?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>
              Pick my personality. You can always change this later.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
              {PERSONALITY_OPTIONS.map(({ value, label, emoji, desc }) => (
                <button key={value} onClick={() => handlePersonalitySelect(value)} style={{
                  padding: '16px 12px', borderRadius: '12px',
                  background: selectedPersonality === value ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedPersonality === value ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>{emoji}</div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: selectedPersonality === value ? '#A78BFA' : '#fff' }}>{label}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Voice */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: '13px', color: '#A78BFA', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>STEP 3 OF 4</p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#fff', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>
              Pick my voice.
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>
              Tap each one to hear how I sound.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
              {VOICE_OPTIONS.map(({ value, label, desc }) => (
                <button key={value} onClick={() => {
                  setSelectedVoice(value);
                  speak(`Hi! This is my ${label} voice. Do you like it?`);
                }} style={{
                  padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                  background: selectedVoice === value ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedVoice === value ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: selectedVoice === value ? '#A78BFA' : '#fff' }}>{label}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                  </div>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: selectedVoice === value ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                  }}>🔊</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — Language */}
        {step === 3 && (
          <div>
            <p style={{ fontSize: '13px', color: '#A78BFA', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>STEP 4 OF 4</p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#fff', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>
              What language?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>
              I'll speak and understand you in this language.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '8px' }}>
              {LANGUAGE_OPTIONS.map(({ value, label, native }) => (
                <button key={value} onClick={() => setSelectedLanguage(value)} style={{
                  padding: '14px 10px', borderRadius: '12px', cursor: 'pointer',
                  background: selectedLanguage === value ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedLanguage === value ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.2s', textAlign: 'center',
                }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: selectedLanguage === value ? '#A78BFA' : '#fff' }}>{label}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{native}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — Done */}
        {step === 4 && (
          <div>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#fff', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>
              We're ready.
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
              Setting up your experience...
            </p>
          </div>
        )}

        {/* Next button */}
        {step < 4 && (
          <button onClick={handleNext} style={{
            marginTop: '20px', width: '100%', padding: '14px 0',
            borderRadius: '12px', fontSize: '15px', fontWeight: 700,
            background: 'linear-gradient(135deg, #A78BFA, #7B2FFF)',
            color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(123,47,255,0.4)',
            opacity: step === 0 && inputName.trim().length < 2 ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}>
            {step === 3 ? `Let's go →` : 'Continue →'}
          </button>
        )}

        {step > 0 && step < 4 && (
          <button onClick={() => setStep(p => p - 1)} style={{
            marginTop: '10px', width: '100%', padding: '10px 0',
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
            fontSize: '13px', cursor: 'pointer',
          }}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}