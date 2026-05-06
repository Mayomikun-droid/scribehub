'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { AriaEmotion } from '../../hooks/useAria';

const EMOTION_CONFIG: Record<AriaEmotion, {
  floatSpeed: number; floatAmp: number;
  headTilt: number; scale: number;
}> = {
  idle:      { floatSpeed: 0.6,  floatAmp: 0.018, headTilt: 0,     scale: 1    },
  speaking:  { floatSpeed: 1.2,  floatAmp: 0.030, headTilt: 0.03,  scale: 1.01 },
  listening: { floatSpeed: 0.5,  floatAmp: 0.012, headTilt: -0.05, scale: 1    },
  thinking:  { floatSpeed: 0.35, floatAmp: 0.010, headTilt: 0.07,  scale: 0.99 },
  happy:     { floatSpeed: 1.6,  floatAmp: 0.045, headTilt: 0.04,  scale: 1.02 },
  surprised: { floatSpeed: 2.0,  floatAmp: 0.060, headTilt: -0.03, scale: 1.03 },
};

function AriaModel({
  emotion, isSpeaking, walkOffset,
}: {
  emotion: AriaEmotion; isSpeaking: boolean; walkOffset: React.MutableRefObject<number>;
}) {
  const { scene } = useGLTF('/Ready_aria.glb');
  const groupRef = useRef<THREE.Group>(null);
  const t = useRef(0);

  // Clone to avoid mutation issues
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(m => m.clone());
        } else {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    t.current += delta;
    const cfg = EMOTION_CONFIG[emotion];

    // Idle float
    groupRef.current.position.y =
      Math.sin(t.current * cfg.floatSpeed) * cfg.floatAmp;

    // Walk left-right
    groupRef.current.position.x = Math.sin(t.current * 0.3) * 1.2;
    groupRef.current.rotation.y =
      Math.cos(t.current * 0.3) * 0.15 + (Math.sin(t.current * 0.3) > 0 ? 0.1 : -0.1);

    // Head tilt
    groupRef.current.rotation.x +=
      (cfg.headTilt - groupRef.current.rotation.x) * 0.04;

    // Speaking micro-bob
    if (isSpeaking) {
      groupRef.current.rotation.z = Math.sin(t.current * 12) * 0.008;
    } else {
      groupRef.current.rotation.z *= 0.9;
    }

    // Scale
    const ts = cfg.scale * 1;
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (ts - groupRef.current.scale.x) * 0.06
    );

    walkOffset.current = groupRef.current.position.x;
  });

  return (
    <primitive
      ref={groupRef}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

// Camera that frames Aria properly — full body
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.1, 3.2);
    camera.lookAt(0, 0.9, 0);
  }, [camera]);
  return null;
}

export interface AriaCharacterProps {
  emotion?: AriaEmotion;
  isSpeaking?: boolean;
  isListening?: boolean;
  interactive?: boolean;
  autoRotate?: boolean;
  height?: string | number;
  width?: string | number;
  fov?: number;
  showGlow?: boolean;
  style?: React.CSSProperties;
  walkOffset?: React.MutableRefObject<number>;
}

export function AriaCharacter({
  emotion = 'idle',
  isSpeaking = false,
  isListening = false,
  height = '500px',
  width = '100%',
  showGlow = true,
  style,
}: AriaCharacterProps) {
  const walkRef = useRef(0);

  return (
    <div style={{ width, height, position: 'relative', ...style }}>
      <Canvas
        camera={{ position: [0, 1.1, 3.2], fov: 42 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <CameraRig />
        <ambientLight intensity={0.4} color="#9D4EDD" />
        <directionalLight position={[2, 5, 3]} intensity={1.4} color="#ffffff" castShadow />
        <pointLight position={[-2, 2, -1]} intensity={0.8} color="#7B2FFF" />
        <pointLight position={[2, 1, 2]} intensity={0.5} color="#C084FC" />
        {isSpeaking && <pointLight position={[0, 2, 2]} intensity={1.8} color="#E879F9" />}
        {isListening && <pointLight position={[0, 2, 2]} intensity={1.4} color="#34D399" />}

        <Suspense fallback={null}>
          <AriaModel emotion={emotion} isSpeaking={isSpeaking} walkOffset={walkRef} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/Ready_aria.glb');