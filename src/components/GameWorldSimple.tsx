import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../hooks/useGameStore';
import * as THREE from 'three';

export const GameWorld = () => {
  const { camera } = useThree();
  const { gameState } = useGameStore();

  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Simple ground */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      
      {/* Test cube */}
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color="#ff4444" />
      </mesh>
    </>
  );
};