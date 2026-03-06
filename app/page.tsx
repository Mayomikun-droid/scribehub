'use client'
import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/landing/LandingPage';

export default function Page() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered && <LoadingScreen onComplete={() => setEntered(true)} />}
      <main style={{ opacity: entered ? 1 : 0 }}>
        <LandingPage />
      </main>
    </>
  );
}
