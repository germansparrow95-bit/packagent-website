"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Vector3 = [number, number, number];

function EdgedPanel({
  args,
  color = "#e7dfcc",
  opacity = 1,
}: {
  args: Vector3;
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => new THREE.BoxGeometry(...args), [args]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.68}
          metalness={0.02}
          clearcoat={0.22}
          clearcoatRoughness={0.62}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#605d55" transparent opacity={0.72} />
      </lineSegments>
    </>
  );
}

function PackagingBox() {
  const scene = useRef<THREE.Group>(null);
  const back = useRef<THREE.Group>(null);
  const front = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.getElapsedTime();
    const intro = Math.min(1, elapsed / 1.75);
    const eased = 1 - Math.pow(1 - intro, 3);
    const progress = 0.08 + eased * 0.9;

    if (back.current) back.current.rotation.x = -Math.PI * 0.5 * (1 - progress);
    if (front.current) front.current.rotation.x = Math.PI * 0.5 * (1 - progress);
    if (left.current) left.current.rotation.z = -Math.PI * 0.5 * (1 - progress);
    if (right.current) right.current.rotation.z = Math.PI * 0.5 * (1 - progress);
    if (lid.current) {
      lid.current.rotation.x = -0.42 - Math.sin(elapsed * 0.72) * 0.035;
    }
    if (scene.current) {
      scene.current.rotation.x = 0.08 + pointer.y * 0.045;
      scene.current.rotation.y = -0.56 + pointer.x * 0.12 + Math.sin(elapsed * 0.3) * 0.025;
      scene.current.position.y = 0.12 + Math.sin(elapsed * 0.75) * 0.035;
    }
  });

  return (
    <group ref={scene} position={[0, 0.1, 0]} rotation={[0.08, -0.56, 0]}>
      <group position={[0, -0.88, 0]}>
        <EdgedPanel args={[3.25, 0.075, 2.25]} color="#ded5c3" />
      </group>

      <group ref={back} position={[0, -0.84, -1.0875]}>
        <group position={[0, 0.9, 0]}>
          <EdgedPanel args={[3.25, 1.8, 0.075]} />
          <mesh position={[0.35, 0.18, -0.043]}>
            <boxGeometry args={[0.82, 0.42, 0.012]} />
            <meshStandardMaterial color="#20211f" roughness={0.62} />
          </mesh>
        </group>
      </group>

      <group ref={front} position={[0, -0.84, 1.0875]}>
        <group position={[0, 0.9, 0]}>
          <EdgedPanel args={[3.25, 1.8, 0.075]} />
          <mesh position={[-0.55, 0.1, 0.043]}>
            <boxGeometry args={[0.9, 0.08, 0.012]} />
            <meshStandardMaterial color="#888276" roughness={0.8} />
          </mesh>
        </group>
      </group>

      <group ref={left} position={[-1.5875, -0.84, 0]}>
        <group position={[0, 0.9, 0]}>
          <EdgedPanel args={[0.075, 1.8, 2.25]} color="#e9e1d1" />
        </group>
      </group>

      <group ref={right} position={[1.5875, -0.84, 0]}>
        <group position={[0, 0.9, 0]}>
          <EdgedPanel args={[0.075, 1.8, 2.25]} color="#e2d9c7" />
        </group>
      </group>

      <group ref={lid} position={[0, 0.94, -1.08]}>
        <group position={[0, 0, 1.09]}>
          <EdgedPanel args={[3.25, 0.075, 2.25]} color="#efe8da" opacity={0.97} />
          <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.62, 0.22]} />
            <meshStandardMaterial color="#b3aa98" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function ShadowFloor() {
  return (
    <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[4.5, 64]} />
      <meshStandardMaterial color="#f2f1ed" roughness={1} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#f5f5f7", 8, 18]} />
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#ffffff", "#d7d1c6", 1.1]} />
      <directionalLight
        position={[5, 8, 7]}
        intensity={3.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[-5, 4, 4]} intensity={28} angle={0.55} penumbra={0.9} color="#fff8ea" />
      <pointLight position={[3, 0, 4]} intensity={10} color="#dce9ff" />
      <PackagingBox />
      <ShadowFloor />
    </>
  );
}

export function HeroScene() {
  const [webglReady, setWebglReady] = useState(false);

  return (
    <div className="hero-stage" aria-label="PackAgent 包装盒三维预览">
      <div className="stage-glow" />
      <div className="stage-grid" />
      <div
        className={`fallback-box-scene ${webglReady ? "is-hidden" : ""}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 760 620">
          <defs>
            <linearGradient id="fallback-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fffdf8" />
              <stop offset="1" stopColor="#e9e0d0" />
            </linearGradient>
            <linearGradient id="fallback-front" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#eee7da" />
              <stop offset="1" stopColor="#d4c9b5" />
            </linearGradient>
            <linearGradient id="fallback-left" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ddd3c0" />
              <stop offset="1" stopColor="#bdb19c" />
            </linearGradient>
            <linearGradient id="fallback-right" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d8cebb" />
              <stop offset="1" stopColor="#aa9e89" />
            </linearGradient>
            <filter id="fallback-shadow">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <ellipse
            cx="430"
            cy="522"
            rx="225"
            ry="52"
            fill="#aca18e"
            opacity=".22"
            filter="url(#fallback-shadow)"
          />
          <path
            d="M180 280 360 390 360 560 180 450Z"
            fill="url(#fallback-left)"
            stroke="#766f63"
            strokeWidth="2"
          />
          <path
            d="M470 220 650 330 650 500 470 390Z"
            fill="url(#fallback-right)"
            stroke="#766f63"
            strokeWidth="2"
          />
          <path
            d="M360 390 650 330 650 500 360 560Z"
            fill="url(#fallback-front)"
            stroke="#766f63"
            strokeWidth="2"
          />
          <path
            d="M180 280 470 220 650 330 360 390Z"
            fill="url(#fallback-top)"
            stroke="#766f63"
            strokeWidth="2"
          />
          <path
            d="M325 250 505 360"
            stroke="#766f63"
            strokeWidth="1.2"
            opacity=".62"
          />
          <path
            d="M490 274 548 257 570 276 512 294Z"
            fill="#2c2b28"
            opacity=".82"
            stroke="#766f63"
            strokeWidth="1"
          />
          <path
            d="M452 430 565 407 565 452 452 475Z"
            fill="#2b2a27"
            opacity=".78"
          />
          <path d="M472 445h66M472 454h43" stroke="#e8e1d4" strokeWidth="1" />
          <path
            d="M206 301v137M492 240v137M383 405v142"
            stroke="#f8f3e9"
            strokeWidth="1"
            opacity=".28"
          />
        </svg>
      </div>
      <Canvas
        shadows="basic"
        dpr={[1, 1.7]}
        camera={{ position: [6.6, 5.1, 8.2], fov: 31 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setWebglReady(true)}
      >
        <Scene />
      </Canvas>

      <div className="stage-chip stage-chip-top">
        <span className="status-dot" />
        同一规格版本
      </div>
      <div className="stage-chip stage-chip-bottom">
        <span>BLENDER</span>
        <strong>5.2.2 LTS</strong>
      </div>

      <div className="dimension dimension-width" aria-hidden="true">
        <span />
        300 mm
      </div>
      <div className="dimension dimension-height" aria-hidden="true">
        <span />
        200 mm
      </div>
      <div className="dimension dimension-depth" aria-hidden="true">
        <span />
        50 mm
      </div>
    </div>
  );
}
