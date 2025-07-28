import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Player as PlayerType } from '../hooks/useGameStore';
import * as THREE from 'three';

interface PlayerProps {
  player: PlayerType;
  isLocalPlayer: boolean;
}

export const Player = ({ player, isLocalPlayer }: PlayerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = player.rotation;
    }
  });

  // Don't render the local player's body (first person view)
  if (isLocalPlayer) {
    return null;
  }

  const teamColor = player.team === 'human' ? '#00aaff' : '#ff4444';

  return (
    <group position={[player.x, 0, player.z]}>
      {/* Player body */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.3]} />
        <meshLambertMaterial color={teamColor} />
      </mesh>

      {/* Player head */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshLambertMaterial color={teamColor} />
      </mesh>

      {/* Name tag */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color={teamColor}
        anchorX="center"
        anchorY="middle"
      >
        {player.name}
      </Text>

      {/* Health bar */}
      <group position={[0, 2.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        <mesh position={[-(0.5 - (player.health / 100) * 0.5), 0, 0.01]}>
          <planeGeometry args={[(player.health / 100), 0.08]} />
          <meshBasicMaterial color={player.health > 50 ? '#00ff00' : player.health > 25 ? '#ffff00' : '#ff0000'} />
        </mesh>
      </group>

      {/* Team indicator */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 8]} />
        <meshBasicMaterial color={teamColor} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};