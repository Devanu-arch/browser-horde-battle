import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Text, Box, Plane } from '@react-three/drei';
import { useGameStore } from '../hooks/useGameStore';
import { Player } from './Player';
import { Zombie } from './Zombie';
import { Environment } from './Environment';
import * as THREE from 'three';

export const GameWorld = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>();
  const { 
    gameState, 
    playerTeam, 
    movePlayer, 
    shootBullet,
    updatePlayerRotation 
  } = useGameStore();

  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          movement.current.forward = true;
          break;
        case 'KeyS':
          movement.current.backward = true;
          break;
        case 'KeyA':
          movement.current.left = true;
          break;
        case 'KeyD':
          movement.current.right = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          movement.current.forward = false;
          break;
        case 'KeyS':
          movement.current.backward = false;
          break;
        case 'KeyA':
          movement.current.left = false;
          break;
        case 'KeyD':
          movement.current.right = false;
          break;
      }
    };

    const handleClick = () => {
      if (controlsRef.current?.isLocked) {
        shootBullet();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('click', handleClick);
    };
  }, [shootBullet]);

  useFrame((state, delta) => {
    if (!controlsRef.current?.isLocked) return;

    const controls = controlsRef.current;
    const velocity = new THREE.Vector3();

    if (movement.current.forward) velocity.z -= 1;
    if (movement.current.backward) velocity.z += 1;
    if (movement.current.left) velocity.x -= 1;
    if (movement.current.right) velocity.x += 1;

    if (velocity.length() > 0) {
      velocity.normalize();
      velocity.multiplyScalar(5 * delta); // Movement speed
      
      // Transform velocity relative to camera direction
      const direction = new THREE.Vector3();
      controls.getDirection(direction);
      const forward = new THREE.Vector3(direction.x, 0, direction.z).normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));
      
      const movement = new THREE.Vector3()
        .addScaledVector(forward, -velocity.z)
        .addScaledVector(right, velocity.x);
      
      camera.position.add(movement);
      movePlayer(camera.position.x, camera.position.z);
    }

    // Update player rotation based on camera
    const direction = new THREE.Vector3();
    controls.getDirection(direction);
    updatePlayerRotation(Math.atan2(direction.x, direction.z));
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#404040" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ff4444" />

      {/* Environment */}
      <Environment />

      {/* Render all players */}
      {Object.values(gameState.players).map(player => (
        <Player 
          key={player.id} 
          player={player}
          isLocalPlayer={player.team === playerTeam}
        />
      ))}

      {/* Render zombies */}
      {gameState.zombies.map(zombie => (
        <Zombie key={zombie.id} zombie={zombie} />
      ))}

      {/* Render bullets */}
      {gameState.bullets.map(bullet => (
        <mesh key={bullet.id} position={[bullet.x, bullet.y, bullet.z]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={bullet.team === 'human' ? '#00aaff' : '#ff4444'} />
        </mesh>
      ))}
    </>
  );
};