import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export const Environment = () => {
  const { scene } = useThree();

  useEffect(() => {
    // Add fog to the scene
    scene.fog = new THREE.Fog('#1a1a2e', 10, 50);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>

      {/* Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#2a3a2a" />
      </mesh>

      {/* Grid pattern on ground */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#333a33" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Walls/Barriers */}
      {/* North wall */}
      <mesh position={[0, 2, -25]} castShadow receiveShadow>
        <boxGeometry args={[50, 4, 1]} />
        <meshLambertMaterial color="#4a4a4a" />
      </mesh>

      {/* South wall */}
      <mesh position={[0, 2, 25]} castShadow receiveShadow>
        <boxGeometry args={[50, 4, 1]} />
        <meshLambertMaterial color="#4a4a4a" />
      </mesh>

      {/* East wall */}
      <mesh position={[25, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 4, 50]} />
        <meshLambertMaterial color="#4a4a4a" />
      </mesh>

      {/* West wall */}
      <mesh position={[-25, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 4, 50]} />
        <meshLambertMaterial color="#4a4a4a" />
      </mesh>

      {/* Cover objects */}
      {/* Crates */}
      <mesh position={[8, 1, 8]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      <mesh position={[-12, 1, -6]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      <mesh position={[15, 1, -10]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 2]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Pillars */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 5]} />
        <meshLambertMaterial color="#666666" />
      </mesh>

      <mesh position={[-10, 2.5, 10]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 5]} />
        <meshLambertMaterial color="#666666" />
      </mesh>

      <mesh position={[12, 2.5, -8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 5]} />
        <meshLambertMaterial color="#666666" />
      </mesh>

      {/* Scattered debris */}
      <mesh position={[5, 0.2, -15]} rotation={[0.1, 0.3, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 0.3]} />
        <meshLambertMaterial color="#555555" />
      </mesh>

      <mesh position={[-8, 0.15, 12]} rotation={[0.2, -0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshLambertMaterial color="#555555" />
      </mesh>

      {/* Ambient particles effect */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={new Float32Array(Array.from({ length: 150 }, () => (Math.random() - 0.5) * 60))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#666666" transparent opacity={0.3} />
      </points>
    </>
  );
};