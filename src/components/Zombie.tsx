import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Zombie as ZombieType } from '../hooks/useGameStore';
import * as THREE from 'three';

interface ZombieProps {
  zombie: ZombieType;
}

export const Zombie = ({ zombie }: ZombieProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle bobbing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3 + zombie.x) * 0.1;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y = zombie.rotation;
    }
  });

  return (
    <group ref={groupRef} position={[zombie.x, 0, zombie.z]}>
      {/* Zombie body */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.7, 1.8, 0.4]} />
        <meshLambertMaterial color="#2a5a2a" />
      </mesh>

      {/* Zombie head */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.35]} />
        <meshLambertMaterial color="#4a4a2a" />
      </mesh>

      {/* Eyes (glowing red) */}
      <mesh position={[-0.1, 2.3, 0.3]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.1, 2.3, 0.3]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Health bar */}
      <group position={[0, 2.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.08]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        <mesh position={[-(0.4 - (zombie.health / 50) * 0.4), 0, 0.01]}>
          <planeGeometry args={[(zombie.health / 50) * 0.8, 0.06]} />
          <meshBasicMaterial color={zombie.health > 25 ? '#ff4444' : '#aa2222'} />
        </mesh>
      </group>

      {/* Danger indicator ring */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1, 1.2, 8]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.2} />
      </mesh>

      {/* Arms (hanging down for zombie effect) */}
      <mesh position={[-0.5, 0.8, 0]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshLambertMaterial color="#2a4a2a" />
      </mesh>
      <mesh position={[0.5, 0.8, 0]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshLambertMaterial color="#2a4a2a" />
      </mesh>
    </group>
  );
};