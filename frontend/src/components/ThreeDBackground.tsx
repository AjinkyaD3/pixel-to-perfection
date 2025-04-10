
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
}

function FloatingShape({ position, rotation, scale, color }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = rotation[0] + state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = rotation[1] + state.clock.getElapsedTime() * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

function TrailEffect({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 3;
      ref.current.position.y = Math.cos(state.clock.getElapsedTime() * 0.3) * 2;
    }
  });
  
  return (
    <Trail width={1} color={'#00eeff'} length={5} decay={1} attenuation={(width: number) => width}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={'#00eeff'} />
      </mesh>
    </Trail>
  );
}

function Scene() {
  const shapes = [
    { position: [-2, 0, -3] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 0.5, color: '#00eeff' },
    { position: [2, 1, -5] as [number, number, number], rotation: [1, 1, 0] as [number, number, number], scale: 0.7, color: '#9d4edd' },
    { position: [-1, -1, -4] as [number, number, number], rotation: [1, 0, 1] as [number, number, number], scale: 0.3, color: '#00ff9f' },
    { position: [3, -1, -6] as [number, number, number], rotation: [0, 1, 1] as [number, number, number], scale: 0.6, color: '#ff00ff' },
    { position: [0, 1, -8] as [number, number, number], rotation: [1, 1, 1] as [number, number, number], scale: 1, color: '#00eeff' }
  ];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00eeff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9d4edd" />
      <fog attach="fog" color="#070b1a" near={1} far={15} />
      
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
      
      <TrailEffect position={[0, 0, -3]} />
      <TrailEffect position={[-2, 1, -4]} />
    </>
  );
}

export default function ThreeDBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-70">
      <Canvas dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
